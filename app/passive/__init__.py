from flask import Blueprint

passive_bp = Blueprint('passive', __name__)

from . import routes  # noqa: F401, E402
