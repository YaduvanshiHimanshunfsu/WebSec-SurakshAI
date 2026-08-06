"""
Organization — Multi-tenant organization account for asset scoping and team access control.
"""
from datetime import datetime, timezone
from ..extensions import db


class Organization(db.Model):
    __tablename__ = 'organizations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), nullable=False, unique=True, index=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    users = db.relationship('User', backref='organization', lazy=True, cascade='all, delete-orphan')
    targets = db.relationship('Target', backref='organization', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Organization {self.name} slug={self.slug}>'
