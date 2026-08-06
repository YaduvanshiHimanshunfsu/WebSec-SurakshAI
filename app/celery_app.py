"""
Celery Application Instance — Configured with Flask application context.
"""
from celery import Celery
import os

try:
    from celery import Celery
    def make_celery(app_name=__name__):
        redis_url = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
        celery_inst = Celery(
            app_name,
            backend=redis_url,
            broker=redis_url
        )
        celery_inst.conf.update(
            task_serializer='json',
            accept_content=['json'],
            result_serializer='json',
            timezone='UTC',
            enable_utc=True,
        )
        return celery_inst
    celery = make_celery()
except ImportError:
    class DummyCelery:
        def task(self, *args, **kwargs):
            def decorator(fn):
                fn.delay = lambda *a, **kw: None
                return fn
            return decorator
    celery = DummyCelery()
