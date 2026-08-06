"""
WebSec-SurakshAI — Reports Routes
Provides JSON API endpoints (for React) and legacy HTML rendering.
Also adds /export/<id>/json and /export/<id>/pdf URL format for React frontend compatibility.
"""
import json
from flask import render_template, abort, Response, jsonify
from . import reports_bp
from ..extensions import db
from ..models.scan import Scan
from ..models.target import Target
from ..models.finding import Finding
from .risk_scoring import calculate_risk_score
from .pdf_generator import generate_pdf


def _build_report_dict(scan, target, findings):
    """Build a serializable report dict from DB objects."""
    f_dicts = [{'severity': f.severity} for f in findings]
    score_data = calculate_risk_score(f_dicts)

    return {
        'scan_id': scan.id,
        'target': target.domain,
        'scan_type': scan.scan_type,
        'status': scan.status,
        'started_at': scan.started_at.isoformat() if scan.started_at else None,
        'finished_at': scan.finished_at.isoformat() if scan.finished_at else None,
        'risk_score': score_data['score'],
        'risk_grade': score_data['grade'],
        'score_data': score_data,
        'findings': [
            {
                'id': f.id,
                'category': f.category,
                'severity': f.severity,
                'title': f.title,
                'description': f.description,
                'evidence': f.evidence,
                'what_it_means': f.what_it_means,
                'remediation': f.remediation,
            }
            for f in findings
        ]
    }


# ─── JSON API for React frontend ─────────────────────────────────

@reports_bp.route('/api/<int:scan_id>', methods=['GET'])
def api_get_report(scan_id):
    """JSON: Full report with findings for React dashboard."""
    scan = db.get_or_404(Scan, scan_id)
    target = db.session.get(Target, scan.target_id)
    findings = Finding.query.filter_by(scan_id=scan.id).all()
    return jsonify(_build_report_dict(scan, target, findings))


@reports_bp.route('/api/diff/<int:scan_id_1>/<int:scan_id_2>', methods=['GET'])
def api_scan_diff(scan_id_1, scan_id_2):
    """JSON: Compare two scans on the same target. Returns added, fixed, and unchanged findings."""
    scan1 = db.get_or_404(Scan, scan_id_1)
    scan2 = db.get_or_404(Scan, scan_id_2)

    target1 = db.session.get(Target, scan1.target_id)
    target2 = db.session.get(Target, scan2.target_id)

    if target1.domain != target2.domain:
        return jsonify({'error': 'Scans are for different targets and cannot be diffed.'}), 400

    findings1 = {f.title: f for f in Finding.query.filter_by(scan_id=scan1.id).all()}
    findings2 = {f.title: f for f in Finding.query.filter_by(scan_id=scan2.id).all()}

    def fmt(f):
        return {'title': f.title, 'severity': f.severity, 'category': f.category}

    new_findings = [fmt(f) for t, f in findings2.items() if t not in findings1]
    fixed_findings = [fmt(f) for t, f in findings1.items() if t not in findings2]
    unchanged = [fmt(f) for t, f in findings1.items() if t in findings2]

    return jsonify({
        'target': target1.domain,
        'scan_1': {'id': scan1.id, 'date': scan1.started_at.isoformat() if scan1.started_at else None, 'risk_score': scan1.risk_score},
        'scan_2': {'id': scan2.id, 'date': scan2.started_at.isoformat() if scan2.started_at else None, 'risk_score': scan2.risk_score},
        'new_findings': new_findings,
        'fixed_findings': fixed_findings,
        'unchanged_findings': unchanged,
        'summary': {
            'new_count': len(new_findings),
            'fixed_count': len(fixed_findings),
            'unchanged_count': len(unchanged),
            'improvement': scan1.risk_score - scan2.risk_score if scan1.risk_score and scan2.risk_score else 0
        }
    })


# ─── Export routes (new URL format for React) ─────────────────────

@reports_bp.route('/export/<int:scan_id>/json')
def export_json_new(scan_id):
    scan = db.get_or_404(Scan, scan_id)
    target = db.session.get(Target, scan.target_id)
    findings = Finding.query.filter_by(scan_id=scan.id).all()
    report = _build_report_dict(scan, target, findings)
    return Response(
        json.dumps(report, default=str, indent=2),
        mimetype='application/json',
        headers={'Content-Disposition': f'attachment; filename=WebSec-SurakshAI_Report_{scan.id}.json'}
    )


@reports_bp.route('/export/<int:scan_id>/pdf')
def export_pdf_new(scan_id):
    scan = db.get_or_404(Scan, scan_id)
    target = db.session.get(Target, scan.target_id)
    findings = Finding.query.filter_by(scan_id=scan.id).all()
    f_dicts = [{'severity': f.severity} for f in findings]
    score_data = calculate_risk_score(f_dicts)
    pdf_bytes = generate_pdf(scan, target, findings, score_data)
    if not pdf_bytes:
        return "Failed to generate PDF", 500
    return Response(
        pdf_bytes,
        mimetype='application/pdf',
        headers={'Content-Disposition': f'attachment; filename=WebSec_Report_{scan.id}.pdf'}
    )


# ─── Legacy routes ────────────────────────────────────────────────

@reports_bp.route('/<int:scan_id>', endpoint='view_report')
@reports_bp.route('/<int:scan_id>', endpoint='scan_report')
def view_report(scan_id):
    scan = db.get_or_404(Scan, scan_id)
    target = db.session.get(Target, scan.target_id)
    findings = Finding.query.filter_by(scan_id=scan.id).all()

    f_dicts = [{'severity': f.severity} for f in findings]
    score_data = calculate_risk_score(f_dicts)

    return render_template('scan_result.html', scan=scan, target=target, findings=findings, score_data=score_data)


@reports_bp.route('/<int:scan_id>/json')
def export_json(scan_id):
    scan = db.get_or_404(Scan, scan_id)
    target = db.session.get(Target, scan.target_id)
    findings = Finding.query.filter_by(scan_id=scan.id).all()
    return jsonify(_build_report_dict(scan, target, findings))


@reports_bp.route('/<int:scan_id>/pdf')
def export_pdf(scan_id):
    scan = db.get_or_404(Scan, scan_id)
    target = db.session.get(Target, scan.target_id)
    findings = Finding.query.filter_by(scan_id=scan.id).all()
    f_dicts = [{'severity': f.severity} for f in findings]
    score_data = calculate_risk_score(f_dicts)
    pdf_bytes = generate_pdf(scan, target, findings, score_data)
    if not pdf_bytes:
        return "Failed to generate PDF", 500
    return Response(
        pdf_bytes,
        mimetype='application/pdf',
        headers={'Content-Disposition': f'attachment; filename=WebSec_Report_{scan.id}.pdf'}
    )
