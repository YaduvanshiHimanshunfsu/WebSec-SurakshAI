"""
Active Engine DAST Extensibility — Probes for SSRF, CORS, and JWT Vulnerabilities.
"""
import requests
import jwt
import logging
from urllib.parse import urlparse, parse_qs, urlencode

logger = logging.getLogger(__name__)

# Cloud Metadata Probes for SSRF Detection
SSRF_TARGETS = [
    ("http://169.254.169.254/latest/meta-data/", "AWS Instance Metadata"),
    ("http://169.254.169.254/computeMetadata/v1/", "GCP Metadata"),
    ("http://169.254.169.254/metadata/instance?api-version=2021-02-01", "Azure Instance Metadata"),
]


def audit_ssrf_probes(base_url: str, param_name: str, session: requests.Session = None) -> list[dict]:
    """Test parameter for Server-Side Request Forgery (SSRF) vulnerabilities."""
    s = session or requests.Session()
    findings = []
    parsed = urlparse(base_url)
    qs = parse_qs(parsed.query)

    for probe_url, provider in SSRF_TARGETS:
        try:
            qs[param_name] = [probe_url]
            test_url = parsed._replace(query=urlencode(qs, doseq=True)).geturl()
            resp = s.get(test_url, timeout=5, headers={"Metadata-Flavor": "Google"})

            if resp.status_code == 200 and any(keyword in resp.text for keyword in ["ami-id", "instance-id", "computeMetadata", "azEnvironment"]):
                findings.append({
                    "category": "ssrf",
                    "severity": "critical",
                    "title": f"Critical SSRF Vulnerability Detected ({provider})",
                    "description": f"Parameter '{param_name}' reflects responses from internal Cloud Metadata service ({probe_url}).",
                    "evidence": f"Payload: {probe_url}\n\nSnippet: {resp.text[:200]}",
                    "what_it_means": "SSRF allows attackers to query internal cloud infrastructure, leak credentials, or access private endpoints.",
                    "remediation": "Restrict parameter input to validated URL allowlists and block outbound connections to 169.254.169.254.",
                })
                break
        except Exception as e:
            logger.debug("SSRF probe failed for %s: %s", probe_url, e)

    return findings


def audit_cors_policy(base_url: str, session: requests.Session = None) -> list[dict]:
    """Test Cross-Origin Resource Sharing (CORS) misconfigurations."""
    s = session or requests.Session()
    findings = []

    test_origins = [
        "https://evil-attacker.com",
        "null"
    ]

    for origin in test_origins:
        try:
            resp = s.options(base_url, headers={"Origin": origin, "Access-Control-Request-Method": "GET"}, timeout=5)
            if resp.headers.get("Access-Control-Allow-Origin") == origin and resp.headers.get("Access-Control-Allow-Credentials") == "true":
                findings.append({
                    "category": "cors",
                    "severity": "high",
                    "title": f"Insecure CORS Policy ({'Reflected Arbitrary Origin' if origin != 'null' else 'Null Origin Allowed'})",
                    "description": f"Target reflects untrusted origin '{origin}' with Access-Control-Allow-Credentials: true.",
                    "evidence": f"Origin: {origin}\nResponse Header: Access-Control-Allow-Origin: {resp.headers.get('Access-Control-Allow-Origin')}",
                    "what_it_means": "Insecure CORS configurations allow malicious sites to read authenticated user data across origins.",
                    "remediation": "Never reflect arbitrary Origin headers when Access-Control-Allow-Credentials is true. Use a strict domain allowlist.",
                })
                break
        except Exception as e:
            logger.debug("CORS audit failed for %s: %s", origin, e)

    return findings


def audit_jwt_token(token_str: str) -> list[dict]:
    """Audit JWT bearer tokens for algorithm confusion (alg: none) and weak signatures."""
    findings = []
    try:
        header = jwt.get_unverified_header(token_str)
        alg = header.get("alg", "").lower()

        if alg == "none":
            findings.append({
                "category": "jwt",
                "severity": "critical",
                "title": "JWT Vulnerability: Unsigned Token (alg: none)",
                "description": "The JWT uses algorithm 'none', allowing attackers to alter claims without a valid signature.",
                "evidence": f"Header: {header}",
                "what_it_means": "Unsigned JWTs permit authentication bypass and full token forgery.",
                "remediation": "Enforce strong asymmetric (RS256) or symmetric (HS256) algorithms and explicitly reject 'none'.",
            })

        if alg == "hs256":
            # Test weak secrets
            weak_keys = ["secret", "123456", "password", "jwt_secret", "admin"]
            for key in weak_keys:
                try:
                    jwt.decode(token_str, key, algorithms=["HS256"])
                    findings.append({
                        "category": "jwt",
                        "severity": "critical",
                        "title": f"JWT Vulnerability: Weak Secret Key ('{key}')",
                        "description": f"The JWT signature was successfully verified using weak secret key '{key}'.",
                        "evidence": f"Decoded with key: {key}",
                        "what_it_means": "Weak secrets allow attackers to offline brute-force the signing key and forge tokens.",
                        "remediation": "Use a cryptographically secure random secret of at least 256 bits (32 bytes).",
                    })
                    break
                except jwt.InvalidTokenError:
                    pass
    except Exception as e:
        logger.debug("JWT audit failed: %s", e)

    return findings
