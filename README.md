# SANGYAN SHIELD

### Digital Fraud & Scam Resilience Assistant
**SANGYAN Hackathon 2026 — Track A (SNTC, IIT BHU Varanasi in collaboration with SEBI and NSDL)**

> *"Before you trust it, check it."*  
> **Core Principle:** SCAN → EXPLAIN → VERIFY → PROTECT

---

## 1. Executive Summary & Vision

**SANGYAN SHIELD** is a privacy-first, evidence-first digital scam resilience assistant engineered to protect first-time and retail investors from digital financial fraud. It analyzes suspicious investment offers arriving via **WhatsApp, Telegram, Instagram, YouTube, SMS, unverified URLs, APK downloads, and phone call scripts**.

### Crucial Distinctions:
* **Evidence-First Architecture:** We do not simply tell users an offer looks suspicious; we extract the exact text snippet, map it to regulatory red flags, explain *why* it matters, verify claims against official registry databases, and prescribe a 6-step safety action plan.
* **Safety Assistant, NOT an Investment Adviser:** Sangyan Shield strictly enforces safety guardrails that detect and reject stock tipping, price predictions, buy/sell recommendations, or financial product promotion.
* **Privacy-by-Design:** Ephemeral processing by default. We never request OTPs, passwords, PINs, bank accounts, or brokerage logins.

---

## 2. Architecture & Pipeline

```text
USER INPUT (Message / Screenshot / URL / Transcript)
   │
   ▼
[Normalization & Privacy Scrubbing]
   │
   ▼
[Evidence Extraction]
   ├─ Deterministic Rule Engine (Regex matching)
   ├─ Optical Character Recognition (OCR for Screenshots)
   ├─ Safe URL Heuristic Inspector (SSRF Filtering)
   └─ Entity & Registration Extractor
   │
   ▼
[Multi-Signal Scoring & Prototype Calibration]
   ├─ Risk Score (0–100)
   └─ Calibrated Risk Bands:
        • Low Concern (0–24)
        • Needs Verification (25–49)
        • High Concern (50–74)
        • Critical Safety Warning (75–100)
   │
   ▼
[Entity Verification Layer]
   └─ SEBI Recognised Intermediary Cross-Check (with explicit Demo notices)
   │
   ▼
[Safety Guardrail & Explanation]
   └─ Strict Non-Advisory Enforcement
   │
   ▼
USER ACTION PLAN (6-Point Step-by-Step Defense Protocol)
```

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + Vite + TypeScript | High-performance, zero-latency SPA |
| **Styling & Theme** | Tailwind CSS (Tailwind 3.4) | Curated cyber-safety color palette (Midnight navy, cyan, amber, crimson) |
| **UI Motion** | Framer Motion | Smooth 6-step analysis progress transitions |
| **State Management** | Zustand | App-level session scan store & settings |
| **Icons** | Lucide React | Clean, accessible semantic iconography |
| **Charts** | Recharts | Threat intelligence prevalence and risk distribution |
| **Localization (i18n)** | i18next + react-i18next | Native multilingual support: English, हिन्दी (Hindi), తెలుగు (Telugu) |
| **Backend Framework** | FastAPI (Python 3.13) | Asynchronous, typed API services |
| **Security Filters** | RFC 1918 / SSRF Validator | URL parser rejecting loopbacks, private IPs, and punycode spoofing |
| **Unit Testing** | Python test suite | 7/7 automated security & logic regression tests |

---

## 4. Frontend Routes & Pages

* `/` — **Homepage:** Hero with cyber visual flow, 4 quick-scan portals, 5-step pipeline explanation, live demo preview, 8 scam categories, and emergency hotline.
* `/scan` — **Scan Hub:** Multi-format scanner selection.
* `/scan/text` — **Text Scanner:** Instant investment message inspection with sample loaders and multilingual toggle.
* `/scan/image` — **Screenshot Scanner:** Drag-and-drop OCR image analyzer for chat screenshots and trading apps.
* `/scan/url` — **Link Scanner:** SSRF-safe URL inspection for lookalikes, punycode spoofing, and rogue APK links.
* `/results/:id` — **Evidence-First Report:** Risk banner with uncertainty language, prototype risk gauge, exact evidence cards ("What", "Where", "Why it matters"), entity verification, and interactive safety action plan.
* `/verify` — **Entity Verification:** Search SEBI intermediary records with explicit demo simulation labels.
* `/learn` & `/learn/:slug` — **Educational Hub:** 8 detailed scam guides with interactive scenario quizzes.
* `/safety` — **Safety Action Plan:** 6-step investor defense protocol and grievance escalation directory (Helpline 1930, cybercrime.gov.in, SEBI SCORES, NSDL).
* `/demo` — **Demo Center:** 1-click test scenarios for hackathon jury evaluation.
* `/dashboard` — **Threat Dashboard:** Aggregated signal prevalence charts labeled clearly as "Demo data".
* `/about`, `/privacy`, `/security`, `/accessibility` — Compliance and governance documentation.

---

## 5. Local Setup & Execution Guide

### Prerequisites
* Node.js v18+ (tested on Node v24.18)
* Python 3.10+ (tested on Python 3.13.5)

### Step 1: Clone and Install Frontend
```bash
cd "sangyan project/frontend"
npm install
npm run build    # Validates production TypeScript bundling
npm run dev      # Starts Vite dev server on http://localhost:5173
```

### Step 2: Install Backend Dependencies & Start FastAPI
```bash
cd "sangyan project"
python -m pip install fastapi uvicorn pydantic python-multipart
python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### Step 3: Run Backend Security Tests
```bash
python backend/tests/test_risk_engine.py
```
Outputs:
```text
[PASS] Test guaranteed return passed
[PASS] Test OTP request passed
[PASS] Test urgency passed
[PASS] Test SSRF prevention passed
[PASS] Test URL brand mismatch passed
[PASS] Test non-advisory safety guardrail passed
[PASS] Test full pipeline critical warning passed
ALL BACKEND SECURITY & LOGIC TESTS PASSED SUCCESSFULLY! (7/7)
```

---

## 6. Hackathon Jury Demo Walkthrough (3-Minute Tour)

1. Open `http://localhost:5173`.
2. Click **"Demo Center"** in the top navigation (or visit `/demo`).
3. Select **Scenario 1: Guaranteed 30% Return + OTP Request** and click **"Start Demo Scenario 1"**.
4. Observe the **6-Step Framer Motion Animated Analysis**:
   - Reading content → Extracting evidence → Detecting warning signals → Checking patterns → Preparing explanation → Building report.
5. Review the **Result Page (`/results/:id`)**:
   - Risk Banner: **CRITICAL SAFETY WARNING** (with uncertainty disclaimer).
   - Calibrated Score: **88 / 100** (Prototype calibration).
   - Evidence Cards: Highlighted quotes for `GUARANTEED_RETURN`, `OTP_REQUEST`, `URGENCY`, and `REGULATORY_IMPERSONATION` with "Why It Matters" investor impact analysis.
   - Interactive Checklist: Check off safety actions (Stop payment, Do not share OTP).
6. Switch the language selector in the top bar to **తెలుగు (Telugu)** or **हिन्दी (Hindi)**:
   - Notice that the safety explanations adapt to the selected regional language while **the original evidence remains verbatim in its authentic form**.
7. Navigate to **"Verify"** to test a SEBI-registered broker match versus an unregistered club.
8. Navigate to **"Learn"** and take an interactive safety scenario quiz.

---

## 7. Security & SSRF Defense Architecture

When users submit links, attackers may attempt Server-Side Request Forgery (SSRF) against internal services:
1. **Host Rejection:** Immediate rejection of `localhost`, `127.0.0.1`, `0.0.0.0`, and `::1`.
2. **Private Network Filtering:** All RFC 1918 IPv4 ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) and cloud metadata (`169.254.0.0/16`) are blocked.
3. **Scheme Whitelist:** Only `http` and `https` schemes permitted.
4. **HTTPS Fallacy Guard:** The UI highlights that HTTPS certificates are free and trivial for scammers to obtain; HTTPS alone never certifies safety.

---

## 8. Emergency Reporting Contacts
* **National Cyber Crime Helpline:** Dial **1930**
* **National Cyber Crime Reporting Portal:** [cybercrime.gov.in](https://cybercrime.gov.in)
* **SEBI SCORES Grievance Redressal:** [scores.sebi.gov.in](https://scores.sebi.gov.in)
* **NSDL Investor Grievance Cell:** [nsdl.co.in](https://nsdl.co.in)
