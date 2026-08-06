import dns.resolver
from ..models.target import Target

ALLOWED_SANDBOX_HOSTS = {'localhost', '127.0.0.1', '0.0.0.0'}
SANDBOX_PORTS = {5001}   # Only our known sandbox port

def is_authorized(target: Target) -> tuple[bool, str]:
    """
    Returns (authorized: bool, reason: str).
    This is the ONLY function that may grant active scan permission.
    """
    if target.verification_method == 'sandbox':
        host = target.domain.split(':')[0]
        port = int(target.domain.split(':')[1]) if ':' in target.domain else 80
        if host in ALLOWED_SANDBOX_HOSTS and port in SANDBOX_PORTS:
            return True, "Sandbox target — scanning authorized."
        return False, "Sandbox mode only allows scanning localhost:5001."

    if target.verification_method == 'dns_txt':
        if not target.verified:
            return False, "Domain not verified. Complete DNS TXT verification first."
        if not target.verification_token:
            return False, "No verification token found."
        return _check_dns_txt(target.domain, target.verification_token)

    return False, "Unknown verification method."

def _check_dns_txt(domain: str, expected_token: str) -> tuple[bool, str]:
    """Query DNS TXT records and check for our verification token."""
    try:
        answers = dns.resolver.resolve(domain, 'TXT', lifetime=10)
        for rdata in answers:
            for string in rdata.strings:
                txt = string.decode('utf-8')
                if txt == f"websec-auditor-verify={expected_token}":
                    return True, "DNS TXT record verified — domain ownership confirmed."
        return False, f"DNS TXT record not found. Add: websec-auditor-verify={expected_token}"
    except dns.resolver.NXDOMAIN:
        return False, f"Domain {domain} does not exist."
    except dns.exception.Timeout:
        return False, "DNS query timed out. Try again."
    except Exception as e:
        return False, f"DNS check failed: {e}"
