"""
User — User account model with RBAC (admin, auditor, viewer) and TOTP 2FA support.
"""
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100), nullable=True)

    # Role-Based Access Control (RBAC): 'admin' | 'auditor' | 'viewer'
    role = db.Column(db.String(20), default='auditor', nullable=False)

    # 2FA / TOTP (PyOTP)
    totp_secret = db.Column(db.String(64), nullable=True)
    totp_enabled = db.Column(db.Boolean, default=False, nullable=False)

    # Multi-tenancy binding
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True)

    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    scans = db.relationship('Scan', backref='user', lazy=True)

    def set_password(self, password: str):
        """Hash and store password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Verify password against hash."""
        return check_password_hash(self.password_hash, password)

    def is_admin(self) -> bool:
        return self.role == 'admin'

    def can_audit(self) -> bool:
        return self.role in ('admin', 'auditor')

    def __repr__(self):
        return f'<User {self.email} role={self.role}>'
