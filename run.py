"""
WebSec-SurakshAI -- Unified Project Launcher

Developer   : Himanshu Yadav
Institution : National Forensic Sciences University, Tripura Campus
Version     : 2.0.0
GitHub      : github.com/YaduvanshiHimanshunfsu/WebSec-SurakshAI

Usage:
    python run.py                   -- Start backend only (checks all deps)
    python run.py --dev             -- START EVERYTHING: Flask backend + Vite frontend dev server
    python run.py --with-sandbox    -- Start main app + sandbox together
    python run.py --sandbox-only    -- Start only the sandbox (port 5001)
    python run.py --info            -- Show full project info and exit
    python run.py --check           -- Run all preflight checks and exit
    python run.py --tests           -- Run pytest test suite and exit
    python run.py --debug           -- Enable Flask debug mode
    python run.py --prod            -- Run via gunicorn (production mode)
    python run.py --install         -- Auto-install all requirements first
"""

import os
import sys
import io
import json
import signal
import shutil
import socket
import platform
import importlib
import subprocess
import threading
import time
import argparse

# Force UTF-8 encoding for stdout (fixes Windows charmap errors with box-drawing characters)
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# ─────────────────────────────────────────────────────────────────────────────
# ANSI COLOUR HELPERS (no external dependency)
# ─────────────────────────────────────────────────────────────────────────────

if platform.system() == 'Windows':
    os.system('')   # trigger ANSI mode on Win10+

RESET   = '\033[0m'
BOLD    = '\033[1m'
DIM     = '\033[2m'
ITALIC  = '\033[3m'
RED     = '\033[91m'
GREEN   = '\033[92m'
YELLOW  = '\033[93m'
BLUE    = '\033[94m'
MAGENTA = '\033[95m'
CYAN    = '\033[96m'
WHITE   = '\033[97m'
BG_BLUE = '\033[44m'

def c(text, *styles): return ''.join(styles) + str(text) + RESET
def ok(msg):      print(f"  {c('✓', GREEN, BOLD)} {msg}")
def fail(msg):    print(f"  {c('✗', RED, BOLD)}  {msg}")
def warn(msg):    print(f"  {c('⚠', YELLOW, BOLD)} {msg}")
def info(msg):    print(f"  {c('›', CYAN)} {msg}")
def note(msg):    print(f"  {c('·', DIM)} {c(msg, DIM)}")

def box(title, color=CYAN):
    bar = '═' * 62
    print(f"\n{c('╔' + bar + '╗', color)}")
    pad = 62 - len(title) - 2
    print(f"{c('║', color)}  {c(title, BOLD, WHITE)}{' ' * pad}{c('║', color)}")
    print(f"{c('╚' + bar + '╝', color)}\n")

def section(title, emoji=''):
    label = f" {emoji} {title} " if emoji else f" {title} "
    pad   = max(0, 60 - len(label))
    left  = pad // 2
    right = pad - left
    print(f"\n{c('┌' + '─' * left + label + '─' * right + '┐', CYAN, BOLD)}")

def section_end():
    print(c('└' + '─' * 62 + '┘', CYAN))

def spinner_task(label: str, fn, *args):
    """Run fn(*args) in a thread, showing a spinner until done."""
    frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']
    result  = [None]
    done    = threading.Event()

    def worker():
        result[0] = fn(*args)
        done.set()

    t = threading.Thread(target=worker, daemon=True)
    t.start()
    i = 0
    while not done.wait(timeout=0.1):
        spin = c(frames[i % len(frames)], CYAN, BOLD)
        print(f"\r  {spin} {c(label, DIM)}          ", end='', flush=True)
        i += 1
    print(f"\r  {c('✓', GREEN, BOLD)} {label}                     ")
    return result[0]

def progress_bar(current: int, total: int, width: int = 30, label: str = '') -> str:
    filled = int(width * current / max(total, 1))
    bar    = c('█' * filled, GREEN) + c('░' * (width - filled), DIM)
    pct    = f"{int(100 * current / max(total, 1)):3d}%"
    return f"  [{bar}] {c(pct, BOLD)} {c(label, DIM)}"

# ─────────────────────────────────────────────────────────────────────────────
# PROJECT METADATA
# ─────────────────────────────────────────────────────────────────────────────

VERSION = "2.0.0"

BANNER = f"""
{c('╔' + '═'*76 + '╗', CYAN, BOLD)}
{c('║', CYAN)}  {c('WebSec-SurakshAI', BOLD, WHITE)}  {c(f'v{VERSION}', DIM, CYAN)}                                           {c('║', CYAN)}
{c('║', CYAN)}  {c('Web Security Scanner · AI Scam Detector · Digital Forensics', ITALIC, YELLOW)}    {c('║', CYAN)}
{c('║', CYAN)}                                                                            {c('║', CYAN)}
{c('║', CYAN)}  {c('Developer   :', DIM)} {c('Himanshu Yadav', BOLD, WHITE)}                                       {c('║', CYAN)}
{c('║', CYAN)}  {c('Institution :', DIM)} {c('National Forensic Sciences University, Tripura Campus', WHITE)}  {c('║', CYAN)}
{c('║', CYAN)}  {c('Domain      :', DIM)} {c('Cybersecurity · AI · Digital Forensics', CYAN)}                {c('║', CYAN)}
{c('║', CYAN)}  {c('GitHub      :', DIM)} {c('github.com/YaduvanshiHimanshunfsu/WebSec-SurakshAI', DIM)}   {c('║', CYAN)}
{c('╚' + '═'*76 + '╝', CYAN, BOLD)}
"""

PROBLEM_STATEMENT = f"""
{c('┌─ PROBLEM STATEMENT ' + '─'*40 + '┐', MAGENTA, BOLD)}

  Today, a developer or website owner must use {c('5+ separate tools', RED, BOLD)} to
  understand their security posture:

  {c('Before WebSec-SurakshAI:', BOLD)}
    {c('✗', RED)} SSL Labs         → TLS/certificate health
    {c('✗', RED)} SecurityHeaders  → HTTP header hygiene
    {c('✗', RED)} PhishTank/GSB    → phishing/reputation status
    {c('✗', RED)} Burp Suite/ZAP   → active vulnerability testing (too complex)
    {c('✗', RED)} ScamShield apps  → SMS/email fraud detection (separate ecosystem)

  {c('With WebSec-SurakshAI:', BOLD)}
    {c('✓', GREEN)} {c('One unified platform', BOLD)} consolidating passive + active web scanning
       {c('+ AI-powered fraud detection for messages, URLs, and emails', CYAN)}
    {c('✓', GREEN)} Strict legal boundary: passive (safe on any URL) vs
       active (injection payloads, gated behind authorization)
    {c('✓', GREEN)} Indian cyber-safety focus: Hindi/Hinglish scam detection,
       UPI fraud patterns, and government impersonation checks

{c('└' + '─'*60 + '┘', MAGENTA)}
"""

FEATURES = f"""
{c('┌─ FEATURES ' + '─'*48 + '┐', MAGENTA, BOLD)}

  {c('🤖 SurakshAI Engine  (AI-Powered Fraud Detection)', BOLD, CYAN)}
    ✓  Message Analysis    SMS, WhatsApp, social DMs (EN/HI/Hinglish)
    ✓  Link Intelligence   URL typosquatting, TLD abuse, TLS check
    ✓  Email Forensics     RFC 5322 parsing, SPF/DKIM/DMARC validation
    ✓  Gemini AI           Google Gemini 2.0 Flash with offline fallback
    ✓  Indian Context      UPI fraud, KYC scams, fake jobs, gov impersonation

  {c('🔍 WebSec Passive Scanner  (Safe on any public URL)', BOLD, GREEN)}
    ✓  TLS/SSL Certificate  Expiry, issuer, protocol deprecation
    ✓  Security Headers     CSP, HSTS, X-Frame, X-Content-Type, CORS
    ✓  Cookie Security      Secure, HttpOnly, SameSite flags
    ✓  Phishing Databases   Google Safe Browsing + PhishTank
    ✓  WHOIS Domain Age     Recently registered domain detection

  {c('⚡ WebSec Active Scanner  (Authorization Gated)', BOLD, YELLOW)}
    ✓  SQL Injection        Error-based, boolean-based, time-based
    ✓  Cross-Site Scripting Reflected, stored payload testing
    ✓  Command Injection    OS separator injection
    ✓  YAML Templates       Extensible — no Python needed to add checks
    ✓  Built-in Sandbox     Vulnerable Flask app on :5001 for safe testing

  {c('📊 Reporting & AI Remediation', BOLD, BLUE)}
    ✓  Risk Score A–F      Severity-weighted grading (0-100)
    ✓  Scan Diffing        Compare two scans to track improvements
    ✓  AI Remediation      Gemini generates step-by-step fix plans
    ✓  Export              JSON (for CI/CD) + PDF (for stakeholders)

  {c('🛡️  Security of the Tool Itself', BOLD, MAGENTA)}
    ✓  SSRF Protection     Blocks 10.x, 192.168.x, 127.x, 169.254.x
    ✓  Authorization Gate  DNS TXT record verification for external targets
    ✓  Rate Limiting       Flask-Limiter on all scan endpoints

{c('└' + '─'*60 + '┘', MAGENTA)}
"""

SYSTEM_REQUIREMENTS = f"""
{c('┌─ SYSTEM REQUIREMENTS ' + '─'*37 + '┐', MAGENTA, BOLD)}

  {c('Python', BOLD)}     : 3.11 or higher (3.12 recommended)
  {c('Node.js', BOLD)}    : 20+ and npm 10+ (for building React frontend)
  {c('OS', BOLD)}         : Windows 10/11, Linux, macOS
  {c('RAM', BOLD)}        : Minimum 512 MB (1 GB recommended)
  {c('Network', BOLD)}    : Active internet (for phishing APIs + Gemini)
  {c('Ports', BOLD)}      : 5000 (Main App), 5001 (Sandbox)
  {c('Storage', BOLD)}    : ~200 MB (deps + node_modules + project)
  {c('Optional', BOLD)}   : GEMINI_API_KEY, Google Safe Browsing key, PhishTank key

{c('└' + '─'*60 + '┘', MAGENTA)}
"""

LIBRARIES = f"""
{c('┌─ LIBRARIES & DEPENDENCIES ' + '─'*32 + '┐', MAGENTA, BOLD)}

  {c('Core Framework', BOLD, WHITE)}
    Flask             3.x   → Web framework with blueprint architecture
    Flask-SQLAlchemy  3.x   → ORM for SQLite database
    Flask-Limiter     3.x   → Rate limiting on scan endpoints

  {c('AI & Fraud Detection (SurakshAI Engine)', BOLD, CYAN)}
    google-genai      2.x   → Google Gemini API client
    tldextract        5.x   → Accurate TLD extraction for URL analysis
    dkimpy            1.x   → DKIM signature verification for emails

  {c('Web Scanning & Analysis', BOLD, GREEN)}
    requests          2.x   → HTTP client for passive checks
    beautifulsoup4    4.x   → HTML parser for form field discovery
    dnspython         2.x   → DNS queries (auth gate + email DNS checks)
    python-whois      0.x   → WHOIS domain age lookup
    PyYAML            6.x   → Load extensible payload templates

  {c('Reporting', BOLD, YELLOW)}
    xhtml2pdf         0.x   → Pure-Python PDF generation (no C libs)

  {c('Frontend (React/Vite)', BOLD, BLUE)}
    React             18.x  → UI component library
    Vite              5.x   → Build tool and dev server
    Framer Motion     11.x  → Smooth animations
    Lucide React      0.x   → Icon library
    React Hot Toast   2.x   → Toast notifications

  {c('Configuration & Dev', BOLD, WHITE)}
    python-dotenv     1.x   → Load .env for API keys & secrets
    pytest            7.x   → Unit testing framework
    gunicorn          21.x  → Production WSGI server

{c('└' + '─'*60 + '┘', MAGENTA)}
"""

# ─────────────────────────────────────────────────────────────────────────────
# REQUIRED PACKAGES
# ─────────────────────────────────────────────────────────────────────────────
REQUIRED_PACKAGES = {
    'flask':            'Flask',
    'flask_sqlalchemy': 'Flask-SQLAlchemy',
    'flask_limiter':    'Flask-Limiter',
    'requests':         'requests',
    'bs4':              'beautifulsoup4',
    'dns':              'dnspython',
    'whois':            'python-whois',
    'yaml':             'PyYAML',
    'xhtml2pdf':        'xhtml2pdf',
    'dotenv':           'python-dotenv',
    'tldextract':       'tldextract',
    # google-genai: checked separately (import name differs)
    # dkimpy:      checked separately (optional)
}

# ─────────────────────────────────────────────────────────────────────────────
# PRE-FLIGHT CHECKS
# ─────────────────────────────────────────────────────────────────────────────

def check_python_version() -> bool:
    major, minor = sys.version_info.major, sys.version_info.minor
    ver_str = f"Python {major}.{minor}.{sys.version_info.micro}"
    if major < 3 or (major == 3 and minor < 11):
        fail(f"{ver_str} — Python 3.11+ is required.")
        print(f"\n  {c('Fix:', YELLOW)} Download from https://python.org/downloads/")
        return False
    ok(f"{ver_str}")
    return True


def check_dependencies() -> bool:
    all_ok  = True
    missing = []
    total   = len(REQUIRED_PACKAGES) + 2  # +2 for google-genai, dkimpy

    print()
    for i, (import_name, pip_name) in enumerate(REQUIRED_PACKAGES.items(), 1):
        print(progress_bar(i, total, label=pip_name), end='\r')
        try:
            importlib.import_module(import_name)
        except ImportError:
            missing.append(pip_name)
            all_ok = False
    print(progress_bar(total, total), '    ')  # clear line

    # Check google-genai (import as google.genai)
    try:
        importlib.import_module('google.genai')
        ok(f"{'google-genai':<32} installed")
    except ImportError:
        warn(f"{'google-genai':<32} MISSING — AI analyzer will use rule-based fallback")
        missing.append('google-genai')

    # Check dkimpy (optional)
    try:
        importlib.import_module('dkim')
        ok(f"{'dkimpy':<32} installed")
    except ImportError:
        warn(f"{'dkimpy':<32} not installed — DKIM verification disabled")

    for pkg in (set(REQUIRED_PACKAGES.values()) - set(missing)):
        ok(f"{pkg:<32} installed")

    if missing:
        print(f"\n  {c('Missing packages:', YELLOW, BOLD)}")
        print(f"  {c('pip install ' + ' '.join(missing), BOLD, WHITE)}")
        print(f"\n  {c('Or: pip install -r requirements.txt', YELLOW)}")
        print(f"  {c('Or: python run.py --install', YELLOW)}")

    return all_ok


def check_env_file() -> bool:
    env_path = os.path.join(os.path.dirname(__file__), '.env')

    if not os.path.exists(env_path):
        warn(".env file not found — using default (insecure) values.")
        note("Run: cp .env.example .env   then edit it.")
        return True  # non-fatal

    from dotenv import dotenv_values
    env = dotenv_values(env_path)

    secret_key = env.get('SECRET_KEY', '')
    admin_pwd  = env.get('ADMIN_PASSWORD', '')
    gemini_key = env.get('GEMINI_API_KEY', '')

    if not secret_key or 'generate-a-long' in secret_key:
        warn("SECRET_KEY is using the default — change before deploying!")
    else:
        ok(f"SECRET_KEY       {'✓ set'}")

    ok(f"ADMIN_PASSWORD   {c('✓ Default: admin / admin123', GREEN)}")

    if not gemini_key:
        warn(f"GEMINI_API_KEY   {c('not set', YELLOW)} — AI analyzer uses rule-based fallback")
        note("Get a free key at: https://aistudio.google.com/")
    else:
        ok(f"GEMINI_API_KEY   {c('✓ AI fully active', GREEN, BOLD)}")

    if not env.get('SAFE_BROWSING_API_KEY'):
        warn("SAFE_BROWSING_API_KEY not set — Google phishing check disabled")
    else:
        ok("SAFE_BROWSING_API_KEY  ✓ set")

    if not env.get('PHISHTANK_API_KEY'):
        note("PHISHTANK_API_KEY not set — PhishTank check disabled")
    else:
        ok("PHISHTANK_API_KEY  ✓ set")

    return True



def check_project_structure() -> bool:
    base = os.path.dirname(os.path.abspath(__file__))

    required_paths = [
        ('app/__init__.py',                          'App Factory'),
        ('app/extensions.py',                        'Extensions'),
        ('app/ai_analyzer/scam_analyzer.py',         'SurakshAI Scam Analyzer'),
        ('app/ai_analyzer/email_analyzer.py',        'SurakshAI Email Analyzer'),
        ('app/ai_analyzer/routes.py',                'AI API Routes'),
        ('app/models/target.py',                     'Target Model'),
        ('app/models/scan.py',                       'Scan Model'),
        ('app/models/finding.py',                    'Finding Model'),
        ('app/passive/tls_checker.py',               'TLS Checker'),
        ('app/passive/headers_checker.py',           'Headers Checker'),
        ('app/passive/phishing_checker.py',          'Phishing Checker'),
        ('app/passive/whois_lookup.py',              'WHOIS Lookup'),
        ('app/active/authorization.py',              'Authorization Gate'),
        ('app/active/scanner_engine.py',             'Scanner Engine'),
        ('app/reports/risk_scoring.py',              'Risk Scoring'),
        ('app/payload_templates/sqli/error_based.yaml',   'SQLi Template'),
        ('app/payload_templates/xss/reflected.yaml',      'XSS Template'),
        ('app/payload_templates/cmdi/separators.yaml',    'CMDi Template'),
        ('sandbox/vulnerable_app.py',                'Sandbox App'),
        ('config.py',                                'Config'),
        ('requirements.txt',                         'Requirements'),
    ]

    all_ok = True
    for rel_path, label in required_paths:
        full_path = os.path.join(base, *rel_path.replace('/', os.sep).split(os.sep))
        if os.path.exists(full_path):
            ok(f"{label:<38} {c('✓', GREEN)}")
        else:
            fail(f"{label:<38} {c(rel_path + '  ← MISSING', RED)}")
            all_ok = False

    return all_ok


def get_local_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'


def run_tests() -> bool:
    result = subprocess.run(
        [sys.executable, '-m', 'pytest', 'tests/', '-v', '--tb=short'],
        cwd=os.path.dirname(os.path.abspath(__file__))
    )
    return result.returncode == 0


# ─────────────────────────────────────────────────────────────────────────────
# INSTALL & BUILD HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def get_venv_python() -> str:
    """Return the path to the venv Python inside .venv/, creating the venv if needed."""
    base     = os.path.dirname(os.path.abspath(__file__))
    venv_dir = os.path.join(base, '.venv')

    # Platform-specific venv python path
    if platform.system() == 'Windows':
        venv_python = os.path.join(venv_dir, 'Scripts', 'python.exe')
    else:
        venv_python = os.path.join(venv_dir, 'bin', 'python')

    # If the venv doesn't exist yet, create it using the CURRENT Python
    if not os.path.exists(venv_python):
        info(f"Creating virtual environment at {c('.venv/', CYAN)} ...")
        result = subprocess.run([sys.executable, '-m', 'venv', venv_dir])
        if result.returncode != 0:
            fail("Failed to create virtual environment!")
            return ''
        ok(".venv created successfully.")

    return venv_python


def auto_install_requirements() -> tuple:
    """
    Create .venv (if needed), install requirements.txt into it.
    Returns (success: bool, venv_python: str).
    """
    req_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'requirements.txt')
    if not os.path.exists(req_file):
        fail("requirements.txt not found!")
        return False, ''

    box("Installing Python Dependencies", BLUE)

    venv_python = get_venv_python()
    if not venv_python:
        return False, ''

    info(f"Installing into {c('.venv/', CYAN)} using venv pip ...")
    result = subprocess.run([venv_python, '-m', 'pip', 'install', '-r', req_file,
                             '--upgrade', '--quiet'])

    if result.returncode == 0:
        ok("All Python dependencies installed successfully into .venv/")
        return True, venv_python

    # If quiet failed, retry with output so the user can see the error
    result = subprocess.run([venv_python, '-m', 'pip', 'install', '-r', req_file, '--upgrade'])
    if result.returncode == 0:
        ok("All Python dependencies installed successfully into .venv/")
        return True, venv_python

    fail("pip install failed — check output above.")
    return False, ''



# ─────────────────────────────────────────────────────────────────────────────
# PROCESS MANAGEMENT
# ─────────────────────────────────────────────────────────────────────────────

sandbox_process  = None
frontend_process = None


def start_sandbox() -> subprocess.Popen | None:
    base            = os.path.dirname(os.path.abspath(__file__))
    sandbox_script  = os.path.join(base, 'sandbox', 'vulnerable_app.py')

    if not os.path.exists(sandbox_script):
        warn("Sandbox app not found at sandbox/vulnerable_app.py — skipping.")
        return None

    proc = subprocess.Popen(
        [sys.executable, sandbox_script],
        cwd=os.path.join(base, 'sandbox'),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(1.5)

    if proc.poll() is not None:
        warn("Sandbox failed to start — check sandbox/vulnerable_app.py")
        return None

    ok(f"Sandbox running  → {c('http://localhost:5001', CYAN, BOLD)}   (PID {proc.pid})")
    return proc


def start_main_app(debug: bool = False) -> None:
    from dotenv import load_dotenv
    load_dotenv()

    base = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, base)
    os.environ.setdefault('FLASK_ENV', 'development')

    from app import create_app
    flask_app = create_app()

    host     = '127.0.0.1'
    port     = int(os.environ.get('PORT', 5000))
    local_ip = get_local_ip()

    box("WebSec-SurakshAI  —  Server Running", GREEN)
    info(f"Web App URL → {c('http://localhost:5173/', GREEN, BOLD)}   (React SPA + Stitch Design System)")
    info(f"Backend API → {c('http://127.0.0.1:5000/api', DIM)}")
    info(f"Mode        → {c('DEBUG', YELLOW) if debug else c('PRODUCTION', GREEN)}")
    info(f"Database    → {c(flask_app.config.get('SQLALCHEMY_DATABASE_URI','?'), DIM)}")
    # AI status
    analyzer = flask_app.extensions.get('scam_analyzer')
    if analyzer and analyzer.is_ai_available:
        ok(f"SurakshAI Engine  → {c('Gemini AI  ✓  ACTIVE', GREEN, BOLD)}")
    else:
        warn(f"SurakshAI Engine  → {c('Offline rule-based fallback (set GEMINI_API_KEY)', YELLOW)}")

    print(f"\n  {c('Press Ctrl+C to stop all services.', DIM)}")
    print(c('─' * 64, DIM) + '\n')

    flask_app.run(
        debug=debug,
        host=host,
        port=port,
        use_reloader=False,
        threaded=True,
    )


def start_frontend() -> subprocess.Popen | None:
    """
    Launch 'npm run dev' inside the frontend/ directory.
    Auto-runs 'npm install' first if node_modules/ is missing.
    Returns the Popen process or None on failure.
    """
    base         = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(base, 'frontend')

    if not os.path.isdir(frontend_dir):
        warn("frontend/ directory not found — skipping Vite dev server.")
        return None

    # Auto npm install if node_modules is missing
    node_modules = os.path.join(frontend_dir, 'node_modules')
    if not os.path.isdir(node_modules):
        info("node_modules/ not found — running npm install first...")
        result = subprocess.run(
            ['npm', 'install'],
            cwd=frontend_dir,
            shell=(platform.system() == 'Windows'),
        )
        if result.returncode != 0:
            fail("npm install failed — check your Node.js / npm installation.")
            return None
        ok("npm install complete.")

    # Launch 'npm run dev' — it stays alive in the background
    proc = subprocess.Popen(
        ['npm', 'run', 'dev'],
        cwd=frontend_dir,
        shell=(platform.system() == 'Windows'),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    # Stream Vite output in a daemon thread so it shows in the terminal
    def _stream():
        prefix = c('[Vite]', BLUE, BOLD)
        for line in proc.stdout:
            stripped = line.rstrip()
            if stripped:
                print(f"  {prefix} {stripped}")

    t = threading.Thread(target=_stream, daemon=True)
    t.start()

    # Give Vite 2s to start — check it didn't crash immediately
    time.sleep(2)
    if proc.poll() is not None:
        warn("Vite dev server failed to start — check frontend/ for errors.")
        return None

    ok(f"Vite dev server → {c('http://localhost:5173', CYAN, BOLD)}   (PID {proc.pid})")
    return proc


def cleanup(sig=None, frame=None):
    global sandbox_process, frontend_process
    print(f"\n\n{c('  ⏹  Shutting down WebSec-SurakshAI...', YELLOW)}")
    if sandbox_process and sandbox_process.poll() is None:
        sandbox_process.terminate()
        sandbox_process.wait(timeout=3)
        ok("Sandbox stopped.")
    if frontend_process and frontend_process.poll() is None:
        frontend_process.terminate()
        try:
            frontend_process.wait(timeout=3)
        except Exception:
            frontend_process.kill()
        ok("Vite dev server stopped.")
    print(f"  {c('Goodbye! Stay secure. 🛡️', DIM)}\n")
    sys.exit(0)


# ─────────────────────────────────────────────────────────────────────────────
# ARGUMENT PARSER
# ─────────────────────────────────────────────────────────────────────────────

def parse_args():
    p = argparse.ArgumentParser(
        description='WebSec-SurakshAI — Unified Launcher',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    p.add_argument('--dev',             action='store_true', help='Start Flask backend + Vite frontend together (recommended for development)')
    p.add_argument('--with-sandbox',    action='store_true', help='Start main app + sandbox together')
    p.add_argument('--sandbox-only',    action='store_true', help='Start only the sandbox (port 5001)')
    p.add_argument('--info',            action='store_true', help='Show project info and exit')
    p.add_argument('--check',           action='store_true', help='Run dependency/structure checks and exit')
    p.add_argument('--tests',           action='store_true', help='Run pytest test suite and exit')
    p.add_argument('--debug',           action='store_true', help='Enable Flask debug mode')
    p.add_argument('--prod',            action='store_true', help='Run via gunicorn (production mode)')
    p.add_argument('--install',         action='store_true', help='Auto pip install requirements first')
    return p.parse_args()


# ─────────────────────────────────────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def main():
    global sandbox_process, frontend_process

    print(BANNER)
    args = parse_args()

    # ── --install ────────────────────────────────────────────────────────────
    if args.install:
        success, _ = auto_install_requirements()
        sys.exit(0 if success else 1)

    # ── --info ───────────────────────────────────────────────────────────────
    if args.info:
        print(PROBLEM_STATEMENT)
        print(FEATURES)
        print(SYSTEM_REQUIREMENTS)
        print(LIBRARIES)
        sys.exit(0)

    # ── --check ──────────────────────────────────────────────────────────────
    if args.check:
        checks = [
            ("Python Version",       check_python_version),
            ("Dependencies",         check_dependencies),
            ("Environment Config",   check_env_file),
            ("Project Structure",    check_project_structure),
        ]
        results = {}
        for i, (name, fn) in enumerate(checks, 1):
            box(f"[{i}/{len(checks)}] {name}")
            results[name] = fn()

        box("Summary", CYAN)
        all_ok = all(results.values())
        for name, passed in results.items():
            sym = c('✓', GREEN, BOLD) if passed else c('✗', RED, BOLD)
            print(f"  {sym} {name}")
        print()
        if all_ok:
            print(f"  {c('All checks passed — WebSec-SurakshAI is ready!', GREEN, BOLD)} 🚀\n")
        else:
            print(f"  {c('Some checks failed — fix issues above before running.', RED, BOLD)}\n")
        sys.exit(0 if all_ok else 1)

    # ── --tests ──────────────────────────────────────────────────────────────
    if args.tests:
        box("Running Test Suite")
        if not check_dependencies():
            sys.exit(1)
        success = run_tests()
        sys.exit(0 if success else 1)

    # ── --sandbox-only ───────────────────────────────────────────────────────
    if args.sandbox_only:
        box("Sandbox Only Mode (Intentionally Vulnerable App)", YELLOW)
        base           = os.path.dirname(os.path.abspath(__file__))
        sandbox_script = os.path.join(base, 'sandbox', 'vulnerable_app.py')
        info(f"Sandbox → {c('http://localhost:5001', CYAN, BOLD)}")
        info("Test routes: /login (SQLi)  /search?q= (XSS)  /ping (CMDi)")
        print(f"\n  {c('Press Ctrl+C to stop.', DIM)}\n")
        signal.signal(signal.SIGINT, cleanup)
        os.execv(sys.executable, [sys.executable, sandbox_script])
        return

    # ── Normal startup: run preflight checks ─────────────────────────────────
    box("[1/5] Python Version Check")
    py_ok = check_python_version()

    box("[2/5] Dependency Check")
    dep_ok = check_dependencies()

    box("[3/5] Environment Config")
    check_env_file()

    box("[4/4] Project Structure")
    str_ok = check_project_structure()

    if not py_ok:
        print(f"\n  {c('Cannot start — Python version check failed.', RED, BOLD)}\n")
        sys.exit(1)

    if not dep_ok:
        print(f"\n  {c('Cannot start — missing dependencies.', RED, BOLD)}")
        try:
            ans = input(f"  {c('Would you like to auto-install missing packages now? [Y/n]: ', YELLOW)}").strip().lower()
        except KeyboardInterrupt:
            print()
            sys.exit(1)
        
        if ans in ('', 'y', 'yes'):
            success, venv_python = auto_install_requirements()
            if success and venv_python:
                print(f"\n  {c('Dependencies installed!', GREEN, BOLD)}")
                print(f"  {c('Restarting with venv Python...', CYAN)}\n")
                note(f"TIP: Next time, run directly: {venv_python} run.py")
                print()
                # Restart using the VENV Python — packages guaranteed to exist there
                result = subprocess.run([venv_python, os.path.abspath(__file__)] + sys.argv[1:])
                sys.exit(result.returncode)
            else:
                sys.exit(1)
        else:
            print(f"  {c('Run manually: python run.py --install', YELLOW)}\n")
            sys.exit(1)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    # ── Default / Dev mode: Start Full-Stack System (Frontend + Backend) ─────
    if not args.prod:
<<<<<<< HEAD
        box("🚀  WebSec-SurakshAI  —  Starting System", GREEN)
        info(f"Web App URL → {c('http://localhost:5173/', GREEN, BOLD)}   ← Open this in your browser")
        info(f"Backend API → {c('http://127.0.0.1:5000/api', DIM)}")
        info(f"Database    → {c('sqlite:///websec.db', DIM)}")
=======
        box("🚀  WebSec-SurakshAI  —  Main System Online", GREEN)
        info(f"Main Website  → {c('http://localhost:5173/', CYAN, BOLD)}  (React SPA Application)")
        info(f"Backend API   → {c('http://localhost:5000/api', DIM)}  (REST Services)")
        info(f"Database      → {c('sqlite:///websec.db', DIM)}")
>>>>>>> c867a4e (feat: complete Phase 1-3 production upgrade for Vercel, Supabase PostgreSQL, PyOTP 2FA, Celery queues, and DAST probes)
        
        print(f"\n  {c('Starting Vite frontend dev server...', DIM)}")
        frontend_process = start_frontend()
        if args.with_sandbox:
            box("Starting Sandbox", YELLOW)
            sandbox_process = start_sandbox()
        print(f"\n  {c('Starting Flask backend...', DIM)}")
        start_main_app(debug=True)
        return

    # ── Production mode via gunicorn ─────────────────────────────────────────
    if args.prod:
        if not shutil.which('gunicorn'):
            fail("gunicorn not found — install with: pip install gunicorn")
            sys.exit(1)
        host    = '0.0.0.0'
        port    = int(os.environ.get('PORT', 5000))
        workers = 2
        box("Gunicorn Production Mode", GREEN)
        info(f"Binding  : {c(f'http://{host}:{port}', CYAN, BOLD)}")
        info(f"Workers  : {workers}")
        info("Press Ctrl+C to stop.")
        result = subprocess.run([
            'gunicorn',
            f'--bind={host}:{port}',
            f'--workers={workers}',
            '--threads=4',
            '--worker-class=gthread',
            '--timeout=120',
            'run:app',
        ])
        sys.exit(result.returncode)


# ─────────────────────────────────────────────────────────────────────────────
# Module-level app object — required for `gunicorn run:app`
# ─────────────────────────────────────────────────────────────────────────────
# Only create if this module is imported (not when run directly via __main__)
if __name__ != '__main__':
    try:
        from dotenv import load_dotenv
        load_dotenv()
        from app import create_app
        app = create_app()
    except Exception:
        app = None  # graceful fallback if imports not ready


if __name__ == '__main__':
    main()
