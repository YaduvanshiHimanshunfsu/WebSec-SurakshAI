# Setup & Configuration

## 1. Prerequisites
- Python 3.11+
- Node.js 20+ (for building the React frontend)
- Git

## 2. Installation
```bash
git clone https://github.com/YaduvanshiHimanshunfsu/WebSec-SurakshAI.git
cd WebSec-SurakshAI

# The run.py script will handle creating the venv and installing packages
python run.py --install
```

## 3. Configuration (.env)
Copy the example environment file:
```bash
cp .env.example .env
```

### Essential Keys:
- `SECRET_KEY`: A random string used by Flask to sign session cookies. Generate one with `python -c "import secrets; print(secrets.token_hex(32))"`.
- `ADMIN_PASSWORD`: The password used to login to the dashboard.
- `GEMINI_API_KEY`: Required for the SurakshAI engine. Get a free key at [Google AI Studio](https://aistudio.google.com/).

### Optional Keys:
- `SAFE_BROWSING_API_KEY`: For Google Safe Browsing checks in the Passive Scanner.
- `PHISHTANK_API_KEY`: For PhishTank checks in the Passive Scanner.

## 4. Running the Application

For a full startup with dependency checks and animated terminal UI:
```bash
python run.py
```

To run with the vulnerable Sandbox enabled (for testing):
```bash
python run.py --with-sandbox
```

To run in production mode (using Gunicorn):
```bash
python run.py --prod
```

## 5. Development

If you are modifying the React frontend (`frontend/src/`), you must rebuild it for Flask to serve the changes:
```bash
python run.py --frontend-build
# OR
cd frontend && npm run build
```
