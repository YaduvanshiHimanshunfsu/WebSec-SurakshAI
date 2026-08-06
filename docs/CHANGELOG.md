# Changelog

## [2.0.0] - 2026-08-05
**Major Architecture & Feature Update: WebSec-SurakshAI Unification**

### Added
- **SurakshAI Engine**: AI-powered fraud detection for messages, links, and emails using Google Gemini 2.0 Flash.
- **Unified React Frontend**: Replaced old Jinja2 templates with a dark-themed, high-performance React SPA.
- **Dynamic Terminal UI**: Completely rewritten `run.py` launcher with animated spinners, progress bars, and dependency auto-installation.
- **Email Forensics**: RFC 5322 parsing with SPF, DKIM, and DMARC verification via `dkimpy`.
- **AI Remediation**: Gemini AI now generates step-by-step remediation plans based on scanner findings.

### Changed
- Project officially renamed from "WebSec Auditor" to "WebSec-SurakshAI".
- Backend architecture updated to serve React SPA via Application Factory pattern.
- JSON exports are now properly serialized using `json.dumps` rather than string replacement.

### Fixed
- Fixed Gunicorn startup bug where `app` object was missing from module level.
- Fixed authentication gate blocking the React SPA API login routes.
- Handled missing optional dependencies gracefully without crashing.
