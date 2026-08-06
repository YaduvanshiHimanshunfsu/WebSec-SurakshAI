# WebSec-SurakshAI 🛡️

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0+-black.svg?logo=flask)
![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38BDF8.svg?logo=tailwindcss&logoColor=white)
![Stitch Design System](https://img.shields.io/badge/UI-Stitch%20by%20Google-4648D4.svg)
![SurakshAI Engine](https://img.shields.io/badge/SurakshAI-Gemini%202.5%20%2B%20Offline-00BFFF.svg?logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Made in India](https://img.shields.io/badge/Made%20with%20%E2%9D%A4%EF%B8%8F%20in-India-orange.svg)

> **One tool. Two shields. Zero compromise.**
>
> A unified Cybersecurity & Digital Forensics platform combining an advanced Web Security Scanner with AI-powered Fraud Detection, featuring Google's Stitch Design System.

</div>

---

## 🛑 Problem Statement: The Fragmentation of Security Tools

Today, investigating security threats requires hopping between disconnected tools.

| What you need to check | Before WebSec-SurakshAI ❌ | With WebSec-SurakshAI ✅ |
| :--- | :--- | :--- |
| **TLS/Certificate Health** | SSL Labs (External Site) | Built-in Passive Scanner |
| **HTTP Header Hygiene** | SecurityHeaders.com | Built-in Passive Scanner |
| **Phishing / Reputation** | PhishTank / GSB Lookups | Automatic cross-referencing |
| **Redirection Hop Tracing**| Manual curl / command line | Built-in Link Intelligence Hop Tracker |
| **Active Vulnerabilities** | Burp Suite / ZAP (Complex UI) | Built-in Active Scanner (Gated) |
| **SMS/Email Scam Analysis**| ScamShield apps (Separate Ecosystem) | Built-in SurakshAI Engine |
| **SOC Operations View**    | Expensive Enterprise SIEMs | Built-in SOC Executive Dashboard |

**WebSec-SurakshAI** eliminates this fragmentation by providing a single, beautiful Stitch-powered React application where you can assess web vulnerabilities, track link redirection chains, and analyze suspicious messages, links, and emails.

---

## ✨ Integrated Stitch Suite & Features

### 🏛 1. SOC Executive Dashboard (`SOC Dashboard`)
- **Global Security Score**: Executive score card with sparkline trend indicators and percentage deltas.
- **Active Threats Counter**: Real-time threat counter with pulsing alert ring.
- **System Uptime SLA**: Live operational progress tracking.
- **Deep Scan Terminal Log Feed**: Live status feed displaying `PASS`, `SECURE`, and `WARN` status pills.

### 🔗 2. Link Intelligence & Redirection Chain (`Link Intelligence`)
- **Redirection Chain Hop Tracker**: Visual step-by-step connection line mapping HTTP 301, 302, and 200 hops (e.g. `http://secure-login-update.com/auth` -> `https://bit.ly/3xY9zQ` -> `Final Target`).
- **Technical Footprint Analysis**: Domain age, WHOIS registrar, TLS 1.3 protocol verification, and SSL certificate expiration countdown.

### 🤖 3. SurakshAI Engine (AI-Powered Fraud Detection)
- **Message Analysis**: Detects SMS, WhatsApp, and social media scams in English, Hindi, and Hinglish.
- **Email Forensics**: Parses RFC 5322 emails, validating SPF, DKIM, and DMARC signatures.
- **Gemini AI + Offline Engine**: Powered by Google Gemini AI with built-in offline rule-based fallback remediation generation.
- **Indian Context**: Specifically trained for UPI fraud, KYC scams, fake job offers, and government impersonation.

### 🔍 4. WebSec Security Scanner
- **TLS/SSL Certificates**: Checks expiry, issuer trustworthiness, and protocol deprecation.
- **Security Headers**: Verifies CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and CORS.
- **Cookie Security**: Flags missing `Secure`, `HttpOnly`, and `SameSite` attributes.
- **Phishing Databases & WHOIS**: Google Safe Browsing, PhishTank, and WHOIS domain age lookups.

### 🔔 5. System Notifications Drawer & 2FA Security Gate
- **Notification Drawer**: Slide-out alert drawer with severity filtering (`Critical`, `Warning`, `All`) and action shortcuts.
- **2FA Security Gate**: Morphing aurora background with 6-digit TOTP input for security authentication.

---

## 🛠 Tech Stack

| Component | Technology | Why Chosen? |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite, Tailwind CSS v4, Plus Jakarta Sans | High-performance SPA with Stitch design system, glassmorphism, and smooth keyframe animations. |
| **Backend Core** | Flask 3.x, Gunicorn | Lightweight, extensible Python framework perfect for security tooling. |
| **AI Intelligence**| `google-genai` (Gemini 2.5) + Rule Engine | Fast LLM analysis with robust offline security engine fallback. |
| **Data Parsing** | `tldextract`, `dkimpy`, `dnspython` | Accurate domain extraction and cryptographic email verification. |
| **Database** | SQLite + SQLAlchemy ORM | Zero-config local storage, easily portable. |
| **Reporting** | `xhtml2pdf` | Generates professional PDFs without relying on heavy C-libraries. |

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/YaduvanshiHimanshunfsu/WebSec-SurakshAI.git
cd WebSec-SurakshAI
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
# Edit .env to set a custom ADMIN_PASSWORD or optional GEMINI_API_KEY
```

### 3. Launch Everything with One Command
The single launcher starts both the Vite React frontend and Flask API together:

```bash
python run.py
```

### 4. Access the Web Application
Open your browser to: **http://localhost:5173/**
- **Admin Passphrase**: `123456` (or whatever you set in `.env`)

---

## 👨‍💻 Developer & Attribution

**Himanshu Yadav**  
*National Forensic Sciences University (NFSU), Tripura Campus*  
GitHub: [YaduvanshiHimanshunfsu/WebSec-SurakshAI](https://github.com/YaduvanshiHimanshunfsu/WebSec-SurakshAI)

Built with a vision to democratize cybersecurity and provide a unified, intelligent defense mechanism against digital fraud and web vulnerabilities.
