import yaml
import re
import os
import glob
import logging
import requests
from urllib.parse import urlparse, parse_qs, urlencode
from .param_discoverer import discover_params

logger = logging.getLogger(__name__)


def load_templates(category: str) -> list[dict]:
    """Load all YAML templates for a given category (sqli, xss, cmdi)."""
    template_dir = os.path.join(os.path.dirname(__file__), '..', 'payload_templates', category)
    templates = []
    for path in glob.glob(os.path.join(template_dir, '*.yaml')):
        try:
            with open(path) as f:
                templates.append(yaml.safe_load(f))
        except Exception as e:
            # BUG #11: log template load failures so broken YAML is discoverable in logs
            logger.warning("Failed to load template %s: %s", path, e)
    return templates


def run_template(base_url: str, template: dict, session: requests.Session = None) -> list[dict]:
    """
    Run a single YAML template against all discovered params.
    Returns list of findings.
    """
    # BUG #10: read SCAN_TIMEOUT from Flask config rather than using a hard-coded value.
    # Falls back to 15s when called outside an app context (e.g. tests).
    try:
        from flask import current_app
        timeout = current_app.config.get('SCAN_TIMEOUT', 15)
    except RuntimeError:
        timeout = 15

    s = session or requests.Session()
    findings = []
    params = discover_params(base_url)

    for param_info in params:
        for payload in template.get('payloads', []):
            try:
                resp = None
                if param_info['type'] == 'url_param':
                    parsed = urlparse(param_info['url'])
                    qs = parse_qs(parsed.query)
                    qs[param_info['param']] = [payload]
                    test_url = parsed._replace(query=urlencode(qs, doseq=True)).geturl()
                    resp = s.get(test_url, timeout=timeout)
                elif param_info['type'] == 'form':
                    data = {param_info['param']: payload}
                    if param_info['method'] == 'POST':
                        resp = s.post(param_info['form_action'], data=data, timeout=timeout)
                    else:
                        resp = s.get(param_info['form_action'], params=data, timeout=timeout)
                else:
                    continue

                if resp and _check_match(template.get('match', {}), payload, resp):
                    findings.append({
                        'category': template['category'],
                        'severity': template['severity'],
                        'title': f"{template['category'].upper()} Detected ({template.get('technique', 'unknown')})",
                        'description': f"Parameter '{param_info['param']}' is vulnerable.",
                        'evidence': f"Payload: {payload[:100]}\n\nResponse snippet: {resp.text[:300]}",
                        'what_it_means': _get_explanation(template['category']),
                        'remediation': template.get('remediation', ''),
                    })
                    break  # One confirmed finding per param is enough
            except requests.exceptions.Timeout:
                if template.get('technique') == 'time_based':
                    findings.append({
                        'category': template['category'],
                        'severity': template['severity'],
                        'title': f"Possible Time-Based SQLi on '{param_info['param']}'",
                        'description': 'Response delayed significantly — may indicate time-based blind SQLi.',
                        'evidence': f"Payload: {payload}",
                        'what_it_means': _get_explanation('sqli'),
                        'remediation': template.get('remediation', ''),
                    })
            except Exception as e:
                # BUG #11: log scan step failures instead of silently skipping them
                logger.warning(
                    "Scan step failed for param '%s' with payload '%s': %s",
                    param_info.get('param'), payload[:50], e
                )
                continue

    return findings


def _check_match(match_config: dict, payload: str, resp: requests.Response) -> bool:
    match_type = match_config.get('type')
    if match_type == 'regex':
        flags_str = match_config.get('flags', '')
        flags = re.IGNORECASE if 'IGNORECASE' in flags_str else 0
        for pattern in match_config.get('patterns', []):
            if re.search(pattern, resp.text, flags):
                return True
    elif match_type == 'string_in_response':
        check = match_config.get('check')
        if check == 'payload_in_response_unescaped':
            return payload in resp.text
    return False


def _get_explanation(category: str) -> str:
    explanations = {
        'sqli': 'SQL Injection allows attackers to read, modify, or delete your entire database.',
        'xss': "Cross-Site Scripting allows attackers to run malicious scripts in victims' browsers, steal cookies, or redirect users.",
        'cmdi': 'Command Injection allows attackers to run arbitrary OS commands on your server.',
    }
    return explanations.get(category, '')
