# WebSec-SurakshAI REST API

The backend exposes a JSON REST API that the React SPA consumes. All routes except those explicitly marked public require a valid session cookie obtained via `/api/login`.

## Authentication

### `POST /api/login`
**Public**. Authenticates the user.
- **Request:** JSON `{"password": "yourpassword"}`
- **Response:**
  - `200 OK`: `{"status": "success", "message": "Authenticated"}` (Sets session cookie)
  - `401 Unauthorized`: `{"status": "error", "message": "Invalid password"}`

### `POST /api/logout`
**Public**. Clears the session.
- **Response:** `200 OK`: `{"status": "success", "message": "Logged out"}`

### `GET /api/auth-check`
Checks if the current session is authenticated.
- **Response:** `200 OK`: `{"authenticated": true}`

---

## SurakshAI Engine (AI Analyzer)

### `POST /api/ai/analyze`
Analyzes a text message for scam indicators.
- **Request:** JSON `{"message": "Suspicious text...", "language": "auto"}`
- **Response:** JSON with `verdict`, `confidence`, `scam_category`, `psychological_tactics`, `red_flags`, `action_steps`.

### `POST /api/ai/url`
Analyzes a URL for phishing signals (typosquatting, TLD abuse, SSL errors).
- **Request:** JSON `{"url": "http://example.com"}`
- **Response:** JSON with `url`, `is_suspicious`, `reasons`, `risk_score`.

### `POST /api/ai/email`
Analyzes an email for spoofing and fraud.
- **Request:** JSON `{"email_text": "...", "is_raw_eml": false}`
- **Response:** JSON with `authentication` (SPF, DKIM, DMARC), `sender_analysis`, `content_analysis`, `verdict`.

### `POST /api/ai/remediate`
Generates an AI-powered remediation plan based on scan findings.
- **Request:** JSON `{"findings": [{"title": "SQLi", "severity": "high", "description": "..."}]}`
- **Response:** JSON `{"ai_advice": "Step 1: Use parameterized queries..."}`

---

## WebSec Scanner

### `POST /api/passive/scan`
Initiates a passive scan against a target domain.
- **Request:** JSON `{"target": "example.com"}`
- **Response:** JSON `{"status": "success", "scan_id": 123, "target_id": 45}`

### `GET /passive/stream/<scan_id>`
Server-Sent Events (SSE) stream for real-time passive scan progress.

### `POST /api/active/scan`
Initiates an active scan. **Requires DNS TXT authorization**.
- **Request:** JSON `{"target_id": 45}`
- **Response:** JSON `{"status": "success", "scan_id": 124}`

### `GET /active/stream/<scan_id>`
Server-Sent Events (SSE) stream for real-time active scan progress.

---

## Reports & Dashboard

### `GET /api/dashboard`
Retrieves overview statistics.
- **Response:** JSON with `total_scans`, `vulnerabilities_found`, `recent_targets` (list).

### `GET /api/reports/<scan_id>`
Retrieves full details for a specific scan.
- **Response:** JSON with `scan`, `target`, `findings` (list), and `score`.

### `GET /export/<scan_id>/json`
Downloads the report as a JSON file.

### `GET /export/<scan_id>/pdf`
Downloads the report as a PDF file.
