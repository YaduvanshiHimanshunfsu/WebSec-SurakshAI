"""
WebSec-SurakshAI — App Factory
"""
import logging
import os
from flask import Flask, session, redirect, url_for, request, send_from_directory
from config import config
from .extensions import db, limiter

logger = logging.getLogger(__name__)


def create_app(config_name: str = None) -> Flask:
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Call init_app() on the config class if it defines one (ProductionConfig does)
    cfg_obj = config[config_name]
    if hasattr(cfg_obj, 'init_app'):
        cfg_obj.init_app(app)

    # Init extensions
    db.init_app(app)
    limiter.init_app(app)

    with app.app_context():
        # Import models so SQLAlchemy registers them
        from .models import target, scan, finding  # noqa: F401
        db.create_all()

    # -----------------------------------------------------------------------
    # Initialize AI Analyzer (Gemini) and store in app.extensions
    # -----------------------------------------------------------------------
    try:
        from .ai_analyzer.scam_analyzer import ScamAnalyzer
        from .ai_analyzer.email_analyzer import EmailAnalyzer

        scam_analyzer = ScamAnalyzer(gemini_api_key=app.config.get("GEMINI_API_KEY"))
        email_analyzer = EmailAnalyzer(scam_analyzer=scam_analyzer)

        app.extensions["scam_analyzer"] = scam_analyzer
        app.extensions["email_analyzer"] = email_analyzer

        if scam_analyzer.is_ai_available:
            logger.info("AI Analyzer: Gemini connected — full AI analysis enabled.")
        else:
            logger.warning("AI Analyzer: No GEMINI_API_KEY — rule-based fallback active.")
    except Exception as e:
        logger.error("AI Analyzer initialization failed: %s", e)

    # -----------------------------------------------------------------------
    # Register Blueprints
    # -----------------------------------------------------------------------
    from .main_routes import bp as main_bp
    from .passive import passive_bp
    from .active import active_bp
    from .reports import reports_bp
    from .ai_analyzer import ai_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(passive_bp, url_prefix='/passive')
    app.register_blueprint(active_bp, url_prefix='/active')
    app.register_blueprint(reports_bp, url_prefix='/reports')
    app.register_blueprint(ai_bp)

    # -----------------------------------------------------------------------
    # Auth gate — all routes behind admin password except open routes
    # BUG #2: passive.stream_scan and active.stream_scan are NO LONGER in
    # open_routes.  Each SSE generator now checks the session itself and
    # returns an error event instead of yielding real data to anonymous users.
    # -----------------------------------------------------------------------
    @app.before_request
    def require_auth():
        open_routes = {
            'main.index',
            'main.login',
            'main.logout',
            'main.legacy_static',
            'main.api_login',   # React SPA login
            'main.api_logout',  # React SPA logout
            'static',
            'ai_analyzer.ai_health',  # Health check is always public
        }
        if request.endpoint and request.endpoint not in open_routes:
            if not session.get('authenticated'):
                # API routes return JSON 401 instead of redirect
                if request.path.startswith('/api/'):
                    from flask import jsonify
                    return jsonify({"error": "Authentication required."}), 401
                return redirect(url_for('main.login'))

    # -----------------------------------------------------------------------
    # Security headers — applied to every response (addresses security audit)
    # -----------------------------------------------------------------------
    @app.after_request
    def apply_security_headers(response):
        for header, value in app.config.get('SECURITY_HEADERS', {}).items():
            response.headers.setdefault(header, value)
        return response



    return app
