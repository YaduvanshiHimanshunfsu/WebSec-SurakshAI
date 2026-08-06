import logging
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs, urljoin

logger = logging.getLogger(__name__)


def discover_params(url: str) -> list[dict]:
    """
    Discover injectable parameters:
    1. URL query params
    2. HTML form fields
    Returns list of {'type': 'url_param'|'form', 'param': name, 'url'|'form_action': url, 'method': 'GET'|'POST'}
    """
    # BUG #10: read SCAN_TIMEOUT from Flask config rather than hard-coding 10s.
    # Falls back to 15s when called outside an app context (e.g. tests).
    try:
        from flask import current_app
        timeout = current_app.config.get('SCAN_TIMEOUT', 15)
    except RuntimeError:
        timeout = 15

    params = []
    parsed = urlparse(url)

    # 1. URL query params
    for param in parse_qs(parsed.query).keys():
        params.append({'type': 'url_param', 'param': param, 'url': url})

    # 2. Form fields
    try:
        resp = requests.get(url, timeout=timeout)
        soup = BeautifulSoup(resp.text, 'html.parser')
        for form in soup.find_all('form'):
            action = urljoin(url, form.get('action', url))
            method = form.get('method', 'GET').upper()
            for inp in form.find_all(['input', 'textarea']):
                name = inp.get('name')
                if name and inp.get('type') not in ('submit', 'button', 'hidden', 'csrf'):
                    params.append({
                        'type': 'form',
                        'param': name,
                        'form_action': action,
                        'method': method
                    })
    except Exception as e:
        # BUG #11: log the failure so form-discovery errors are visible in server logs
        # rather than silently returning only URL params
        logger.warning("Form discovery failed for %s: %s", url, e)

    return params
