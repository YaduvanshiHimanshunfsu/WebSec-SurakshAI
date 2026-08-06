"""
Target — A domain registered for scanning.
verified=True only after the authorization gate confirms domain ownership.
"""
import secrets
from datetime import datetime, timezone
from ..extensions import db


class Target(db.Model):
    __tablename__ = 'targets'

    id = db.Column(db.Integer, primary_key=True)
    # BUG #7/#13: unique=True enforces DB-level uniqueness preventing duplicate
    # Target rows under concurrent Gunicorn workers; index=True makes
    # filter_by(domain=...) an O(1) index lookup instead of O(N) full scan.
    domain = db.Column(db.String(255), nullable=False, unique=True, index=True)
    verified = db.Column(db.Boolean, default=False, nullable=False)
    verification_token = db.Column(db.String(64), nullable=True)
    # 'dns_txt' | 'sandbox'
    verification_method = db.Column(db.String(20), nullable=True)
    # BUG #8: use timezone-aware datetime (datetime.utcnow is deprecated Python 3.12+)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    scans = db.relationship('Scan', backref='target', lazy=True, cascade='all, delete-orphan')

    def generate_token(self):
        """Generate a new random verification token."""
        self.verification_token = secrets.token_urlsafe(32)
        return self.verification_token

    def __repr__(self):
        return f'<Target {self.domain} verified={self.verified}>'
