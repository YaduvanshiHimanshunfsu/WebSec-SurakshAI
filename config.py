"""
WebSec-SurakshAI — Configuration
Supports Dev / Test / Prod environments via FLASK_ENV variable.
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Core
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-CHANGE-THIS-in-production')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///websec.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Admin access — MUST be set in .env before running
    # Using the default will still work locally, but a WARNING is logged.
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'REPLACE_ME_BEFORE_RUNNING')

    # External APIs
    SAFE_BROWSING_API_KEY = os.environ.get('SAFE_BROWSING_API_KEY', '')
    PHISHTANK_API_KEY = os.environ.get('PHISHTANK_API_KEY', '')

    # AI Analyzer (Gemini)
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
    GEMINI_MODEL = os.environ.get('GEMINI_MODEL', 'gemini-2.0-flash')

    # ── Session / Cookie security (BUG #5) ───────────────────────────
    # SECURE flag is False here so local HTTP dev works;
    # ProductionConfig overrides it to True.
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True        # Block JS from reading session cookie
    SESSION_COOKIE_SAMESITE = 'Lax'      # Mitigates CSRF via cross-site requests
    PERMANENT_SESSION_LIFETIME = timedelta(hours=12)   # Sessions expire; not 31-day default

    # ── Rate limiting ─────────────────────────────────────────────────
    # Storage: prefer Redis so limits survive restarts and work across
    # Gunicorn workers. Falls back to in-process memory for dev.
    RATELIMIT_DEFAULT = '20 per minute'
    RATELIMIT_STORAGE_URL = os.environ.get('REDIS_URL', 'memory://')

    # ── Scanner settings ──────────────────────────────────────────────
    SCAN_TIMEOUT = int(os.environ.get('SCAN_TIMEOUT', '15'))  # seconds per HTTP request
    MAX_PAYLOADS_PER_PARAM = 10
    SSRF_BLOCK_ENABLED = True  # Always True in prod; can disable in tests

    # ── Security response headers (applied in after_request hook) ─────
    SECURITY_HEADERS = {
        'X-Frame-Options':        'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy':        'strict-origin-when-cross-origin',
        'Permissions-Policy':     'geolocation=(), microphone=(), camera=()',
        'X-XSS-Protection':       '1; mode=block',
    }


class DevelopmentConfig(Config):
    DEBUG = True
    # SESSION_COOKIE_SECURE stays False (inherited) so http://localhost works


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False
    SSRF_BLOCK_ENABLED = False   # Allow localhost in tests
    RATELIMIT_ENABLED = False


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///websec_prod.db')

    # Enforce HTTPS-only cookie transmission in production (BUG #5)
    SESSION_COOKIE_SECURE = True

    @classmethod
    def init_app(cls, app):
        """Raise at startup if critical config is still at insecure defaults. (BUG #6)"""
        _WEAK_KEYS = {'dev-secret-CHANGE-THIS-in-production', ''}
        _WEAK_PASSWORDS = {'changeme123', 'change_this_before_deploying', 'admin', 'password', ''}

        if app.config.get('SECRET_KEY', '') in _WEAK_KEYS:
            raise RuntimeError(
                "[STARTUP ERROR] SECRET_KEY is still the insecure default. "
                "Set a strong random value in your environment: "
                "export SECRET_KEY=$(python -c \"import secrets; print(secrets.token_hex(32))\")"
            )
        if len(app.config.get('SECRET_KEY', '')) < 32:
            raise RuntimeError(
                "[STARTUP ERROR] SECRET_KEY must be at least 32 characters long."
            )
        if app.config.get('ADMIN_PASSWORD', '') in _WEAK_PASSWORDS:
            raise RuntimeError(
                "[STARTUP ERROR] ADMIN_PASSWORD is still the insecure default. "
                "Set a strong password in your environment: export ADMIN_PASSWORD=<your-password>"
            )


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig,
}
