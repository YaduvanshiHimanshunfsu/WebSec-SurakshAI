from flask import Blueprint

active_bp = Blueprint('active', __name__)

from . import routes  # noqa: F401, E402
