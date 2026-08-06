# WebSec-SurakshAI — Stitch by Google Design Prompts

> One prompt per screen. Each prompt is self-contained and ready to paste directly into Stitch.
> Design system: **Dark security aesthetic** · Accent `#3b82f6` (blue-500) · Background `#0b0f19` · Cards `#1a2234`

---

## SCREEN 1 — Login / Auth Gate  *(Light • Animated • Colorful)*

```
Design a FULL-SCREEN, LIGHT-MODE login page for a cybersecurity web application called
"WebSec-SurakshAI" (AI-Powered Web Security & Scam Detection). The design must feel
premium, dynamic, and visually stunning — like a top-tier SaaS product launch page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OVERALL AESTHETIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Mode: LIGHT (white/soft-cream base)
- Feel: Clean, modern, colorful — NOT corporate or boring
- Inspiration: Linear.app login × Vercel onboarding × Stripe dashboard intro
- Font stack: "Plus Jakarta Sans" (headings) + "Inter" (body/labels) — import from Google Fonts
- Motion philosophy: Every element enters with purpose; idle states breathe and pulse softly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKGROUND (FULL VIEWPORT — MOST IMPORTANT LAYER)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Create a LIVE AURORA / MESH GRADIENT background that continuously morphs:

Base color: #f8faff (near-white with blue tint)

Layer 1 — Large animated blob (top-left):
  - Color: radial gradient from #c7d7ff (lavender-blue) → transparent
  - Size: 600px × 600px
  - Animation: slow drift + scale pulse (20s infinite ease-in-out alternate)
  - Keyframes: translate(-80px, -60px) scale(1.1) → translate(40px, 80px) scale(0.9)

Layer 2 — Medium blob (top-right):
  - Color: radial gradient from #ffd6f5 (soft pink) → transparent
  - Size: 400px × 400px
  - Animation: drift opposite direction (25s infinite ease-in-out alternate-reverse)
  - Keyframes: translate(60px, -40px) → translate(-50px, 60px)

Layer 3 — Small blob (bottom-center):
  - Color: radial gradient from #c3fae8 (mint green) → transparent
  - Size: 350px × 350px
  - Animation: drift + rotation effect (18s infinite ease-in-out alternate)

Layer 4 — Noise/grain texture overlay:
  - SVG feTurbulence filter at 2% opacity for organic texture
  - Makes gradient feel painted, not digital

FLOATING PARTICLE ORBS (10–14 orbs scattered across full viewport):
  - Each orb: circle, 6px–18px diameter
  - Colors cycling: #6366f1, #ec4899, #06b6d4, #10b981, #f59e0b, #8b5cf6
  - Animation: float up slowly while gently swaying left-right, 8s–20s duration
    Each orb has random start delay (0s–8s) so they appear organic
  - Opacity: 0.25–0.55
  - CSS: will-change: transform for GPU acceleration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAIN LOGIN CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Position: absolute center of viewport (transform: translate(-50%, -50%))
Size: 440px wide, auto height
Padding: 40px

CARD BACKGROUND & BORDER:
  - Background: rgba(255, 255, 255, 0.72)
  - Backdrop-filter: blur(24px) saturate(180%)
  - Border: 1.5px solid with ANIMATED RAINBOW SHIMMER:
    CSS custom property animation cycling through:
    hsl(240,80%,80%) → hsl(300,80%,80%) → hsl(0,80%,80%) → hsl(60,80%,80%) → hsl(120,80%,80%) → hsl(180,80%,80%) → hsl(240,80%,80%)
    Duration: 6s linear infinite
    Use border-image or ::before pseudo-element with gradient border technique
  - Border-radius: 24px
  - Box-shadow:
    0 0 0 1px rgba(255,255,255,0.6) inset,   ← inner bright edge
    0 8px 32px rgba(99,102,241,0.12),         ← blue shadow
    0 32px 80px rgba(236,72,153,0.06),        ← pink shadow
    0 2px 4px rgba(0,0,0,0.04)                ← subtle ground shadow

CARD ENTRANCE ANIMATION (triggered on page load):
  - Card animates in: opacity 0 → 1, translateY(32px) → translateY(0)
  - Duration: 600ms, easing: cubic-bezier(0.22, 1, 0.36, 1)  ← spring-like
  - Each child element staggers in with 80ms delay between them

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CARD CONTENTS (top to bottom, staggered entrance)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ELEMENT 1 — Logo / Brand Mark]  delay: 0ms
  - Container: 64×64px, border-radius: 18px
  - Background: LINEAR GRADIENT at 135deg: #6366f1 → #8b5cf6 → #ec4899
  - Box-shadow: 0 8px 24px rgba(99,102,241,0.4)
  - Inside: Shield icon (32px, white, stroke-width 2)
  - ANIMATION (idle): shield pulses scale 1.0 → 1.06 → 1.0 over 3s ease-in-out infinite
    Also: very slow hue rotation on the gradient (filter: hue-rotate 0deg→360deg, 8s infinite)

[ELEMENT 2 — App Name]  delay: 80ms
  - "WebSec-SurakshAI" in 28px Plus Jakarta Sans, font-weight 800
  - Color: GRADIENT TEXT — background-clip: text; background: linear-gradient(135deg, #1e1b4b, #6366f1, #ec4899)
  - Margin-top: 16px

[ELEMENT 3 — Subtitle chips row]  delay: 160ms
  - Horizontal row of 2 small pill badges, centered:
    Badge 1: "🛡️ AI-Powered" — bg: rgba(99,102,241,0.1), text: #6366f1, border: 1px solid rgba(99,102,241,0.25)
    Badge 2: "🎓 NFSU Tripura" — bg: rgba(16,185,129,0.08), text: #059669, border: 1px solid rgba(16,185,129,0.2)
  - Each badge: 10px font-size, 4px 10px padding, border-radius: 100px
  - Gap between: 8px

[ELEMENT 4 — Tagline with typewriter effect]  delay: 240ms
  - Text: "Web Security · Scam Detection · Phishing Analysis"
  - 13px Inter, color: #64748b, text-align: center
  - TYPEWRITER ANIMATION: each character reveals one by one, then blinks cursor ( | )
    Speed: 40ms per character, cursor blinks 0.7s on/off cycle, stops blinking after 3s
    After full text shown: cursor fades out with opacity transition

[ELEMENT 5 — Divider]  delay: 320ms
  - 1px line, gradient: transparent → rgba(99,102,241,0.2) → transparent
  - Margin: 24px 0

[ELEMENT 6 — Password Field]  delay: 400ms
  Label row (flex, space-between):
    - Left: Lock icon (14px, #6366f1) + "Admin Password" in 13px semibold Inter, color: #374151
    - Right: "Forgot?" text link in 12px, color: #9ca3af (hover: #6366f1)

  Input field (full-width, margin-top: 8px):
    - Background: rgba(248, 250, 252, 0.8)
    - Border: 1.5px solid #e2e8f0
    - Border-radius: 12px
    - Padding: 13px 44px 13px 44px (icons on both sides)
    - Left icon: Lock (16px, #9ca3af, positioned absolute)
    - Right icon: Eye/EyeOff toggle (16px, #9ca3af → #6366f1 on hover, cursor: pointer)
    - Placeholder: "Enter admin password" in color: #cbd5e1
    - Font: 14px Inter, color: #111827

    ON FOCUS STATE:
      - Border: 1.5px solid #6366f1
      - Background: #ffffff
      - Box-shadow: 0 0 0 4px rgba(99,102,241,0.12), 0 2px 8px rgba(99,102,241,0.08)
      - Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
      - Left lock icon: color transitions #9ca3af → #6366f1

    PASSWORD STRENGTH BAR (animates in from opacity:0 once user starts typing):
      - 3px tall bar, border-radius 2px, full width, margin-top: 8px
      - 3 segments with 4px gap between:
          Segment 1 (weak):   fills red   #ef4444 when password length > 0
          Segment 2 (medium): fills amber #f59e0b when length > 7 and has mixed chars
          Segment 3 (strong): fills green #10b981 when length > 11 and has symbols
      - Each segment width transitions from 0% → 33% over 300ms ease-out
      - Below bar: "Strength: Weak" / "Fair" / "Strong" in 11px, matching color

[ELEMENT 7 — Sign In Button]  delay: 480ms
  DEFAULT STATE:
    - Full-width, height: 48px, border-radius: 12px
    - Background: linear-gradient(135deg, #6366f1, #8b5cf6)
    - Box-shadow: 0 4px 16px rgba(99,102,241,0.35), 0 2px 4px rgba(0,0,0,0.08)
    - Text: "Enter Dashboard" in 15px Plus Jakarta Sans, font-weight: 700, white
    - Right arrow icon (→ ArrowRight, 16px white) with 8px gap from text

  HOVER STATE:
    - Background shifts: linear-gradient(135deg, #4f46e5, #7c3aed)
    - Box-shadow: 0 6px 24px rgba(99,102,241,0.5)
    - Arrow icon: translateX(4px) — slides right
    - Button: translateY(-1px) — lifts off surface
    - Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)

  ACTIVE/PRESS STATE:
    - Transform: translateY(1px) scale(0.99)
    - Box-shadow: 0 2px 8px rgba(99,102,241,0.25)

  LOADING STATE (triggered on click):
    - Background: linear-gradient(135deg, #6366f1, #8b5cf6, #6366f1)
    - background-size: 200%
    - Animation: shimmer — background-position -200% → 200%, 1.5s linear infinite
    - Arrow replaced by: spinning circle (20px, border: 2px solid rgba(255,255,255,0.3), border-top: 2px solid #fff)
    - Text: "Verifying…"
    - pointer-events: none, opacity: 0.85

[ELEMENT 8 — Footer]  delay: 560ms
  - "🔒 Developed by Himanshu Yadav · National Forensic Sciences University, Tripura Campus"
  - 11px Inter, color: #9ca3af, text-align: center
  - Margin-top: 20px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR STATE — Toast Notification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
On wrong password:
  - Toast slides in from top-center: translateY(-20px) opacity:0 → translateY(0) opacity:1
  - Easing: cubic-bezier(0.34, 1.56, 0.64, 1)  ← bouncy spring, 350ms
  - Style: bg #fff1f2, border: 1px solid #fecdd3, border-left: 4px solid #ef4444
  - Contents: ⚠️ icon | "Incorrect password. Try again." | ✕ dismiss button
  - Border-radius: 12px, box-shadow: 0 4px 16px rgba(239,68,68,0.15)
  - Auto-dismiss: after 4s, fades out upward over 250ms
  - Input shake: @keyframes shake — translateX(-8px)→(8px)→(-4px)→(4px)→0, 400ms
  - Input border: flashes #ef4444 for 500ms then transitions back to #e2e8f0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUCCESS STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
On correct password:
  - Button gradient → linear-gradient(135deg, #10b981, #059669)
  - Button text → "✓ Access Granted!"
  - Card: green glow appears — box-shadow: 0 0 60px rgba(16,185,129,0.2)
  - All confetti-like orbs briefly accelerate (animation-duration halved for 1s)
  - Card: fades out with translateY(-24px) over 400ms, then page redirects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSIVE — MOBILE (390px viewport)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  - Card: width calc(100vw - 32px), max-width 440px, position: relative (not absolute)
    centered with margin: auto, top: 50%, translateY(-50%) or flexbox centering
  - Padding: 28px 24px
  - App name font-size: 22px
  - Blob sizes: reduced by 40%
  - Particle orb count: 6 only (remove smallest orbs)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LIGHT-MODE COLOR PALETTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bg-page:           #f8faff
bg-card:           rgba(255, 255, 255, 0.72)
accent-indigo:     #6366f1
accent-violet:     #8b5cf6
accent-pink:       #ec4899
accent-green:      #10b981
accent-cyan:       #06b6d4
accent-amber:      #f59e0b
text-heading:      #1e1b4b
text-body:         #374151
text-muted:        #64748b
text-placeholder:  #cbd5e1
border-default:    #e2e8f0
border-focus:      #6366f1
state-error:       #ef4444
state-success:     #10b981
state-warning:     #f59e0b
```

---

## SCREEN 2 — Main Navigation Header (Shell / Layout)

```
Design a sticky top navigation header for a cybersecurity SPA called "WebSec-SurakshAI".

DESIGN LANGUAGE:
- Dark background with blur: rgba(11,15,25,0.85) with backdrop-filter blur(16px)
- 1px bottom border: #252e42
- Height: 64px
- Max-width container: 1200px centered with 24px horizontal padding

LEFT SIDE — Logo:
- Blue (#3b82f6) square (36×36px, border-radius 10px) with white Shield icon (20px)
- App name "WebSec-SurakshAI" in 16px, font-weight 800, letter-spacing -0.02em, color #e2e8f0
- Below name: "NFSU · Tripura Campus" in 11px monospace, color #4b5563, line-height 1

RIGHT SIDE — Desktop Navigation tabs (3 tabs in a horizontal row):
All tabs use Inter font, 14px, font-weight 600, gap 6px for icon and text.
Active tab: background rgba(59,130,246,0.2), color #3b82f6, border 1px solid rgba(59,130,246,0.3), border-radius 8px
Inactive tab: transparent background, color #94a3b8
Tab 1: ScanSearch icon + "Security Scanner"
Tab 2: Sparkles icon + "AI Scam Analyzer"
Tab 3: BarChart2 icon + "Reports"

MOBILE (show at breakpoint < 768px):
- Hide desktop tabs
- Show hamburger/X icon button (secondary style) on right
- Dropdown slide-in below header on open: background #111827, padding 12px 24px
  - Each tab as full-width row: icon + label, 10px vertical padding, no border, font-weight 600

TRANSITIONS:
- Tab switching: smooth color transition 150ms
- Mobile menu: fade + slide down 200ms
- Header: no scroll animation, stays sticky with blur

COLOR TOKENS:
- Header bg: rgba(11,15,25,0.85)
- Active tab bg: rgba(59,130,246,0.2)
- Active tab color: #3b82f6
- Border bottom: #252e42
- Muted nav text: #94a3b8
```

---

## SCREEN 3 — Security Scanner Page (Input State)

```
Design the "Security Scanner" page for a cybersecurity web app called WebSec-SurakshAI.
This is the default landing tab after login. The page has two visual zones: a hero section and a content section.

HERO SECTION (full-width, bordered bottom):
- Background: dark #0b0f19 with radial glow (blue at top-right, green at bottom-left, both very faint)
- Padding: 48px top, 40px bottom
- Max-width container 1200px

Content inside hero:
1. Pill badge (inline-flex, rounded-full): Network icon (12px blue) + text "Passive Scanner — Safe for any public URL" — dark card background, 1px border, 13px text, muted color

2. H1 heading: "Security" (white) + "Scanner" (blue #3b82f6), font-weight 900, 3rem clamped

3. Description paragraph: "Checks TLS certificates, security headers, DNS email security (SPF/DMARC), phishing databases, subdomains, and more." — 1.05rem, color #94a3b8, max-width 580px, line-height 1.7

CAPABILITY CHIPS ROW (below hero, before the form):
A horizontal flex-wrap row of 6 small pill chips, each with a tiny blue icon and label:
1. Shield icon · "TLS/SSL Certificate"
2. KeySquare icon · "Security Headers"
3. Mail icon · "SPF · DMARC · DKIM"
4. Globe2 icon · "Subdomain Recon"
5. ShieldAlert icon · "Phishing Databases"
6. FileWarning icon · "Exposed Files"
Each chip: background #1a2234, 1px border #252e42, border-radius 99px, padding 5px 12px, font-size 12px, color #4b5563, icon color #3b82f6

SCAN FORM CARD:
- Background: #1a2234 card with 1px border #252e42, border-radius 16px, padding 24px
- Title: "Run a Passive Scan" in 17px bold
- Subtitle: "Safe to run against any public URL — no intrusive requests sent." in 13.5px muted

URL Input + Button (horizontal flex row, gap 10px):
  - Input: Globe2 icon (17px blue) absolutely positioned at left 13px, center vertical
    full-width dark surface input (#111827), padding-left: 40px, placeholder "https://example.com"
    Focus: blue border + glow
  - "Scan Now" button: blue primary, ScanSearch icon + text, disabled when scanning
    During scan: Loader2 spinning + "Scanning…" text, button disabled

COLOR & LAYOUT NOTES:
- Use Inter font throughout
- Container max-width 1200px, side padding 24px
- All transitions 150-200ms ease
- Content section: padding 32px 24px
```

---

## SCREEN 4 — Security Scanner Page (Active Scan / Progress State)

```
Design the live scanning progress state for the "Security Scanner" page of WebSec-SurakshAI.

This appears BELOW the scan form card once a scan is initiated. It slides in with a fade+translateY animation.

SCAN PROGRESS CARD:
- Same card style: background #1a2234, 1px border #252e42, border-radius 16px, padding 20px
- Header row: Activity icon (18px blue) + "Scan Progress" in 17px bold font-weight 700

PROGRESS LOG LIST (vertical stack of items):
Each item is a row with:
  - Small dot (8px circle, border-radius 50%) on left:
    - Active/pending dot: solid blue #3b82f6, pulsing animation (opacity 1 → 0.3 → 1, 1.5s loop)
    - Completed dot: solid green #10b981, no animation
  - Message text in monospace font (JetBrains Mono, 13.5px):
    - Completed: color #e2e8f0 (primary)
    - Pending: color #94a3b8 (secondary)
  - On RIGHT side when completed: CheckCircle2 icon (15px, green #10b981) with margin-left auto

Example log items shown:
  ✓ "Resolving target domain..." (completed, green dot, check icon)
  ✓ "Checking TLS/SSL certificate..." (completed)
  ✓ "Analysing security headers..." (completed)
  ● "Checking phishing databases..." (in progress, pulsing blue)
  ○ "Working..." (pending, placeholder)

Rows separated by 1px dashed border (#252e42), padding 10px 0 each
Last row: no bottom border

COMPLETION STATE (scan done):
Below the log list, a row appears with 3 action buttons (gap 10px):
  - "View Full Report" — blue primary button with Eye icon
  - "JSON" — secondary button with Download icon
  - "PDF" — secondary button with FileText icon

ANIMATION:
- Entire progress card fades in from y+16px over 300ms when scan starts
- Each log item fades in sequentially as events arrive (staggered 80ms each)
- Completion buttons slide in smoothly

STYLE REFERENCE:
- bg-card: #1a2234
- success: #10b981
- accent: #3b82f6
- font-mono: JetBrains Mono
- All rows: display flex, align-items center, gap 10px
```

---

## SCREEN 5 — AI Scam Analyzer Page (Message Tab — Input State)

```
Design the "AI Scam Analyzer" page for WebSec-SurakshAI, showing the Message analysis tab in input state.

HERO SECTION:
- Same dark bg + radial glow as scanner page
- Padding 48px top 40px bottom, 1px bottom border
- Container max-width 1200px

Content:
1. Pill badge: Sparkles icon (blue) + "Powered by Google Gemini · Offline fallback available"
2. H1: "Is this " (white) + "a scam?" (blue #3b82f6), font-weight 900, 3rem clamped
3. Description: "AI-powered analysis for suspicious messages, links, and emails. Explains risks in English, Hindi, and Hinglish with clear action steps." — 1.05rem, #94a3b8, max-width 560px
4. Two inline action badges below description:
   - Orange alert badge (rgba(234,179,8,0.12) bg, #fcd34d text, orange border): "📞 Lost money? Call 1930 immediately."
   - External link badge (dark card bg): "Report at cybercrime.gov.in ↗"

ANALYZER CARD:
Main card: bg #1a2234, border #252e42, border-radius 16px, overflow hidden

CARD HEADER (border-bottom inside card):
Background #111827, padding 14px 20px
Left: "Analyse safely" title (700 weight) + subtitle "Your Gemini key stays on the server…" (12px muted)
Right: Mode switcher (3 tabs in a pill-shaped container bg #0b0f19, padding 4px, gap 4px, border-radius 10px):
  - "Message" tab with MessageSquareText icon — ACTIVE: bg #1a2234, color #3b82f6, shadow
  - "Link" tab with Link2 icon — inactive: transparent, muted color
  - "Email" tab with Mail icon — inactive: transparent, muted color
  Each tab: padding 7px 14px, border-radius 7px, 13.5px, font-weight 600, transition 150ms

CARD BODY (padding 24px):
Label: "Paste a suspicious SMS, WhatsApp message, or chat" (13px semibold, #94a3b8)
Textarea: full-width, dark surface #111827, border #2d3a52, border-radius 10px, min-height 140px, resize vertical
  Placeholder: "Paste the suspicious message here… e.g., आपका UPI account 24 hours में block हो जाएगा…"
  Focus: blue border + glow ring

Language selector row (below textarea, flex between):
  Left: "Language:" label (muted, 12px) + 4 pill buttons: Auto | English | हिंदी | Hinglish
    Active pill: rgba(59,130,246,0.15) bg, blue text
    Inactive: #111827 bg, muted text
  Right: Clipboard icon + "Paste" text link in blue

Demo examples row (below language selector):
  "Try a demo example:" label (12px muted)
  Row of 4-5 small pill buttons: "UPI Scam", "KYC Alert", "Lottery Win", "Bank Block", "Job Offer"
  Each: dark surface, 1px border, hover → blue border + blue text

SUBMIT BAR (border-top, padding-top 20px, flex between):
Left: LockKeyhole icon (green #10b981) + "Privacy-first — no inbox connection required." (12px muted)
Right: Primary blue CTA button: "Analyse message →" (padding 14px 28px, 16px font)
  Loading state: Loader2 spinning + "Analysing safely…"
```

---

## SCREEN 6 — AI Scam Analyzer Page (Link Tab — Input State)

```
Design the "Link" analysis tab variant of the AI Scam Analyzer card for WebSec-SurakshAI.
This replaces the textarea in the card body when the "Link" tab is active.

CARD BODY (same card as Message tab, padding 24px, only body contents change):

Label: "Paste a suspicious website link" (13px semibold, #94a3b8)

URL Input row (position relative):
  - Link2 icon (18px, blue #3b82f6) absolutely positioned left 14px, vertically centered
  - Full-width input, padding-left: 44px, placeholder "https://example.com/verify"
  - Dark surface background, blue border + glow on focus
  - Font: Inter, 15px

Info text below input (13px, #4b5563, line-height 1.65):
"We check URL structure, HTTPS certificate status, and phishing signals. The website is never opened."
The word "never" is in bold.

Demo URL chips (flex-wrap row, gap 8px, margin-top 12px):
5-6 small pill chips showing suspicious-looking example domains (monospace font, 12px, dark surface):
  "upi-verify-hdfc.ru", "bank0f1ndia.com", "paytm-kyc-update.xyz", "sbi-reward.tk"
Each: hover → blue border

SUBMIT BAR (identical to message tab):
Left privacy note, Right button changes text to "Inspect link →"

TAB SWITCHER STATE:
Show the "Link" tab as ACTIVE in the mode switcher (bg #1a2234, blue text)
"Message" and "Email" tabs are inactive (transparent, muted)
```

---

## SCREEN 7 — AI Scam Analyzer Page (Email Tab — Input State)

```
Design the "Email" analysis tab variant of the AI Scam Analyzer card for WebSec-SurakshAI.

CARD BODY (padding 24px, flex-column gap 16px):

1. .eml IMPORT PANEL (info box):
   Border-radius 10px, border 1px rgba(59,130,246,0.2), bg rgba(59,130,246,0.06), padding 16px
   Row (flex between, flex-wrap, gap 12px):
     Left: 
       Title: "Best evidence: original .eml file" (bold, 700) — "`.eml`" shown in code tag (monospace, dark bg pill)
       Subtitle: "Preserves From, Reply-To, Authentication-Results, DKIM signature and attachment metadata." (12px, #94a3b8, line-height 1.65)
     Right:
       Upload button (file input label): bg #1a2234, 1px border #2d3a52, border-radius 8px, padding 8px 14px
       Paperclip icon (blue) + "Import .eml" text in blue, semibold
   If file loaded: green success text below "✓ Raw .eml loaded — authentication evidence will be inspected."

2. TWO-COLUMN GRID (gap 12px):
   Left field: Label "From (optional)" + input placeholder "Name <sender@example.com>"
   Right field: Label "Subject (optional)" + input placeholder "Email subject"

3. EMAIL BODY TEXTAREA:
   Label: "Email body" + "(required unless .eml imported)" in normal weight muted
   Textarea: dark surface, min-height 120px, placeholder "Paste the email body here…"
   Below textarea row (flex between):
     Left: Paperclip icon (14px muted) + "We only inspect attachment names, MIME types, and sizes." (12px muted)
     Right: "Use email demo" link text in blue (12px, semibold)

SUBMIT BAR:
Button text: "Analyse email →"

COLOR:
- Info box blue tint: rgba(59,130,246,0.06) bg, rgba(59,130,246,0.2) border
- Success text: #10b981
- Code chip: bg #0b0f19, border-radius 4px, padding 2px 6px, monospace 13px
```

---

## SCREEN 8 — AI Analysis Result Page (SCAM Verdict)

```
Design the analysis result display for WebSec-SurakshAI's AI Scam Analyzer when a SCAM verdict is returned.

This slides in below the input card after analysis completes. It uses a 2-column grid layout.

TOP ROW (before columns):
Flex between, flex-wrap, gap 8px:
Left: "← Analyse another" button (chevron-left icon, no bg, color #94a3b8, semibold 13.5px)
Right: "WebSec-SurakshAI · AI Analysis" label (10px uppercase, letter-spacing 0.1em, muted)

LAYOUT: CSS Grid — 360px min / 1fr (left col fixed-ish, right col flexible), gap 20px
Stack to single column on mobile.

─── LEFT COLUMN ───

A. VERDICT CARD (SCAM state):
Card with:
  - 4px left accent strip (position absolute, left: 0, full height, border-radius 10px 0 0 10px): color #ef4444 (red)
  - Background: rgba(239,68,68,0.08), border rgba(239,68,68,0.25)
  - Inner content:
    Row: Red circle avatar (44×44px, bg rgba(239,68,68,0.13)) with ShieldAlert icon (22px, red #ef4444)
         + text block:
           H2: "Likely Scam Detected" (800 weight, 18px)
           Subtitle: "Proceed with extreme caution" (13.5px, #94a3b8)
    
    Mini 2-col grid (gap 10px, margin 16px 0):
      Left box (dark bg rgba(0,0,0,0.25), border-radius 8px, padding 10px 12px):
        Label: "SEVERITY" (10px uppercase, muted)
        Value: "High risk" (700 weight, red color)
      Right box (same style):
        Label: "CATEGORY"
        Value: "Phishing Link" or "UPI Fraud" etc. (700 weight, #e2e8f0)
    
    Confidence ring row (dark inner box, border-radius 10px, padding 12px 14px, flex align-center gap 12px):
      SVG ring (64×64px): gray track circle + red arc showing e.g. 92%
        Number "92%" centered inside ring (12px bold)
      Text block:
        "Confidence score" (14px 700 weight)
        "Based on available evidence — not a guarantee of sender identity." (12px muted, line-height 1.55)
    
    Footer: "Gemini AI · gemini-2.0-flash" right-aligned, 11px muted

B. HINDI SUMMARY CARD:
  Card with 3px left border orange (#f97316)
  Header: Languages icon (17px orange) + "सरल हिंदी में समझें" (bold)
  Body: Hindi text in Noto Sans Devanagari font, line-height 1.85, color #94a3b8

─── RIGHT COLUMN ───

C. "WHY THIS WAS FLAGGED" CARD:
  Header: ShieldAlert icon (blue) + "Why this was flagged" (H2, bold)
  Message preview box: bg #111827, border-radius 8px, padding 14px, 14.4px font, line-height 1.75, color #94a3b8
    Red-flag phrases highlighted: bg rgba(239,68,68,0.25), color #fca5a5, bold, border-radius 3px, small padding
  
  Red flags list (flex-column gap 8px):
  Each flag: bg #111827, border-radius 8px, padding 12px, flex gap 12px:
    AlertTriangle icon (17px red, flex-shrink 0, margin-top 2px)
    Content: phrase in bold (#e2e8f0) + explanation below (13.5px muted)

D. MANIPULATION TACTICS CARD (if present):
  Header: Cpu icon (blue) + "Manipulation tactics"
  Subtitle: "Scammers combine emotion and pressure..." (13.5px muted)
  Pill tags (flex-wrap gap 8px): each uppercase bold tag with blue tinted bg + blue border
  Example tags: "URGENCY", "FEAR", "AUTHORITY IMPERSONATION", "FALSE REWARD"

E. WHAT YOU SHOULD DO NEXT CARD:
  Border-radius 16px, border rgba(59,130,246,0.25), bg rgba(59,130,246,0.06), padding 20px
  Header: ShieldCheck icon (22px blue) + "What you should do next" (H2, 800 weight, 17.6px)
  
  Ordered list (no default list-style, flex-column gap 10px):
  Each step: bg #1a2234, border-radius 10px, padding 14px, flex gap 12px:
    Step number in circle (26×26px, bg rgba(59,130,246,0.2), color #3b82f6, 700 weight, 13px)
    Step text (14px, line-height 1.65, #94a3b8)
  
  Action buttons row (margin-top 16px, flex-wrap gap 10px):
    "Report to Cybercrime.gov.in ↗" — blue primary with ExternalLink icon
    "Copy steps" — secondary with Copy icon
```

---

## SCREEN 9 — AI Analysis Result Page (SUSPICIOUS Verdict)

```
Design the SUSPICIOUS verdict state for WebSec-SurakshAI AI Scam Analyzer result panel.

Same 2-column grid layout as SCAM verdict but with orange (#f97316) color scheme instead of red.

VERDICT CARD changes:
- Left accent strip: #f97316 (orange)
- Background: rgba(249,115,22,0.08), border rgba(249,115,22,0.25)
- Icon: AlertTriangle (22px, orange) in orange-tinted circle avatar
- Title: "Suspicious — Verify First" (same 800 weight)
- Subtitle: "Independent verification is needed"
- Severity value: "Medium risk" in orange text
- Confidence ring arc: orange color
- Ring shows ~68%

All red (#ef4444) elements become orange (#f97316).
All red-highlighted phrases in the message preview: bg rgba(249,115,22,0.2), color #fdba74.

The action steps wording is softer:
"Verify the exact registered domain through an official source before using this link."
"Do not enter passwords, OTPs, PINs, or payment details unless you independently trust the site."

Otherwise the layout, card structure, and all other elements are identical to the SCAM screen.
```

---

## SCREEN 10 — AI Analysis Result Page (SAFE Verdict)

```
Design the SAFE verdict state for WebSec-SurakshAI AI Scam Analyzer result panel.

Same 2-column grid layout but with green (#10b981) color scheme.

VERDICT CARD changes:
- Left accent strip: #10b981 (green)
- Background: rgba(16,185,129,0.08), border rgba(16,185,129,0.25)
- Icon: ShieldCheck (22px, green) in green-tinted circle
- Title: "No Obvious Scam Signals" 
- Subtitle: "Stay careful with money or personal data"
- Severity: "Low risk" in green
- Confidence ring arc: green, shows ~75%

No red-flag phrases highlighted (message preview shows plain text).

Red flags section shows:
  Gray info box: "No specific phrase was extracted. Review the verdict and verify any sensitive request independently." (13px muted)

Manipulation tactics card is hidden (no tactics detected).

Action steps are precautionary in tone.

The Hindi summary shows a positive/cautious message.
The overall page mood is calmer — green accents replace red/orange throughout.
```

---

## SCREEN 11 — Link Intelligence Result Card

```
Design the "Link intelligence" result card that appears in the right column of the AI Analysis Result page
for WebSec-SurakshAI when the "Link" mode was used.

CARD:
bg #1a2234, border #252e42, border-radius 16px, padding 20px

HEADER ROW:
Globe2 icon (19px blue) + "Link intelligence" H2 (bold)

CONTENT: flex-column gap 10px, one sub-card per URL analyzed

Each URL sub-card:
bg #111827, border 1px border #252e42, border-radius 10px, padding 14px

Top row (flex between, flex-wrap, gap 8px):
  Left: hostname in monospace font (e.g. "upi-kyc-verify.xyz"), 14px font-weight 600, word-break break-all
  Right: Risk badge — color-coded pill chip (monospace, uppercase, 11px)
    CRITICAL: red — e.g. "87/100 · CRITICAL"
    HIGH: orange — "64/100 · HIGH"
    MEDIUM: yellow — "42/100 · MEDIUM"
    LOW: green — "18/100 · LOW"

TLS row: "TLS: Invalid / Expired / Valid" — 13px muted
Summary text: 1-2 sentence description of why it's flagged, 13.5px #94a3b8, line-height 1.65

EXAMPLE DATA TO SHOW:
URL 1: "upi-verify-reward.xyz" | Score: 91/100 | CRITICAL | TLS: Self-Signed | Summary: "Domain registered 3 days ago. Multiple typosquatting signals. No HTTPS."
URL 2: "hdfc-kyc-update.tk" | Score: 78/100 | HIGH | TLS: Expired | Summary: "Free TLD commonly used for phishing. Mismatches official HDFC domain."
```

---

## SCREEN 12 — Email Authentication Evidence Card

```
Design the "Email evidence" card for WebSec-SurakshAI's email analysis result.
This appears in the LEFT COLUMN of the result layout.

CARD:
bg #1a2234, border #252e42, border-radius 16px, padding 18px

HEADER:
Mail icon (17px blue) + "Email evidence" H3 (bold)

SENDER INFO (definition list, flex-column gap 10px, 14px):
  "From" label (muted gray) + value: "SBI Customer Care <noreply@sbi-verify-kyc.ru>" (bold, word-break break-all)
  "Reply-To" label (muted gray) + value in ORANGE/HIGH color: "attacker@gmali.com" (bold, word-break break-all)
  — Reply-To mismatch is a major red flag, highlight with orange

AUTHENTICATION GRID (2×2 grid, gap 8px, margin-top 14px):
Each of 4 cells: bg #111827, border-radius 8px, padding 8px 12px
  Cell label: 11px uppercase monospace bold, muted color
  Cell value: 700 weight, 13.5px, color-coded:
    PASS → green #10b981
    FAIL → red #ef4444
    SOFTFAIL → orange #f97316
    NOT_VERIFIABLE / NOT_PRESENT → muted #4b5563

Cells:
  SPF: "FAIL" (red)
  DKIM: "NOT_PRESENT" (muted)
  DMARC: "FAIL" (red)
  ALIGNMENT: "FAILED" (red)

A "What these mean" collapsed expandable section below (optional, shows brief explanation of each protocol)
```

---

## SCREEN 13 — Reports & Dashboard Page (Scan List State)

```
Design the "Reports & Dashboard" page for WebSec-SurakshAI showing the list of completed scans.

PAGE HEADER ROW:
Flex between, flex-wrap, gap 12px, margin-bottom 24px
Left: BarChart2 icon (22px blue inline) + H1 "Reports & Dashboard" (800 weight, 24px)
Right: (no button in list state — only appears when a scan is selected)

STATS SUMMARY ROW (4 metric cards in a horizontal grid — NEW feature design):
4 cards in CSS grid (auto-fill, min 160px, gap 16px, margin-bottom 24px)
Each card: bg #1a2234, border #252e42, border-radius 12px, padding 16px 20px
  Top: small icon (18px) + label text (11px uppercase, muted)
  Bottom: large metric number (800 weight, 28px) + optional unit (14px muted)

Card 1: BarChart2 icon (blue) | "Total Scans" | Value: "24"
Card 2: ShieldAlert icon (orange) | "Avg Risk Score" | Value: "43.2" + "/100" muted
Card 3: CheckCircle2 icon (green) | "Completed" | Value: "21"
Card 4: AlertTriangle icon (red) | "Failed" | Value: "3"

SCAN LIST TABLE CARD:
Card: bg #1a2234, border #252e42, border-radius 16px, overflow hidden

TABLE INSIDE CARD (no extra border on table wrapper since card provides it):
thead: bg #111827
  Columns: Target | Type | Date | Risk Score | Grade | Action
  th style: 11px uppercase, letter-spacing 0.08em, muted color, 12px 16px padding, bottom border

tbody rows (each row):
  td: 14.5px, 12px 16px padding, bottom border dashed
  Hover: very subtle bg rgba(255,255,255,0.02)
  
  Target column: monospace font, 13.5px, e.g. "example.com", "hdfc-verify.xyz"
  Type column: badge chip "passive" or "active" — info style (muted bg/color)
  Date column: muted color, 13.5px, e.g. "Aug 5, 2026, 14:32"
  Risk Score column: bold number, color-coded:
    > 60: red #ef4444
    > 35: orange #f97316
    > 15: yellow #eab308
    ≤ 15: green #10b981
    Format: "78/100"
  Grade column: colored badge — A (green), B (green), C (yellow), D (orange), F (red)
  Action column: "View" secondary button (Eye icon, small, padding 6px 14px)

EMPTY STATE (if no scans):
Centered content inside card, padding 40px:
  ScanSearch icon (40px, opacity 0.4, margin auto)
  "No scans yet." in bold
  "Go to the Security Scanner tab to run your first scan." in muted 13.5px
  
LOADING STATE:
Centered Loader2 spinner (28px, blue, spinning animation), padding 40px

COLOR REFERENCE:
- Grade A/B badge: green (#10b981 bg-tint + border-green)
- Grade C: yellow
- Grade D/F: red/orange
- Risk text colors as above
```

---

## SCREEN 14 — Reports & Dashboard Page (Single Report Detail View)

```
Design the "Scan Report Detail" view for WebSec-SurakshAI's Reports page.
This replaces the scan list when a user clicks "View" on a scan.

PAGE HEADER ROW:
Left: same "Reports & Dashboard" heading
Right: "← All Scans" secondary small button (ChevronRight rotated 180°, sm size)

SCORE OVERVIEW CARD:
Card: bg #1a2234, border #252e42, border-radius 16px, padding 24px, margin-bottom 20px
Flex layout (align-center, gap 32px, flex-wrap)

Left: GRADE DISPLAY (text-center)
  Giant letter grade "D" or "A" etc: font-size 56px, font-weight 900, line-height 1
  Color logic: A/B → green #10b981 | C → yellow #f59e0b | D/F → red #ef4444
  Below: "Needs Improvement" or "Excellent" etc in 14px muted

Center (flex 1): RISK DETAILS
  "Risk Score: 78 / 100" in bold + "(lower is better)" in italic muted
  Severity badge row (flex-wrap gap 8px):
    "3 critical" (red badge) | "5 high" (orange) | "2 medium" (yellow) | "1 low" (green)

Right: ACTION BUTTONS (flex-wrap gap 8px)
  "JSON" secondary small button with Download icon
  "PDF" secondary small button with FileText icon
  "✦ AI Remediation" primary blue small button with Sparkles icon
    Loading state: "Generating…" + spinner

AI REMEDIATION OUTPUT PANEL (conditionally appears below score card):
Card: bg #1a2234, border rgba(59,130,246,0.3) highlighted, border-radius 16px, padding 20px, margin-bottom 20px
Header: Sparkles icon (18px blue) + "AI-Generated Remediation Plan" (H3, bold)
Body: preformatted text with white-space: pre-wrap, 13.5px, color #94a3b8, line-height 1.75, font-family Inter

FINDINGS SECTION:
H2: "Findings (8)" — 800 weight, margin-bottom 14px

FINDING CARDS (stacked, margin-bottom 12px each):
Each card: bg #1a2234, border #252e42, border-radius 16px, overflow hidden, hover: border-color #2d3a52

Finding Header (border-bottom, bg rgba(255,255,255,0.02), padding 14px 18px):
  Flex between: 
    Left: finding title in bold (e.g. "Missing Content-Security-Policy Header")
    Right: severity badge (badge-critical / badge-high / badge-medium / badge-low)

Finding Body (padding 16px 18px):
  Description paragraph (14.5px, #94a3b8, line-height 1.65)
  
  Conditional sub-sections (each with mini label + paragraph):
  - "WHAT IT MEANS:" — 11px uppercase muted label, then paragraph
  - "HOW TO FIX IT:" — same label style, then paragraph
  - "EVIDENCE:" — pre block in monospace (#7dd3fc sky-blue text on #0b0f19 bg, border, border-radius 8px, padding 14px)

POSITIVE EMPTY STATE (no findings):
Green-tinted card, padding 24px, text-center
CheckCircle2 icon (32px, green, margin auto)
"No issues found! Your site's security posture looks excellent." in bold green
```

---

## SCREEN 15 — Full Application Shell (All Tabs Visible — Overview / Wireframe View)

```
Design a product overview wireframe screenshot for WebSec-SurakshAI showing the complete application
in a single composite view, suitable for a README hero image or marketing page.

LAYOUT: A dark browser mockup frame (rounded corners, top bar with 3 traffic-light dots + address bar showing "localhost:5173")

Inside the browser, show 3 side-by-side panels at reduced scale:

PANEL 1 — Security Scanner (left):
  - Compact hero with "Security Scanner" heading
  - URL input with "Scan Now" button
  - 3 completed progress log items (green dots + checkmarks)
  - "View Full Report" button visible

PANEL 2 — AI Scam Analyzer (center, slightly larger / featured):
  - Pill badge: "Powered by Gemini"
  - "Is this a scam?" heading
  - The 3 mode tabs (Message/Link/Email)
  - A filled-in message input
  - The SCAM verdict card showing red "Likely Scam Detected", confidence ring at 92%, 
    and one highlighted red-flag phrase in the message preview

PANEL 3 — Reports (right):
  - "Reports & Dashboard" heading
  - Mini stats bar (4 metric cards)
  - 3 rows of the scan table (domain | passive | risk score | grade D badge | View button)

VISUAL TREATMENT:
- Dark bg #0b0f19 everywhere
- Each panel has a subtle scale-down with outer glow (box-shadow: 0 20px 60px rgba(0,0,0,0.7))
- Blue accent highlights: navigation tabs glow in blue, CTAs glow
- The center panel (AI Analyzer) is slightly elevated (translateY -8px) to indicate it's the featured feature
- Footer below browser mock: "WebSec-SurakshAI · Developed by Himanshu Yadav · NFSU Tripura Campus"

PURPOSE: README hero / promotional image
```

---

## SCREEN 16 — Mobile Responsive View (AI Scam Analyzer)

```
Design the mobile viewport (390px wide) version of the AI Scam Analyzer page for WebSec-SurakshAI.

HEADER (sticky, 64px, blur bg):
  Left: Shield icon + "WebSec-SurakshAI" (small, 14px bold)
  Right: Hamburger menu icon button (secondary style)

HERO SECTION (condensed):
  Padding 32px 16px
  Pill badge (smaller, 12px)
  H1: 28px clamped, "Is this a scam?" with blue accent
  Description: hidden on mobile OR shown at 14px, max 2 lines

ANALYZER CARD (full-width, margin 16px, border-radius 12px):
  Card header:
    Title + subtitle stacked
    Mode switcher BELOW title (full-width row of 3 tabs)
    Each tab: flex 1, centered icon + label

  Card body:
    Textarea: min-height 120px, full-width
    Language selector: wraps to 2 rows
    Demo chips: wraps freely

  Submit bar: stacks vertically
    Privacy note: hidden or reduced
    CTA button: full-width

RESULT (single column stack, no grid):
  All result cards stacked vertically: Verdict → Hindi Summary → Why Flagged → Tactics → Actions

BOTTOM NAVIGATION (optional):
  Fixed bottom bar with 3 icons (ScanSearch, Sparkles, BarChart2) + labels
  Active: blue tint bg and blue icon
  Height: 60px, dark surface bg, top border

FONT SIZES:
  All body text: 14-15px
  Headings: scaled down by 20%
  Badges: 10px

TOUCH TARGETS:
  All buttons minimum 44px height
  Input padding minimum 14px
```

---

## SCREEN 17 — Loading / Auth Check Splash Screen

```
Design the initial loading/auth-check state for WebSec-SurakshAI that appears while the app
checks if the user is authenticated on first load.

FULL VIEWPORT:
Background: #0b0f19 with radial blue glow (rgba(59,130,246,0.15)) centered
Display: grid, place-items center

CENTER CONTENT (stacked vertically, gap 16px):
1. Animated shield logo:
   - Square 56×56px, border-radius 16px, blue bg (#3b82f6)
   - Shield icon 30px white
   - Very subtle pulse animation (scale 1.0 → 1.04, 2s ease-in-out infinite)

2. App name: "WebSec-SurakshAI" in 20px bold, centered, #e2e8f0

3. Loading indicator: 
   - Loader2 icon (32px, blue #3b82f6), spinning animation (1s linear infinite)
   - OR: 3-dot animated pulse row (dots scale up sequentially)

4. Status text: "Checking authentication…" in 13px muted centered, font monospace

OPTIONAL DECORATIVE ELEMENTS:
- Very faint hex-grid SVG pattern over background (opacity 0.04)
- Subtle animated scan line sweeping top-to-bottom (very low opacity, 3s loop)

TRANSITION OUT:
When auth resolves, entire splash fades out (opacity 0) over 300ms before showing login or main app.
```

---

## SCREEN 18 — Toast Notification System

```
Design the toast notification components for WebSec-SurakshAI.
Position: top-right corner, stacked vertically, gap 8px, z-index 9999

All toasts share:
- bg: #1a2234 (card bg)
- border: 1px solid #252e42 (or colored border for variants)
- border-radius: 10px
- padding: 12px 16px
- min-width: 280px, max-width: 380px
- box-shadow: 0 4px 16px rgba(0,0,0,0.5)
- font: Inter 14px
- display: flex, align-items: center, gap: 10px
- Slide in from right: translateX(100%) → translateX(0) over 300ms ease
- Slide out right: translateX(0) → translateX(120%) over 250ms ease

VARIANTS:

SUCCESS toast:
  Left: CheckCircle2 icon (18px, #10b981 green)
  Text: e.g. "Pasted from clipboard." in #e2e8f0
  Border: 1px solid rgba(16,185,129,0.3)
  Left accent bar: 3px solid #10b981

ERROR toast:
  Left: AlertTriangle icon (18px, #ef4444 red)
  Text: e.g. "Incorrect password." in #e2e8f0
  Border: 1px solid rgba(239,68,68,0.3)
  Left accent bar: 3px solid #ef4444

INFO toast:
  Left: Shield icon (18px, #3b82f6 blue)
  Text: e.g. "Scan started successfully." in #e2e8f0
  Border: rgba(59,130,246,0.3)
  Left accent bar: 3px solid #3b82f6

WARNING toast:
  Left: AlertTriangle icon (18px, #f97316 orange)
  Text in #e2e8f0
  Border: rgba(249,115,22,0.3)
  Left accent bar: 3px solid #f97316

All toasts have an X close button on the right (14px, muted, hover: red)
Auto-dismiss after 4 seconds with progress bar (thin bottom border animating from full-width to 0)
```

---

## SCREEN 19 — AI Remediation Output Panel (Expanded)

```
Design the AI-Generated Remediation Plan output panel for WebSec-SurakshAI's Reports page.
This is a highlighted card that appears after clicking "AI Remediation" button.

CARD:
bg #1a2234
border: 1px solid rgba(59,130,246,0.3) — blue tinted border to distinguish from regular cards
border-radius: 16px
padding: 20px
margin-bottom: 20px
Animate in: fadeIn + translateY(-8px → 0) over 350ms

CARD HEADER ROW (flex, align-center, gap 8px, margin-bottom 12px):
  Sparkles icon (18px, animated color cycle: blue → purple → blue, 3s loop)
  "AI-Generated Remediation Plan" in H3, 700 weight
  Right side: "Copy" icon button (secondary small) to copy the text

BODY:
  Pre-formatted text block with white-space: pre-wrap
  Font: Inter (not monospace — it reads like natural language)
  Font-size: 13.5px
  Color: #94a3b8 (text-secondary)
  Line-height: 1.75
  
  Example content showing:
  "## Priority 1 — Critical (Fix Immediately)\n\n**Missing Content-Security-Policy**\nAdd the following header to your server response:\n  Content-Security-Policy: default-src 'self';\n\nThis prevents XSS attacks by restricting which sources can execute scripts..."

  If the content has markdown-style headings (## ), render them slightly larger/bolder
  If it has **bold** , render bold text
  Code snippets inline: monospace, blue sky color #7dd3fc, small background

FOOTER ROW (margin-top 14px, flex between):
  Left: "Generated by Gemini AI · gemini-2.0-flash" in 11px monospace muted
  Right: Timestamp "Generated just now" in 11px muted

LOADING STATE (while AI is generating):
  Show shimmer skeleton (3 lines of different widths) with pulse animation
  Overlay "Generating remediation plan…" in 13px muted center
```

---

## SCREEN 20 — V2 Upgrade: User Registration / Sign-Up Page

```
Design the new user registration page for WebSec-SurakshAI Version 2 (multi-user JWT system).

LAYOUT: Full-screen centered, same dark bg + radial glow as login page

CARD: max-width 460px, padding 32px, bg #1a2234, border #252e42, border-radius 20px, shadow-lg

TOP:
Shield icon badge (blue 56×56px) + "Create your account" H1 (800 weight, 26px) centered
Subtitle: "WebSec-SurakshAI · Security Platform" in 13px muted

FORM FIELDS (flex-column gap 16px):
  Row 1 (grid 2-col gap 12px):
    First Name input: label "First name", placeholder "Himanshu"
    Last Name input: label "Last name", placeholder "Yadav"
  
  Email input (full-width): label "Email address", placeholder "you@example.com"
    Mail icon inside input (left, blue)
  
  Username input: label "Username", placeholder "himanshu_nfsu"
    @ icon (left, muted)
  
  Password input: label "Password (min. 12 chars)", placeholder "••••••••••••"
    LockKeyhole icon left, Eye toggle button right (show/hide)
    Strength indicator below: thin bar that fills (red → orange → yellow → green) as password gets stronger
    Labels: "Weak" / "Fair" / "Strong" / "Very strong" in matching colors
  
  Confirm Password input: label "Confirm password"
    If mismatch: red border + "Passwords do not match" error text (12px red, margin-top 4px)

  Role selection row (optional, shown only for admin creating users):
    3 pill toggle buttons: "Analyst" | "Viewer" | "Admin"
    Active: blue tinted

  Terms checkbox: small checkbox + "I agree to the Terms of Service and Privacy Policy" (12px)

CTA BUTTON: "Create Account →" full-width, blue primary, 48px height
Below: "Already have an account? Sign in →" in 13px muted, link in blue

VALIDATION:
Email field: on blur, if invalid format show red border + "Please enter a valid email" (12px red)
Password: show ✓ checkmarks for: 12+ chars, 1 uppercase, 1 number, 1 special char
```

