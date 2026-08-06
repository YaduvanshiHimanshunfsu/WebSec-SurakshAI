import json
import time
from datetime import datetime, timezone
from flask import render_template, request, Response, stream_with_context, redirect, url_for, flash, session
from . import active_bp
from ..extensions import db
from ..models.target import Target
from ..models.scan import Scan
from ..models.finding import Finding
from .authorization import is_authorized
from .scanner_engine import run_template, load_templates
from ..reports.risk_scoring import calculate_risk_score

@active_bp.route('/start/<int:target_id>', methods=['POST'])
def start_scan(target_id):
    # BUG #9: db.get_or_404 replaces the deprecated Target.query.get_or_404()
    target = db.get_or_404(Target, target_id)

    # 1. THE GATE
    authorized, reason = is_authorized(target)
    if not authorized:
        flash(f"Active scan blocked: {reason}", 'error')
        return redirect(url_for('main.dashboard'))

    # 2. Create Scan
    scan = Scan(target_id=target.id, scan_type='active')
    db.session.add(scan)
    db.session.commit()

    return render_template('active_scan_progress.html', scan=scan, target=target)

@active_bp.route('/stream/<int:scan_id>')
def stream_scan(scan_id):
    # BUG #9: db.get_or_404 replaces the deprecated Scan.query.get_or_404()
    scan = db.get_or_404(Scan, scan_id)
    # BUG #9: db.session.get() replaces the deprecated Target.query.get()
    target = db.session.get(Target, scan.target_id)

    # Re-verify at stream time just to be safe
    authorized, reason = is_authorized(target)
    if not authorized:
        return Response("Unauthorized", status=403)

    full_url = f"http://{target.domain}" if target.verification_method == 'sandbox' else f"https://{target.domain}"

    def generate():
        # BUG #2: SSE streams cannot be intercepted by before_request.
        # Check the session inside the generator and emit an error event
        # if the user is not authenticated, rather than leaking scan data.
        if not session.get('authenticated'):
            yield f"data: {json.dumps({'error': 'Unauthorized', 'code': 401})}\n\n"
            return

        all_findings = []
        categories = ['sqli', 'xss', 'cmdi']

        for category in categories:
            yield f"data: {json.dumps({'message': f'Loading {category.upper()} templates...', 'done': False})}\n\n"
            templates = load_templates(category)

            for t in templates:
                template_id = t.get('id', 'unknown')
                run_msg = json.dumps({'message': 'Running ' + template_id + ' on ' + target.domain + '...', 'done': False})
                yield 'data: ' + run_msg + '\n\n'

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
                time.sleep(0.5)

            finish_msg = json.dumps({'message': 'Finished ' + category.upper() + ' scans.', 'done': True})
            yield 'data: ' + finish_msg + '\n\n'

        # Finalize
        score_data = calculate_risk_score(all_findings)
        scan.risk_score = score_data['score']
        scan.status = 'complete'
        # BUG #8: datetime.utcnow() deprecated in Python 3.12+ — use timezone-aware now()
        scan.finished_at = datetime.now(timezone.utc)
        db.session.commit()

        redirect_url = url_for('reports.view_report', scan_id=scan.id)
        done_msg = json.dumps({'complete': True, 'message': 'Scan complete!', 'redirect_url': redirect_url})
        yield 'data: ' + done_msg + '\n\n'

    return Response(stream_with_context(generate()),
                    mimetype='text/event-stream',
                    headers={'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'})

