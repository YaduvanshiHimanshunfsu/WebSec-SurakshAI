import pytest
from app.utils.validators import validate_url

def test_validate_url_valid_http():
    is_valid, msg = validate_url('http://example.com')
    assert is_valid is True

def test_validate_url_valid_https():
    is_valid, msg = validate_url('https://google.com')
    assert is_valid is True

def test_validate_url_invalid_scheme():
    is_valid, msg = validate_url('ftp://example.com')
    assert is_valid is False
    assert "Only HTTP and HTTPS URLs are allowed" in msg

def test_validate_url_ssrf_localhost(app):
    with app.app_context():
        # Ensure SSRF block is enabled for this test
        app.config['SSRF_BLOCK_ENABLED'] = True
        is_valid, msg = validate_url('http://localhost')
        assert is_valid is False
        assert "internal/private IP ranges" in msg

def test_validate_url_ssrf_private_ip(app):
    with app.app_context():
        app.config['SSRF_BLOCK_ENABLED'] = True
        is_valid, msg = validate_url('http://192.168.1.100')
        assert is_valid is False
        assert "internal/private IP ranges" in msg

def test_validate_url_sandbox_allowed(app):
    with app.app_context():
        app.config['SSRF_BLOCK_ENABLED'] = True
        is_valid, msg = validate_url('http://localhost:5001', allow_sandbox=True)
        assert is_valid is True

def test_validate_url_unresolvable():
    is_valid, msg = validate_url('http://this-domain-definitely-does-not-exist-12345.com')
    assert is_valid is False
    assert "could not be resolved" in msg
