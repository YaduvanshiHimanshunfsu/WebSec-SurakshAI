import pytest

pyotp = pytest.importorskip("pyotp")
qrcode = pytest.importorskip("qrcode")

from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.organization import Organization
from config import _get_db_url


def test_supabase_db_url_normalization(monkeypatch):
    """Test that postgres:// URLs are converted to postgresql:// for SQLAlchemy 2.0."""
    monkeypatch.setenv("SUPABASE_DB_URL", "postgres://postgres.ref:secret@aws-0-us-east-1.pooler.supabase.com:6543/postgres")
    url = _get_db_url()
    assert url.startswith("postgresql://")
    assert "supabase.com" in url


def test_user_and_organization_models(app):
    """Test User model creation, RBAC permissions, password hashing, and Organization relationship."""
    with app.app_context():
        org = Organization(name="National Forensic Sciences University", slug="nfsu-tripura")
        db.session.add(org)
        db.session.commit()

        user = User(
            email="auditor@nfsu.ac.in",
            first_name="Himanshu",
            last_name="Yadav",
            role="admin",
            organization_id=org.id
        )
        user.set_password("SecurePass123!")
        db.session.add(user)
        db.session.commit()

        # Assert password hashing
        assert user.check_password("SecurePass123!") is True
        assert user.check_password("WrongPassword") is False

        # Assert RBAC roles
        assert user.is_admin() is True
        assert user.can_audit() is True

        # Assert Organization relationship
        assert user.organization.slug == "nfsu-tripura"


def test_totp_pyotp_flow(client):
    """Test PyOTP 2FA setup and verification endpoints."""
    # Login first
    login_resp = client.post('/api/login', json={'password': 'admin123'})
    assert login_resp.status_code == 200

    # Setup MFA
    setup_resp = client.post('/api/mfa/setup')
    assert setup_resp.status_code == 200
    data = setup_resp.get_json()
    assert 'secret' in data
    assert data['qr_code'].startswith('data:image/png;base64,')

    secret = data['secret']
    totp = pyotp.TOTP(secret)
    valid_code = totp.now()

    # Enable MFA with valid code
    enable_resp = client.post('/api/mfa/enable', json={'code': valid_code})
    assert enable_resp.status_code == 200
    assert enable_resp.get_json()['status'] == 'ok'

    # Verify MFA
    verify_resp = client.post('/api/mfa/verify', json={'code': totp.now()})
    assert verify_resp.status_code == 200
    assert verify_resp.get_json()['status'] == 'ok'
