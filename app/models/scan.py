"""
Scan — A record of a single scan event (passive or active).
"""
from datetime import datetime, timezone
from ..extensions import db


class Scan(db.Model):
    __tablename__ = 'scans'

    id = db.Column(db.Integer, primary_key=True)
    target_id = db.Column(db.Integer, db.ForeignKey('targets.id'), nullable=False)
    # 'passive' | 'active'
    scan_type = db.Column(db.String(20), nullable=False)
    # 'running' | 'complete' | 'failed'
    status = db.Column(db.String(20), default='running')
    risk_score = db.Column(db.Integer, nullable=True)  # 0-100
    # BUG #8: datetime.utcnow is deprecated in Python 3.12+; use timezone-aware now()
    started_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    finished_at = db.Column(db.DateTime(timezone=True), nullable=True)

    findings = db.relationship('Finding', backref='scan', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Scan {self.id} type={self.scan_type} status={self.status}>'
