import pytest
from app.active.authorization import is_authorized
from app.models.target import Target

def test_unverified_target_blocked(app):
    with app.app_context():
        t = Target(domain='example.com', verified=False, verification_method='dns_txt')
        authorized, reason = is_authorized(t)
        assert authorized is False
        assert "Domain not verified" in reason

def test_sandbox_target_allowed(app):
    with app.app_context():
        t = Target(domain='localhost:5001', verified=False, verification_method='sandbox')
        authorized, reason = is_authorized(t)
        assert authorized is True

def test_non_sandbox_port_blocked(app):
    with app.app_context():
        t = Target(domain='localhost:4000', verified=False, verification_method='sandbox')
        authorized, reason = is_authorized(t)
        assert authorized is False
        assert "only allows scanning localhost:5001" in reason

def test_sandbox_wrong_host_blocked(app):
    with app.app_context():
        t = Target(domain='example.com:5001', verified=False, verification_method='sandbox')
        authorized, reason = is_authorized(t)
        assert authorized is False
