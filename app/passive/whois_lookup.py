import logging
import whois
from datetime import datetime
import urllib.parse

logger = logging.getLogger(__name__)

def check_whois(url: str) -> dict:
    findings = []
    
    # Extract hostname
    if not url.startswith('http'):
        url = f"https://{url}"
    parsed = urllib.parse.urlparse(url)
    domain = parsed.hostname
    if not domain:
        return {'findings': findings}

    try:
        w = whois.whois(domain)
        creation_date = w.creation_date
        
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
            
        if creation_date:
            age_days = (datetime.now() - creation_date).days
            
            if age_days < 30:
                findings.append({
                    'category': 'whois',
                    'severity': 'high',
                    'title': 'Domain Registered Very Recently',
                    'description': f'Domain was registered {age_days} days ago.',
                    'evidence': f"Creation Date: {creation_date}",
                    'what_it_means': 'Newly registered domains are a common indicator of phishing sites or disposable infrastructure.',
                    'remediation': 'Exercise extreme caution if this is unexpected.'
                })
            elif age_days < 180:
                findings.append({
                    'category': 'whois',
                    'severity': 'low',
                    'title': 'Relatively New Domain',
                    'description': f'Domain is only {age_days} days old.',
                    'evidence': f"Creation Date: {creation_date}",
                    'what_it_means': 'The domain is relatively new.',
                    'remediation': 'Ensure you trust this domain.'
                })

    except Exception as e:
        # BUG #11: log the exception so WHOIS timeouts/failures are visible in server logs
        # rather than silently returning zero findings
        logger.warning("WHOIS lookup failed for %s: %s", domain, e)

    return {'findings': findings}
