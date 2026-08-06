"""
WebSec-SurakshAI — AI Analyzer Blueprint (SurakshAI Engine)
Provides Gemini-powered scam message, URL, and email analysis.
Completely recreated from scratch, inspired by SurakshAI-India architecture.
Author: Himanshu Yadav, NFSU Tripura Campus
"""
from flask import Blueprint

ai_bp = Blueprint('ai_analyzer', __name__)

from . import routes  # noqa: F401, E402
