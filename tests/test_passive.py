import pytest
from app.passive.headers_checker import check_headers
from app.passive.whois_lookup import check_whois
from app.passive.tls_checker import check_tls

def test_check_headers():
    # Use a known public site for testing passive checks
    result = check_headers('https://example.com')
    assert 'findings' in result
    assert 'raw_headers' in result
    assert isinstance(result['findings'], list)

def test_check_whois():
    result = check_whois('https://example.com')
    assert 'findings' in result
    assert isinstance(result['findings'], list)

def test_check_tls():
    result = check_tls('example.com')
    assert result['valid'] is True
    assert result['protocol'] is not None
    assert isinstance(result['findings'], list)

def test_check_tls_invalid_domain():
    result = check_tls('this-domain-does-not-exist.com')
    assert result['valid'] is False
    assert result['error'] is not None
