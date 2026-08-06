"""
WebSec Auditor — Intentionally Vulnerable Sandbox App
WARNING: This app is deliberately insecure. Run ONLY locally for testing.
"""
from flask import Flask, request, render_template_string
import sqlite3
import subprocess

app = Flask(__name__)
DB = 'sandbox.db'

def get_db():
    return sqlite3.connect(DB)

@app.before_request
def create_tables():
    db = get_db()
    db.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)")
    db.execute("INSERT OR IGNORE INTO users VALUES (1, 'admin', 'secret123')")
    db.execute("INSERT OR IGNORE INTO users VALUES (2, 'alice', 'password')")
    db.commit()
    db.close()

# --- SQLi Vulnerable Login ---
@app.route('/login', methods=['GET', 'POST'])
def login():
    result = ''
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        # INTENTIONALLY VULNERABLE — string concatenation
        try:
            db = get_db()
            query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
            rows = db.execute(query).fetchall()
            result = f"Found {len(rows)} user(s)" if rows else "Invalid credentials"
        except Exception as e:
            result = str(e)  # Leaks SQL errors for error-based SQLi
    return render_template_string(LOGIN_TEMPLATE, result=result)

LOGIN_TEMPLATE = """
<h2>Login (SQLi Sandbox)</h2>
<form method="POST">
  <input name="username" placeholder="Username"><br>
  <input name="password" type="password" placeholder="Password"><br>
  <button type="submit">Login</button>
</form>
<p>{{ result }}</p>
<a href="/">Back</a>
"""

# --- XSS Vulnerable Search ---
@app.route('/search')
def search():
    q = request.args.get('q', '')
    # INTENTIONALLY VULNERABLE — no escaping
    return render_template_string(f"<h2>Search (XSS Sandbox)</h2><p>Results for: {q}</p><a href='/'>Back</a>")

# --- Command Injection Vulnerable Ping ---
@app.route('/ping', methods=['GET', 'POST'])
def ping():
    output = ''
    if request.method == 'POST':
        host = request.form.get('host', '')
        # INTENTIONALLY VULNERABLE — shell=True + unsanitized input
        try:
            # -n 1 for windows, -c 1 for linux
            cmd = f"ping -c 1 {host}" if hasattr(subprocess, 'check_output') else f"ping -n 1 {host}"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
            output = result.stdout or result.stderr
        except Exception as e:
            output = str(e)
    return render_template_string(PING_TEMPLATE, output=output)

PING_TEMPLATE = """
<h2>Ping Tool (CMDi Sandbox)</h2>
<form method="POST">
  <input name="host" placeholder="Hostname or IP"><br>
  <button type="submit">Ping</button>
</form>
<pre>{{ output }}</pre>
<a href="/">Back</a>
"""

@app.route('/')
def index():
    return '''
    <h1>WebSec Auditor Sandbox</h1>
    <p>This is a deliberately vulnerable application for testing.</p>
    <ul>
        <li><a href="/login">SQL Injection (Login)</a></li>
        <li><a href="/search?q=test">Reflected XSS (Search)</a></li>
        <li><a href="/ping">Command Injection (Ping)</a></li>
    </ul>
    '''

if __name__ == '__main__':
    app.run(port=5001, debug=False)
