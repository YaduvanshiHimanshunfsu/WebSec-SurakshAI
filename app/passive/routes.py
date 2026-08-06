"""
WebSec-SurakshAI — Passive Scanner Routes
Provides both JSON API endpoints (for React frontend) and SSE stream.
"""
import json
import logging
import time
from datetime import datetime, timezone
from urllib.parse import urlparse
from sqlalchemy.exc import IntegrityError
from flask import render_template, request, Response, stream_with_context, redirect, url_for, flash, jsonify, session
from . import passive_bp
from ..extensions import db
from ..models.target import Target
from ..models.scan import Scan
from ..models.finding import Finding
from ..utils.validators import validate_url
from .tls_checker import check_tls
from .headers_checker import check_headers
from .phishing_checker import check_phishing
from .whois_lookup import check_whois
from ..reports.risk_scoring import calculate_risk_score

logger = logging.getLogger(__name__)


def _get_or_create_target(url: str):
    """Parse URL and get or create a Target record. Returns (target, full_url, error).

    BUG #7: Wraps the INSERT in a try/except IntegrityError so that two
    concurrent requests for the same domain don't both succeed in creating a
    new Target row (race condition under Gunicorn multi-worker).
    """
    is_valid, error_msg = validate_url(url, allow_sandbox=True)
    if not is_valid:
        return None, None, error_msg

    parsed = urlparse(url)
    domain = parsed.hostname

    target = Target.query.filter_by(domain=domain).first()
    if not target:
        try:
            target = Target(domain=domain)
            db.session.add(target)
            db.session.commit()
        except IntegrityError:
            # Another worker inserted this domain between our SELECT and INSERT.
            db.session.rollback()
            target = Target.query.filter_by(domain=domain).first()

    full_url = f"https://{domain}"
    if 'localhost' in domain or '127.0.0.1' in domain:
        full_url = f"http://{domain}"

    return target, full_url, None


# ─── JSON API endpoint (React frontend) ──────────────────────────
@passive_bp.route('/api/start', methods=['POST'])
def api_start_scan():
    """JSON API: Start a passive scan. Returns scan_id for SSE subscription."""
    data = request.get_json(silent=True) or {}
    url = (data.get('url') or '').strip()

    if not url:
        return jsonify({'error': 'url field is required.'}), 400

    target, full_url, error = _get_or_create_target(url)
    if error:
        return jsonify({'error': f'Invalid URL: {error}'}), 400

    scan = Scan(target_id=target.id, scan_type='passive')
    db.session.add(scan)
    db.session.commit()

    return jsonify({
        'scan_id': scan.id,
        'target': target.domain,
        'status': 'started',
        'stream_url': url_for('passive.stream_scan', scan_id=scan.id)
    })


@passive_bp.route('/api/async-start', methods=['POST'])
def api_async_start_scan():
    """JSON API: Dispatch non-blocking Celery background task for passive scanning."""
    data = request.get_json(silent=True) or {}
    url = (data.get('url') or '').strip()

    if not url:
        return jsonify({'error': 'url field is required.'}), 400

    target, full_url, error = _get_or_create_target(url)
    if error:
        return jsonify({'error': f'Invalid URL: {error}'}), 400

    scan = Scan(target_id=target.id, scan_type='passive', status='queued')
    db.session.add(scan)
    db.session.commit()

    task_id = None
    try:
        from ..tasks import run_passive_scan_task
        task = run_passive_scan_task.delay(scan.id)
        task_id = task.id
    except Exception as e:
        logger.warning("Celery dispatch unavailable; scan recorded in DB: %s", e)

    return jsonify({
        'status': 'queued',
        'scan_id': scan.id,
        'task_id': task_id,
        'target': target.domain,
        'message': 'Passive scan queued asynchronously.'
    })


# ─── Legacy form POST (kept for backward compat) ─────────────────
@passive_bp.route('/start', methods=['POST'])
def start_scan():
    url = request.form.get('url', '').strip()
    if not url:
        flash('URL is required.', 'error')
        return redirect(url_for('main.index'))

    target, full_url, error = _get_or_create_target(url)
    if error:
        flash(f'Invalid URL: {error}', 'error')
        return redirect(url_for('main.index'))

    scan = Scan(target_id=target.id, scan_type='passive')
    db.session.add(scan)
    db.session.commit()

    return render_template('scan_progress.html', scan=scan, url=url)


# ─── SSE Stream (used by both React and legacy Jinja2) ───────────
@passive_bp.route('/stream/<int:scan_id>')
def stream_scan(scan_id):
    # BUG #9: db.get_or_404 is the SQLAlchemy 2.0 / Flask-SQLAlchemy 3.x way.
    scan = db.get_or_404(Scan, scan_id)
    # BUG #9: db.session.get() replaces the deprecated Target.query.get()
    target = db.session.get(Target, scan.target_id)

    full_url = f"https://{target.domain}"
    if 'localhost' in target.domain or '127.0.0.1' in target.domain:
        full_url = f"http://{target.domain}"

    def generate():
        # BUG #2: SSE streams cannot be redirected by the browser, so we can't
        # rely on the before_request auth gate. Check the session here instead
        # and emit an error event immediately if the user is not authenticated.
        if not session.get('authenticated'):
            yield f"data: {json.dumps({'error': 'Unauthorized', 'code': 401})}\n\n"
            return

        all_findings = []

        steps = [
            ('Checking TLS certificate...', check_tls, target.domain),
            ('Auditing security headers...', check_headers, full_url),
            ('Checking phishing databases...', check_phishing, full_url),
            ('Looking up domain age...', check_whois, full_url),
        ]

        for msg, fn, arg in steps:
            yield f"data: {json.dumps({'message': msg, 'done': False})}\n\n"

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

            time.sleep(0.3)
            yield f"data: {json.dumps({'message': msg.replace('...', ''), 'done': True})}\n\n"

        # Finalize scan
        score_data = calculate_risk_score(all_findings)
        scan.risk_score = score_data['score']
        scan.status = 'complete'
        # BUG #8: datetime.utcnow() deprecated in Python 3.12+ — use timezone-aware now()
        scan.finished_at = datetime.now(timezone.utc)
        db.session.commit()

        yield f"data: {json.dumps({'complete': True, 'message': 'Scan complete!', 'scan_id': scan.id, 'redirect_url': f'/report/{scan.id}'})}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'}
    )
