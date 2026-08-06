SEVERITY_WEIGHTS = {
    'critical': 40,
    'high': 20,
    'medium': 10,
    'low': 5,
    'info': 0,
}

def calculate_risk_score(findings: list) -> dict:
    """
    Returns 0–100 score (100 = most vulnerable).
    Severity-weighted, capped at 100.
    Expects a list of dictionaries with a 'severity' key.
    """
    if not findings:
        return {'score': 0, 'grade': 'A', 'label': 'Excellent', 'by_severity': {}}

    raw = sum(SEVERITY_WEIGHTS.get(f.get('severity', 'info').lower(), 0) for f in findings)
    score = min(raw, 100)

    if score == 0:
        grade, label = 'A', 'Excellent'
    elif score <= 15:
        grade, label = 'B', 'Good'
    elif score <= 35:
        grade, label = 'C', 'Needs Improvement'
    elif score <= 60:
        grade, label = 'D', 'Poor'
    else:
        grade, label = 'F', 'Critical Risk'

    by_severity = {}
    for f in findings:
        s = f.get('severity', 'info').lower()
        by_severity[s] = by_severity.get(s, 0) + 1

    return {'score': score, 'grade': grade, 'label': label, 'by_severity': by_severity}
