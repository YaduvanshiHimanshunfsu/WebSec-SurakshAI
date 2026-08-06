import logging
import requests
import urllib3
from flask import current_app
from http.cookiejar import CookieJar

# Suppress InsecureRequestWarning from verify=False (intentional for passive header checks)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Known-good headers and their check logic
SECURITY_HEADERS = {
    'Content-Security-Policy': {
        'severity': 'high',
        'title': 'Missing Content-Security-Policy Header',
        'what_it_means': 'Without CSP, attackers can inject malicious scripts into your pages via XSS attacks.',
        'remediation': "Add to your server: Content-Security-Policy: default-src 'self'"
    },
    'Strict-Transport-Security': {
        'severity': 'high',
        'title': 'Missing HSTS Header',
        'what_it_means': 'Without HSTS, browsers may load your site over insecure HTTP, enabling SSL-stripping attacks.',
        'remediation': "Add: Strict-Transport-Security: max-age=31536000; includeSubDomains"
    },
    'X-Frame-Options': {
        'severity': 'medium',
        'title': 'Missing X-Frame-Options Header',
        'what_it_means': 'Your site can be embedded in an iframe, enabling clickjacking attacks.',
        'remediation': "Add: X-Frame-Options: DENY"
    },
    'X-Content-Type-Options': {
        'severity': 'medium',
        'title': 'Missing X-Content-Type-Options Header',
        'what_it_means': 'Browsers may try to "sniff" content types, enabling MIME-confusion attacks.',
        'remediation': "Add: X-Content-Type-Options: nosniff"
    },
    'Referrer-Policy': {
        'severity': 'low',
        'title': 'Missing Referrer-Policy Header',
        'what_it_means': 'Full URL may be sent to third parties in the Referer header, leaking sensitive path info.',
        'remediation': "Add: Referrer-Policy: strict-origin-when-cross-origin"
    },
    'Permissions-Policy': {
        'severity': 'low',
        'title': 'Missing Permissions-Policy Header',
        'what_it_means': 'No restrictions on browser features like camera, microphone, or geolocation.',
        'remediation': "Add: Permissions-Policy: geolocation=(), microphone=(), camera=()"
    },
}

def check_headers(url: str) -> dict:
    findings = []
    raw_headers = {}

    logger = logging.getLogger(__name__)

    if not url.startswith('http'):
        url = f"https://{url}"

    # BUG #10: Use SCAN_TIMEOUT from config rather than the hard-coded value of 10
    try:
        timeout = current_app.config.get('SCAN_TIMEOUT', 15)
    except RuntimeError:
        timeout = 15  # Fallback when called outside an app context (e.g. tests)

    try:
        resp = requests.get(url, timeout=timeout, allow_redirects=True, verify=False)
        raw_headers = dict(resp.headers)

        # 1. Security headers check
        for header, meta in SECURITY_HEADERS.items():
            if header not in resp.headers:
                findings.append({
                    'category': 'headers',
                    'severity': meta['severity'],
                    'title': meta['title'],
                    'description': f"The '{header}' header is not set.",
                    'evidence': f"Response headers keys: {list(resp.headers.keys())}",
                    'what_it_means': meta['what_it_means'],
                    'remediation': meta['remediation']
                })

        # 2. Cookie security flags
        for cookie in resp.cookies:
            issues = []
            if not cookie.secure:
                issues.append('Secure flag missing')
            if not cookie.has_nonstandard_attr('HttpOnly'):
                issues.append('HttpOnly flag missing')
            if not cookie.has_nonstandard_attr('SameSite'):
                issues.append('SameSite attribute missing')
            if issues:
                findings.append({
                    'category': 'headers',
                    'severity': 'medium',
                    'title': f"Insecure Cookie: {cookie.name}",
                    'description': f"Cookie '{cookie.name}' is missing: {', '.join(issues)}.",
                    'evidence': f"Cookie Name: {cookie.name}",
                    'what_it_means': 'Missing cookie flags expose session tokens to XSS theft or HTTP transmission.',
                    'remediation': f"Set cookie with: Set-Cookie: {cookie.name}=value; Secure; HttpOnly; SameSite=Strict"
                })

        # 3. CORS misconfiguration
        cors_origin = resp.headers.get('Access-Control-Allow-Origin', '')
        cors_creds = resp.headers.get('Access-Control-Allow-Credentials', '')
        if cors_origin == '*' and cors_creds.lower() == 'true':
            findings.append({
                'category': 'headers',
                'severity': 'critical',
                'title': 'Dangerous CORS Misconfiguration',
                'description': "Access-Control-Allow-Origin: * combined with Allow-Credentials: true is invalid per spec but some servers misconfigure it.",
                'evidence': f"ACAO: {cors_origin}, ACAC: {cors_creds}",
                'what_it_means': 'This could allow any website to make authenticated requests on behalf of your users.',
                'remediation': 'Never use * with credentials=true. Specify an explicit trusted origin.'
            })
        elif cors_origin == '*':
            findings.append({
                'category': 'headers',
                'severity': 'low',
                'title': 'Permissive CORS Policy',
                'description': "Access-Control-Allow-Origin is set to *, allowing any origin to read responses.",
                'evidence': f"ACAO: {cors_origin}",
                'what_it_means': 'Any website can make cross-origin requests and read the response. Acceptable for public APIs, risky for authenticated endpoints.',
                'remediation': 'Restrict to specific trusted origins if this endpoint serves authenticated data.'
            })

    except requests.exceptions.ConnectionError as e:
        findings.append({
            'category': 'headers', 'severity': 'critical',
            'title': 'Connection Failed',
            'description': str(e),
            'evidence': '', 'what_it_means': 'The server could not be reached.', 'remediation': 'Verify the target URL is accessible.'
        })
    except Exception as e:
        # BUG #11: log the exception instead of silently swallowing it
        logger.warning("Header check failed for %s: %s", url, e)

    return {'findings': findings, 'raw_headers': raw_headers}
