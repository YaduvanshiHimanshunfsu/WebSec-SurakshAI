"""
WebSec-SurakshAI — Shared Extension Instances
Instantiated here to avoid circular imports.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

db = SQLAlchemy()

try:
    from flask_migrate import Migrate
    migrate = Migrate()
except ImportError:
    class DummyMigrate:
        def init_app(self, app, db=None):
            pass
    migrate = DummyMigrate()

# BUG #4: default_limits must be set on the constructor — the RATELIMIT_DEFAULT
# config key alone does NOT auto-apply limits to routes.  These defaults now
# apply to every route that doesn't carry its own @limiter.limit() decorator.
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["20 per minute", "200 per hour"],
)
