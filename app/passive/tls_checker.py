import ssl
import socket
from datetime import datetime, timezone

def check_tls(domain: str) -> dict:
    """
    Returns dict with keys: valid, protocol, expiry_days, issuer, error
    Uses only Python built-in ssl.
    """
    result = {
        'valid': False,
        'protocol': None,
        'expiry_days': None,
        'issuer': None,
        'subject': None,
        'error': None,
        'findings': []
    }
    
    # Extract hostname if URL is passed
    if '://' in domain:
        domain = domain.split('://')[1].split('/')[0]

    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=domain) as s:
            s.settimeout(10)
            s.connect((domain, 443))
            cert = s.getpeercert()
            cipher = s.cipher()

            result['valid'] = True
            result['protocol'] = cipher[1]  # e.g., 'TLSv1.3'

            # Expiry
            expiry_str = cert['notAfter']  # 'Aug  5 12:00:00 2027 GMT'
            expiry = datetime.strptime(expiry_str, '%b %d %H:%M:%S %Y %Z')
            # BUG #8: datetime.utcnow() deprecated in Python 3.12+
            result['expiry_days'] = (expiry - datetime.now(timezone.utc).replace(tzinfo=None)).days

            # Issuer
            issuer_dict = {}
            for item in cert.get('issuer', []):
                for k, v in item:
                    issuer_dict[k] = v
            result['issuer'] = issuer_dict.get('organizationName', 'Unknown')

            # Generate findings
            if result['expiry_days'] < 14:
                result['findings'].append({
                    'category': 'tls', 'severity': 'critical',
                    'title': 'Certificate Expiring Within 14 Days',
                    'description': f"Certificate expires in {result['expiry_days']} days.",
                    'what_it_means': 'Browsers will show security warnings to all visitors once expired.',
                    'remediation': 'Renew your SSL certificate immediately. Use Let\'s Encrypt for free auto-renewal.'
                })
            elif result['expiry_days'] < 30:
                result['findings'].append({
                    'category': 'tls', 'severity': 'high',
                    'title': 'Certificate Expiring Within 30 Days',
                    'description': f"Certificate expires in {result['expiry_days']} days.",
                    'what_it_means': 'Certificate renewal should be scheduled now.',
                    'remediation': 'Renew your SSL certificate. Consider enabling auto-renewal.'
                })

            if 'TLSv1.0' in result['protocol'] or 'TLSv1.1' in result['protocol']:
                result['findings'].append({
                    'category': 'tls', 'severity': 'high',
                    'title': 'Outdated TLS Protocol in Use',
                    'description': f"Server supports {result['protocol']}, which is deprecated.",
                    'what_it_means': 'TLS 1.0 and 1.1 have known vulnerabilities (POODLE, BEAST). Major browsers no longer support them.',
                    'remediation': 'Configure your server to only accept TLS 1.2 and TLS 1.3.'
                })

    except ssl.SSLCertVerificationError as e:
        result['error'] = str(e)
        result['findings'].append({
            'category': 'tls', 'severity': 'critical',
            'title': 'Invalid SSL Certificate',
            'description': str(e),
            'what_it_means': 'Browsers will block access and show a security error page to all users.',
            'remediation': 'Install a valid certificate from a trusted CA. Let\'s Encrypt provides free certificates.'
        })
    except (socket.timeout, ConnectionRefusedError):
        result['error'] = 'Could not connect to port 443 — HTTPS may not be configured.'
        result['findings'].append({
            'category': 'tls', 'severity': 'critical',
            'title': 'HTTPS Not Available',
            'description': 'Port 443 is closed or unreachable.',
            'what_it_means': 'All traffic is unencrypted and vulnerable to interception.',
            'remediation': 'Configure HTTPS on your server. Use Certbot + Let\'s Encrypt for a free certificate.'
        })
    except Exception as e:
        result['error'] = str(e)
        result['findings'].append({
            'category': 'tls', 'severity': 'high',
            'title': 'TLS Check Failed',
            'description': str(e),
            'what_it_means': 'Could not complete TLS handshake.',  # BUG #12: fixed typo
            'remediation': 'Verify the server is online and accepting HTTPS connections.'
        })

    return result
