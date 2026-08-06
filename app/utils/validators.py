import socket
import ipaddress
from urllib.parse import urlparse
from flask import current_app

# Private IP ranges to block (SSRF prevention)
PRIVATE_RANGES = [
    ipaddress.ip_network('10.0.0.0/8'),
    ipaddress.ip_network('172.16.0.0/12'),
    ipaddress.ip_network('192.168.0.0/16'),
    ipaddress.ip_network('127.0.0.0/8'),
    ipaddress.ip_network('169.254.0.0/16'),         # AWS metadata service
    ipaddress.ip_network('::1/128', strict=False),  # IPv6 loopback
    ipaddress.ip_network('fc00::/7'),                # IPv6 private
]

SANDBOX_HOSTS = {'localhost', '127.0.0.1', '0.0.0.0'}

def validate_url(url: str, allow_sandbox: bool = False) -> tuple[bool, str]:
    """
    Returns (is_valid, error_message).
    Resolves hostname to IP and blocks private ranges (SSRF protection).
    """
    try:
        # Prepend scheme if missing for parsing
        if not url.startswith('http'):
            parse_url = f"https://{url}"
        else:
            parse_url = url
            
        parsed = urlparse(parse_url)
        if parsed.scheme not in ('http', 'https'):
            return False, "Only HTTP and HTTPS URLs are allowed."
        hostname = parsed.hostname
        if not hostname:
            return False, "Invalid URL — no hostname found."

        # Check if SSRF blocking is enabled in config
        try:
            ssrf_enabled = current_app.config.get('SSRF_BLOCK_ENABLED', True)
        except RuntimeError:
            # Outside app context (e.g. some tests)
            ssrf_enabled = True

        if not ssrf_enabled:
            return True, ""

        # Sandbox exception
        if allow_sandbox and hostname in SANDBOX_HOSTS:
            return True, ""

        # Resolve and check
        resolved_ip = socket.gethostbyname(hostname)
        ip_obj = ipaddress.ip_address(resolved_ip)

        for private_range in PRIVATE_RANGES:
            if ip_obj in private_range:
                return False, f"Scanning internal/private IP ranges is not allowed ({resolved_ip})."

        return True, ""
    except socket.gaierror:
        return False, "Hostname could not be resolved."
    except ValueError as e:
        return False, str(e)
