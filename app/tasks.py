"""
Background Celery Tasks for Non-blocking Passive and Active Scans.
"""
import logging
from datetime import datetime, timezone
from .celery_app import celery

logger = logging.getLogger(__name__)


@celery.task(bind=True, name="tasks.run_passive_scan")
def run_passive_scan_task(self, scan_id: int):
    """Execute passive security scan asynchronously in background worker."""
    from . import create_app
    from .extensions import db
    from .models.scan import Scan
    from .models.target import Target
    from .models.finding import Finding
    from .passive.tls_checker import check_tls
    from .passive.headers_checker import check_headers
    from .passive.phishing_checker import check_phishing
    from .passive.whois_lookup import check_whois
    from .reports.risk_scoring import calculate_risk_score

    app = create_app()
    with app.app_context():
        scan = db.session.get(Scan, scan_id)
        if not scan:
            logger.error("Passive scan task failed: Scan ID %s not found.", scan_id)
            return {'status': 'failed', 'error': 'Scan record not found'}

        target = db.session.get(Target, scan.target_id)
        full_url = f"https://{target.domain}"
        if 'localhost' in target.domain or '127.0.0.1' in target.domain:
            full_url = f"http://{target.domain}"

        all_findings = []
        steps = [
            (check_tls, target.domain),
            (check_headers, full_url),
            (check_phishing, full_url),
            (check_whois, full_url),
        ]

        for i, (fn, arg) in enumerate(steps):
            self.update_state(state='PROGRESS', meta={'current': i + 1, 'total': len(steps)})
            result = fn(arg)
            new_findings = result.get('findings', [])
            all_findings.extend(new_findings)

            for f_data in new_findings:
                finding = Finding(
                    scan_id=scan.id,
                    category=f_data['category'],
                    severity=f_data['severity'],
                    title=f_data['title'],
                    description=f_data['description'],
                    evidence=f_data.get('evidence', ''),
                    what_it_means=f_data.get('what_it_means', ''),
                    remediation=f_data.get('remediation', '')
                )
                db.session.add(finding)
            db.session.commit()

        score_data = calculate_risk_score(all_findings)
        scan.risk_score = score_data['score']
        scan.status = 'complete'
        scan.finished_at = datetime.now(timezone.utc)
        db.session.commit()

        return {'status': 'complete', 'scan_id': scan_id, 'risk_score': scan.risk_score}


@celery.task(bind=True, name="tasks.run_active_scan")
def run_active_scan_task(self, scan_id: int):
    """Execute active DAST vulnerability scan asynchronously in background worker."""
    from . import create_app
    from .extensions import db
    from .models.scan import Scan
    from .models.target import Target
    from .models.finding import Finding
    from .active.scanner_engine import run_template, load_templates
    from .reports.risk_scoring import calculate_risk_score

    app = create_app()
    with app.app_context():
        scan = db.session.get(Scan, scan_id)
        if not scan:
            logger.error("Active scan task failed: Scan ID %s not found.", scan_id)
            return {'status': 'failed', 'error': 'Scan record not found'}

        target = db.session.get(Target, scan.target_id)
        full_url = f"http://{target.domain}" if target.verification_method == 'sandbox' else f"https://{target.domain}"

        all_findings = []
        categories = ['sqli', 'xss', 'cmdi']

        for i, category in enumerate(categories):
            self.update_state(state='PROGRESS', meta={'category': category, 'progress': (i / len(categories)) * 100})
            templates = load_templates(category)

            for t in templates:
                new_findings = run_template(full_url, t)
                all_findings.extend(new_findings)

                for f_data in new_findings:
                    finding = Finding(
                        scan_id=scan.id,
                        category=f_data['category'],
                        severity=f_data['severity'],
                        title=f_data['title'],
                        description=f_data['description'],
                        evidence=f_data.get('evidence', ''),
                        what_it_means=f_data.get('what_it_means', ''),
                        remediation=f_data.get('remediation', '')
                    )
                    db.session.add(finding)
                db.session.commit()

        score_data = calculate_risk_score(all_findings)
        scan.risk_score = score_data['score']
        scan.status = 'complete'
        scan.finished_at = datetime.now(timezone.utc)
        db.session.commit()

        return {'status': 'complete', 'scan_id': scan_id, 'risk_score': scan.risk_score}
