"""
Unit tests for Phase 3: DAST Active Probes (SSRF, CORS, JWT) and SurakshAI 2.0 AI Patch Generator.
"""
import pytest
from app.active.dast_probes import audit_ssrf_probes, audit_cors_policy, audit_jwt_token
from app.ai_analyzer.scam_analyzer import ScamAnalyzer


def test_dast_jwt_token_audit():
    """Test JWT audit for 'alg: none' and weak secret keys."""
    # 1. Test unsigned token (alg: none)
    none_token = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ."
    findings_none = audit_jwt_token(none_token)
    assert len(findings_none) > 0
    assert findings_none[0]['category'] == 'jwt'
    assert 'alg: none' in findings_none[0]['title']

    # 2. Test weak secret key ('secret')
    import jwt
    weak_token = jwt.encode({"user": "admin"}, "secret", algorithm="HS256")
    findings_weak = audit_jwt_token(weak_token)
    assert len(findings_weak) > 0
    assert findings_weak[0]['severity'] == 'critical'
    assert "Weak Secret Key ('secret')" in findings_weak[0]['title']


def test_surakshai_ai_patch_generator():
    """Test SurakshAI 2.0 AI Patch Generator offline and online structure."""
    analyzer = ScamAnalyzer(gemini_api_key="")
    finding = {
        "title": "SQL Injection in User Search Parameter",
        "category": "sqli",
        "description": "Parameter 'q' is concatenated directly into SQL query string."
    }

    res = analyzer.generate_code_patch(finding, target_language="python")
    assert res['language'] == 'python'
    assert 'patch' in res
    assert 'SQL Injection' in res['vulnerability']
