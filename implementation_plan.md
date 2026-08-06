# WebSec-SurakshAI — Bug Fix Implementation Plan

Fix all bugs and security issues identified in the full static analysis report.
Scope: **V1 fixes only** — no Celery/multi-user/JWT (those are V2 upgrades).

---

## Open Questions

> [!IMPORTANT]
> **BUG #1 (api.js)** — The file `frontend/src/lib/api.js` already EXISTS with 2,366 bytes. No creation needed.
> Confirm: should we leave it as-is or review/update its contents?

> [!IMPORTANT]
> **SESSION_COOKIE_SECURE** — Setting `SESSION_COOKIE_SECURE = True` will break local HTTP dev (`http://localhost`).
> The plan sets this flag only in `ProductionConfig` and leaves `DevelopmentConfig` without it. Confirm this is acceptable.

---

## Proposed Changes

### 🔴 Critical Fixes

---

#### [MODIFY] [config.py](file:///e:/Self%20Project/WebSec%20Auditor/config.py)
- Add `SESSION_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`, `SESSION_COOKIE_SAMESITE`, `PERMANENT_SESSION_LIFETIME` to base `Config`
- `ProductionConfig`: add `init_app()` classmethod that raises `RuntimeError` if `SECRET_KEY` or `ADMIN_PASSWORD` are still the weak defaults
- Fix `RATELIMIT_STORAGE_URL` to use Redis in production via env var, fallback to memory in dev
- Move `SESSION_COOKIE_SECURE = True` to `ProductionConfig` only (so dev stays functional on HTTP)

---

#### [MODIFY] [app/extensions.py](file:///e:/Self%20Project/WebSec%20Auditor/app/extensions.py)
- Add `default_limits=["20 per minute", "200 per hour"]` to `Limiter(...)` so rate limits actually apply globally

---

#### [MODIFY] [app/__init__.py](file:///e:/Self%20Project/WebSec%20Auditor/app/__init__.py)
- **BUG #2 (SSE Auth)**: Remove `passive.stream_scan` and `active.stream_scan` from `open_routes`. Add session check inside each `generate()` generator instead.
- Add `@app.after_request` hook to attach security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-XSS-Protection`, `Permissions-Policy`) to every response

---

#### [MODIFY] [app/passive/routes.py](file:///e:/Self%20Project/WebSec%20Auditor/app/passive/routes.py)
- **BUG #2**: Add `session.get('authenticated')` check at the top of `stream_scan()` — return SSE error event + 401 if unauthenticated
- **BUG #7/13**: In `_get_or_create_target()`, wrap the insert in a try/except `IntegrityError` to handle race conditions
- **BUG #8**: Replace `datetime.utcnow()` → `datetime.now(timezone.utc)`
- **BUG #9**: Replace `Scan.query.get_or_404()` → `db.get_or_404(Scan, scan_id)` and `Target.query.get()` → `db.session.get(Target, scan.target_id)`

---

#### [MODIFY] [app/active/routes.py](file:///e:/Self%20Project/WebSec%20Auditor/app/active/routes.py)
- **BUG #2**: Add session auth check at top of `stream_scan()` — return SSE error if unauthenticated
- **BUG #8**: Replace `datetime.utcnow()` → `datetime.now(timezone.utc)`
- **BUG #9**: Replace `Target.query.get_or_404()` / `Scan.query.get_or_404()` / `Target.query.get()` with SQLAlchemy 2.0 equivalents

---

### 🟡 Code Quality Fixes

---

#### [MODIFY] [app/models/scan.py](file:///e:/Self%20Project/WebSec%20Auditor/app/models/scan.py)
- **BUG #8**: Change `default=datetime.utcnow` → `default=lambda: datetime.now(timezone.utc)`
- Change column type to `db.DateTime(timezone=True)`

---

#### [MODIFY] [app/models/target.py](file:///e:/Self%20Project/WebSec%20Auditor/app/models/target.py)
- **BUG #7/13**: Add `unique=True, index=True` to `domain` column
- **BUG #8**: Change `default=datetime.utcnow` → `default=lambda: datetime.now(timezone.utc)` for `created_at`
- Change column type to `db.DateTime(timezone=True)`

---

#### [MODIFY] [app/passive/tls_checker.py](file:///e:/Self%20Project/WebSec%20Auditor/app/passive/tls_checker.py)
- **BUG #8**: Replace `datetime.utcnow()` with `datetime.now(timezone.utc)` in expiry calculation
- **BUG #12**: Fix typo `'handhake'` → `'handshake'`

---

#### [MODIFY] [app/passive/headers_checker.py](file:///e:/Self%20Project/WebSec%20Auditor/app/passive/headers_checker.py)
- **BUG #10**: Use `current_app.config['SCAN_TIMEOUT']` instead of hard-coded `timeout=10`
- **BUG #11**: Replace `except Exception as e: pass` with `logger.warning(...)` logging

---

#### [MODIFY] [app/passive/whois_lookup.py](file:///e:/Self%20Project/WebSec%20Auditor/app/passive/whois_lookup.py)
- **BUG #11**: Replace `except Exception as e: pass` with `logger.warning(...)` logging

---

#### [MODIFY] [app/active/scanner_engine.py](file:///e:/Self%20Project/WebSec%20Auditor/app/active/scanner_engine.py)
- **BUG #10**: Use `current_app.config['SCAN_TIMEOUT']` instead of hard-coded `timeout=10`
- **BUG #11**: Replace `except Exception: pass` and `except Exception: continue` with `logger.warning(...)` logging

---

#### [MODIFY] [app/active/param_discoverer.py](file:///e:/Self%20Project/WebSec%20Auditor/app/active/param_discoverer.py)
- **BUG #10**: Use `current_app.config['SCAN_TIMEOUT']` instead of hard-coded `timeout=10`
- **BUG #11**: Replace `except Exception: pass` with `logger.warning(...)` logging

---

#### [MODIFY] [app/main_routes.py](file:///e:/Self%20Project/WebSec%20Auditor/app/main_routes.py)
- **ISSUE #4**: Add `page` and `per_page` query params to `api_dashboard()` (default 20, max 100), replacing the hard-coded `.limit(50)`

---

## Verification Plan

### Automated
```bash
# Verify Python files are valid after edits
python -c "import app; print('OK')"
# Run existing test suite
python -m pytest tests/ -v
```

### Manual
1. Start dev server: `python run.py` — app must boot without errors
2. Visit `/passive/stream/1` without logging in → must get 401 / SSE error event
3. Try scanning same URL twice rapidly → no duplicate Target records
4. Check response headers in browser DevTools — security headers must be present
5. Verify `python run.py` warns if `SECRET_KEY` equals the default in production mode
