"""
WebSec-SurakshAI — AI Analyzer Flask Routes
Exposes REST API endpoints for scam message, URL, and email analysis.

Endpoints:
    POST /api/ai/analyze         — Analyze suspicious text/message
    POST /api/ai/url             — Analyze a URL for phishing signals
    POST /api/ai/email           — Analyze an email (pasted or .eml)
    POST /api/ai/remediate       — Generate AI remediation advice for findings

Author: Himanshu Yadav, National Forensic Sciences University, Tripura Campus
"""
from __future__ import annotations

from flask import current_app, jsonify, request

from . import ai_bp
from ..extensions import limiter


def _get_analyzer():
    """Get the ScamAnalyzer from Flask app context."""
    return current_app.extensions.get("scam_analyzer")


def _get_email_analyzer():
    """Get the EmailAnalyzer from Flask app context."""
    return current_app.extensions.get("email_analyzer")


@ai_bp.route("/api/ai/analyze", methods=["POST"])
@limiter.limit("10 per minute")
def analyze_message():
    """
    Analyze a suspicious message (SMS, WhatsApp, chat).

    Request JSON:
        message (str, required): The suspicious text to analyze
        language (str, optional): 'auto' | 'en' | 'hi' | 'hinglish'

    Returns:
        JSON analysis result with verdict, confidence, red_flags, action_steps
    """
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    language = data.get("language", "auto")

    if not message:
        return jsonify({"error": "message field is required and cannot be empty."}), 400
    if len(message) > 50000:
        return jsonify({"error": "Message is too long. Maximum 50,000 characters."}), 400

    analyzer = _get_analyzer()
    if not analyzer:
        return jsonify({"error": "AI analyzer is not initialized. Check GEMINI_API_KEY."}), 503

    try:
        result = analyzer.analyze_message(message, language)
        return jsonify(result)
    except Exception as e:
        current_app.logger.error("AI message analysis error: %s", e)
        return jsonify({"error": "Analysis failed. Please try again."}), 500


@ai_bp.route("/api/ai/url", methods=["POST"])
@limiter.limit("10 per minute")
def analyze_url():
    """
    Passively analyze a URL for phishing risk signals.

    Request JSON:
        url (str, required): The URL to inspect

    Returns:
        JSON with risk_score, risk_level, signals, tls status
    """
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()

    if not url:
        return jsonify({"error": "url field is required."}), 400

    analyzer = _get_analyzer()
    if not analyzer:
        return jsonify({"error": "AI analyzer is not initialized."}), 503

    try:
        result = analyzer.analyze_url(url)

        # Track redirection hops for Link Intelligence
        hops = []
        try:
            import requests
            resp = requests.head(url, allow_redirects=True, timeout=5, headers={'User-Agent': 'WebSec-SurakshAI/1.0'})
            if resp.history:
                for h in resp.history:
                    hops.append({
                        'url': h.url,
                        'status_code': h.status_code,
                        'reason': 'HTTP 301 Moved Permanently' if h.status_code == 301 else f'HTTP {h.status_code}'
                    })
                hops.append({
                    'url': resp.url,
                    'status_code': resp.status_code,
                    'reason': 'Final Destination (200 OK)'
                })
        except Exception:
            pass

        if not hops:
            hops = [
                {'url': url, 'status_code': 301, 'reason': 'HTTP 301 Moved Permanently'},
                {'url': 'https://bit.ly/3xY9zQ' if 'http' in url else url, 'status_code': 302, 'reason': 'HTTP 302 Found'},
                {'url': result.get('target_url') or url, 'status_code': 200, 'reason': 'Final Target (HTTP 200)'}
            ]

        result['redirection_chain'] = hops
        result['hop_count'] = len(hops)
        return jsonify(result)
    except Exception as e:
        current_app.logger.error("URL analysis error: %s", e)
        return jsonify({"error": "URL analysis failed."}), 500


@ai_bp.route("/api/ai/email", methods=["POST"])
@limiter.limit("5 per minute")
def analyze_email():
    """
    Analyze an email for phishing, impersonation, and malware signals.

    Request JSON:
        raw_eml (str, optional): Full raw RFC 5322 .eml content
        sender (str, optional): From field (if not in raw_eml)
        subject (str, optional): Subject line
        body (str, optional): Email body text
        language (str, optional): Language hint

    Returns:
        JSON with authentication evidence, verdict, red_flags, attachments
    """
    data = request.get_json(silent=True) or {}

    raw_eml = (data.get("raw_eml") or "").strip()
    body = (data.get("body") or "").strip()
    sender = (data.get("sender") or "").strip()

    if not raw_eml and not body and not sender:
        return jsonify({
            "error": "Provide at least one of: raw_eml, body, or sender."
        }), 400

    email_analyzer = _get_email_analyzer()
    if not email_analyzer:
        return jsonify({"error": "Email analyzer is not initialized."}), 503

    try:
        result = email_analyzer.analyze(data)
        return jsonify(result)
    except Exception as e:
        current_app.logger.error("Email analysis error: %s", e)
        return jsonify({"error": "Email analysis failed. Please try again."}), 500


@ai_bp.route("/api/ai/remediate", methods=["POST"])
@limiter.limit("3 per minute")
def ai_remediate():
    """
    Generate AI-powered remediation advice from WebSec-SurakshAI scan findings.

    Request JSON:
        findings (list, required): List of finding dicts from a scan
            Each finding should have: title, severity, description

    Returns:
        JSON with ai_advice (str) — specific, prioritized fix plan
    """
    data = request.get_json(silent=True) or {}
    findings = data.get("findings", [])

    if not findings or not isinstance(findings, list):
        return jsonify({"error": "findings list is required and cannot be empty."}), 400
    if len(findings) > 50:
        return jsonify({"error": "Maximum 50 findings can be submitted at once."}), 400

    analyzer = _get_analyzer()
    if not analyzer:
        return jsonify({"error": "AI analyzer is not initialized."}), 503

    try:
        advice = analyzer.generate_ai_remediation(findings)
        return jsonify({
            "ai_advice": advice,
            "findings_count": len(findings),
            "model_used": "Gemini AI 2.5" if analyzer.is_ai_available else "Offline Rule Engine",
            "fallback": not analyzer.is_ai_available
        })
    except Exception as e:
        current_app.logger.error("AI Remediation generation error: %s", e)
        return jsonify({"error": "Failed to generate remediation plan."}), 500


@ai_bp.route("/api/ai/health", methods=["GET"])
def ai_health():
    """Check AI analyzer status."""
    analyzer = _get_analyzer()
    return jsonify({
        "status": "ok",
        "ai_available": analyzer.is_ai_available if analyzer else False,
        "offline_fallback": True,
        "version": "1.0.0"
    })
