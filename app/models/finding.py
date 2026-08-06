"""
Finding — A single security issue discovered during a scan.
"""
from ..extensions import db


class Finding(db.Model):
    __tablename__ = 'findings'

    id = db.Column(db.Integer, primary_key=True)
    scan_id = db.Column(db.Integer, db.ForeignKey('scans.id'), nullable=False)
    # 'tls' | 'headers' | 'phishing' | 'whois' | 'sqli' | 'xss' | 'cmdi'
    category = db.Column(db.String(50), nullable=False)
    # 'critical' | 'high' | 'medium' | 'low' | 'info'
    severity = db.Column(db.String(20), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    evidence = db.Column(db.Text, nullable=True)
    what_it_means = db.Column(db.Text, nullable=True)
    remediation = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f'<Finding {self.severity.upper()}: {self.title}>'
