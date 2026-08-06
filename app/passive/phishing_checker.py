import requests
import os
import json

def check_phishing(url: str) -> dict:
    findings = []
    results = {'safe_browsing': None, 'phishtank': None}

    # Google Safe Browsing API v4
    api_key = os.environ.get('SAFE_BROWSING_API_KEY', '')
    if api_key:
        try:
            payload = {
                "client": {"clientId": "websec-auditor", "clientVersion": "1.0"},
                "threatInfo": {
                    "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
                    "platformTypes": ["ANY_PLATFORM"],
                    "threatEntryTypes": ["URL"],
                    "threatEntries": [{"url": url}]
                }
            }
            resp = requests.post(
                f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}",
                json=payload, timeout=10
            )
            data = resp.json()
            if data.get('matches'):
                threat = data['matches'][0]['threatType']
                results['safe_browsing'] = threat
                findings.append({
                    'category': 'phishing', 'severity': 'critical',
                    'title': f'Flagged by Google Safe Browsing: {threat}',
                    'description': f'Google Safe Browsing identifies this URL as a threat: {threat}',
                    'evidence': json.dumps(data['matches'][0]),
                    'what_it_means': 'This URL is actively listed as dangerous. Chrome, Firefox, and Safari show warnings.',
                    'remediation': 'If you own this site, request a review at Google Search Console after removing malware.'
                })
            else:
                results['safe_browsing'] = 'clean'
        except Exception as e:
            results['safe_browsing'] = f'error: {e}'

    # PhishTank check
    phishtank_key = os.environ.get('PHISHTANK_API_KEY', '')
    if phishtank_key:
        try:
            resp = requests.post(
                'https://checkurl.phishtank.com/checkurl/',
                data={'url': url, 'format': 'json', 'app_key': phishtank_key},
                timeout=10
            )
            data = resp.json()
            if data.get('results', {}).get('in_database') and data['results'].get('valid'):
                results['phishtank'] = 'phishing'
                findings.append({
                    'category': 'phishing', 'severity': 'critical',
                    'title': 'URL Listed as Phishing on PhishTank',
                    'description': 'PhishTank community has verified this URL as a phishing site.',
                    'evidence': str(data['results']),
                    'what_it_means': 'Users visiting this URL are likely being targeted by credential theft.',
                    'remediation': 'Immediately investigate your server for compromise or report the listing if incorrect.'
                })
            else:
                results['phishtank'] = 'clean'
        except Exception as e:
            results['phishtank'] = f'error: {e}'

    return {'findings': findings, 'results': results}
