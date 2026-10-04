# SANGYAN Hackathon 2026 — Track A
# Digital Fraud & Scam Resilience
## Build-Ready Product, Technical, AI/ML, Safety and 4-Day Execution Documentation

**Hackathon:** SANGYAN — SNTC, IIT (BHU) Varanasi in collaboration with SEBI and NSDL  
**Selected Track:** Track A — Digital Fraud & Scam Resilience  
**Working Product Name:** Sangyan Shield  
**Mode:** Online | 4 days | Team size 1–4  
**Primary objective:** Help retail investors identify suspicious investment-related messages, links, screenshots and offers, understand *why* they are risky, verify claims through trusted sources, and take safer next steps.

> **Important:** This is a hackathon product specification. It must not provide stock tips, buy/sell/hold recommendations, price predictions, or promote investment products. The system is a safety and verification assistant.

---

# 1. Executive Summary

## 1.1 Product vision

**Sangyan Shield** is a privacy-first investor safety assistant designed for first-time and retail investors, especially users who encounter investment offers through WhatsApp, Telegram, Instagram, YouTube, SMS, email, phone calls, websites and social media.

A user can:

1. Paste a message or offer.
2. Upload a screenshot.
3. Submit a suspicious URL.
4. Paste a social-media post or investment advertisement.
5. Optionally provide a transcript of a suspicious call/voice note.

The system extracts evidence and evaluates multiple scam indicators, such as:

- guaranteed or unusually attractive returns;
- urgency and pressure to pay immediately;
- requests to move the conversation to private channels;
- requests for OTP, PIN, passwords or sensitive credentials;
- suspicious payment instructions;
- impersonation or unverifiable claims of regulation;
- suspicious domains/URLs;
- fake trading-app patterns;
- requests to install unknown applications;
- inconsistent company/intermediary details;
- social-proof manipulation;
- referral/recruitment pressure;
- misleading claims about regulatory approval.

The result is an **explainable safety assessment**, not a financial recommendation.

Example:

> **Risk assessment: High concern**
>
> **Why:** The message promises guaranteed returns, creates urgency, asks the user to transfer money to a personal account, and claims to be SEBI-approved without a verifiable registration match.
>
> **Recommended action:** Do not transfer money or share OTP/password/PIN. Verify the entity using official SEBI resources. If money has already been lost, preserve evidence and follow the appropriate official reporting/grievance route.

---

# 2. Problem Statement

Retail investors increasingly encounter investment-related content through digital channels. The problem is not only that scams exist; it is that a user may have difficulty determining:

- whether a message is suspicious;
- which parts of the message are red flags;
- whether a person/company/intermediary claim can be verified;
- whether a link or app should be trusted;
- what information should never be shared;
- what to do after a suspected scam;
- where to go for legitimate grievance redressal.

SEBI's investor resources explicitly cover investment fraud, guaranteed-return schemes, pressure tactics, unsolicited offers, checking whether schemes are regulated, fake trading apps, social-media scams, OTP scams and deepfake-related awareness. The product should therefore focus on **evidence-based prevention and safer action**, not investment selection.

---

# 3. Why Track A Fits

The product directly addresses Track A by creating a prevention layer between a suspicious digital interaction and an investor's action.

### Before harm
- Scan the message/link/screenshot.
- Explain red flags.
- Verify relevant entities.
- Give a safe checklist.

### During suspected fraud
- Tell the user what not to share/pay.
- Preserve evidence.
- Identify the appropriate official route.

### After suspected fraud
- Provide an evidence checklist.
- Provide official grievance/reporting pathways.
- Avoid pretending to investigate or recover money.

---

# 4. Target Users

## Primary users

### Persona 1 — First-time investor
A young user receives a WhatsApp message claiming that a "professional trading team" can double money quickly.

Need:
- simple explanation;
- red-flag detection;
- no financial jargon.

### Persona 2 — Tier-2/Tier-3 regional-language user
A user receives an investment message in Hindi/Telugu/Hinglish.

Need:
- regional-language input/output;
- voice-friendly interaction;
- simple explanations.

### Persona 3 — Family member helping an elderly investor
A family member receives a screenshot of a suspicious trading-app conversation.

Need:
- screenshot OCR;
- clear evidence;
- step-by-step safe action.

### Persona 4 — Social-media user
A user sees an influencer/celebrity video claiming a guaranteed investment opportunity.

Need:
- content analysis;
- impersonation/deepfake warning signals;
- official-source verification.

---

# 5. Core Product Scope

## 5.1 MVP

The 4-day prototype should contain these features:

### A. Scam Scan
Inputs:
- text;
- screenshot;
- URL.

Output:
- risk category;
- confidence/uncertainty;
- red flags;
- extracted entities;
- evidence snippets;
- safe next steps.

### B. Explainability
Every warning must answer:

**What did we detect?**  
**Where did we detect it?**  
**Why does it matter?**

Example:

> "Guaranteed 30% monthly return"  
> Detected signal: guaranteed-return promise  
> Reason: guaranteed/high-return promises are a known investment-fraud warning sign.

### C. Entity Verification
Extract:
- company name;
- intermediary name;
- registration number;
- website/domain;
- phone/email if voluntarily provided.

Where feasible, compare against official public SEBI registration information.

### D. Link Safety
Analyze:
- HTTPS;
- domain;
- suspicious URL patterns;
- brand impersonation patterns;
- shortened URLs;
- look-alike domains;
- redirect chains where technically feasible.

Do **not** claim a URL is safe merely because it uses HTTPS.

### E. Safe Action Plan
Give actions such as:
- stop payment;
- do not share OTP/PIN/password;
- do not install unknown apps;
- independently verify the entity;
- preserve screenshots/payment details/messages;
- use official grievance/reporting channels where appropriate.

### F. Multilingual Explanation
MVP languages:
- English;
- Hindi;
- Telugu.

Architecture should allow additional Indian languages.

### G. Safety Education
Short interactive examples:
- guaranteed-return scam;
- fake trading app;
- impersonation;
- OTP/credential theft;
- social-media investment scam.

---

# 6. Out of Scope for MVP

Do not attempt these during the 4-day build:

- stock-price prediction;
- stock recommendations;
- buy/sell/hold suggestions;
- automated money recovery;
- bank-account access;
- SMS scraping;
- OTP collection;
- personal financial-account aggregation;
- autonomous reporting to authorities;
- definitive legal conclusions;
- facial/deepfake forensic certification;
- large proprietary model training from scratch.

These increase risk and reduce feasibility.

---

# 7. Differentiating Product Concept

A generic chatbot is not enough.

The differentiator is an **evidence-first scam analysis pipeline**:

```text
USER INPUT
   |
   +-- Text
   +-- Screenshot
   +-- URL
   +-- Optional transcript
   |
   v
NORMALIZATION
   |
   v
EVIDENCE EXTRACTION
   |
   +-- OCR
   +-- URL parsing
   +-- Entity extraction
   +-- Scam-language detection
   +-- Payment/credential request detection
   |
   v
MULTI-SIGNAL SCORING
   |
   +-- Rules
   +-- NLP classifier
   +-- URL heuristics
   +-- Entity verification
   |
   v
EXPLANATION ENGINE
   |
   v
SAFETY GUARDRAIL
   |
   v
USER RESULT
   |
   +-- Risk band
   +-- Evidence
   +-- Why it matters
   +-- Verification
   +-- Safe next steps
```

The LLM should **not** be the final authority. It can summarize and explain structured evidence, while deterministic rules and verified data provide the safety backbone.

---

# 8. Risk Model

Use categories instead of pretending that the system can know whether something is fraudulent with certainty.

### Suggested output

- **Low concern**
- **Needs verification**
- **High concern**
- **Critical safety warning**

Avoid language such as "100% scam" unless the system has a genuinely authoritative basis.

## 8.1 Example signal groups

| Signal | Example | Weight concept |
|---|---|---|
| Guaranteed return | "Guaranteed 20% every month" | High |
| Urgency | "Pay within 10 minutes" | High |
| Credential request | "Send OTP/PIN" | Critical |
| Personal payment | "Pay to my personal UPI" | High |
| Regulatory impersonation | "SEBI certified" without verifiable evidence | High |
| Unverified entity | Registration claim cannot be matched | High |
| Unknown app | Install APK from chat | High |
| Suspicious domain | Look-alike domain | High |
| Referral pressure | "Bring 5 people to unlock withdrawal" | Medium/High |
| Social proof | "10,000 investors already joined" | Medium |
| Emotional pressure | Fear/FOMO/threat | Medium |

Weights should be configurable and tested against a labeled validation set.

---

# 9. Explainable Scoring

Do not expose a fake mathematical certainty.

Internally, the prototype can calculate:

```text
risk_score =
  rule_score
  + model_score
  + url_score
  + verification_score
```

Then apply thresholds to produce a risk band.

Example:

```text
0–24   LOW CONCERN
25–49  NEEDS VERIFICATION
50–74  HIGH CONCERN
75–100 CRITICAL SAFETY WARNING
```

These numbers are **prototype calibration values**, not regulatory standards. They must be tuned using validation data.

Every score must be accompanied by evidence.

---

# 10. AI/ML Architecture

## 10.1 Layer 1 — OCR

For screenshots:

- Tesseract OCR or PaddleOCR.
- Extract text.
- Preserve bounding boxes where possible.
- Detect language.

Output:

```json
{
  "text": "...",
  "language": "en",
  "entities": [],
  "urls": []
}
```

## 10.2 Layer 2 — NLP signal extraction

Detect:

- guaranteed-return language;
- urgency;
- threats;
- payment requests;
- credential requests;
- impersonation;
- investment solicitation;
- withdrawal-fee claims;
- recruitment/referral pressure.

Approaches:

### MVP
Rule-based keyword/pattern detection + lightweight NLP.

### Better
Sentence-transformer embeddings + classifier.

### Optional
Small transformer classifier fine-tuned on scam/non-scam examples.

---

# 11. LLM Role

Use an LLM only for:

- translating;
- simplifying explanations;
- summarizing detected evidence;
- converting structured findings into user-friendly language.

Do not let the LLM independently decide:

- whether an entity is SEBI registered;
- whether money should be invested;
- whether an investment is profitable;
- whether a person is legally fraudulent.

The LLM receives structured evidence:

```json
{
  "risk_band": "HIGH_CONCERN",
  "signals": [
    {
      "type": "GUARANTEED_RETURN",
      "evidence": "Guaranteed 30% return"
    },
    {
      "type": "URGENCY",
      "evidence": "Pay within 15 minutes"
    }
  ],
  "verification": {
    "entity_match": false
  }
}
```

Then it explains the result without changing the structured assessment.

---

# 12. Entity Verification

SEBI provides an official recognised-intermediary search covering categories such as stock brokers, investment advisers and depository participants.

Prototype workflow:

```text
Extract entity
      |
      v
Normalize name
      |
      v
Extract registration number
      |
      v
Query/compare official source
      |
      +-- Match found
      |
      +-- No match
      |
      +-- Ambiguous
      |
      v
Show verification status
```

Output:

### Verified match
"An entity with this name/registration number was found in the official source. This does not by itself prove that the message or payment request is genuine."

### No match
"No matching registration was found in the checked official source. Treat the claim as unverified and independently confirm using the official website."

### Ambiguous
"Multiple/partial matches found. Do not rely on the name alone."

Never equate "registered entity" with "this particular message is legitimate."

---

# 13. URL Analysis

## Signals

1. Domain age if a reliable lookup is available.
2. HTTPS.
3. IP-address URL.
4. Punycode/look-alike characters.
5. Suspicious subdomains.
6. URL shorteners.
7. Excessive redirects.
8. Brand-name mismatch.
9. Downloadable APK.
10. Credential/payment collection page.

### Example

```text
https://secure-sebi-investment.example.com/login
```

Possible signals:
- contains a regulator-like term;
- actual registrable domain is not the official SEBI domain;
- login/payment request.

The UI should say:

> "The URL uses a SEBI-related term, but the actual domain does not match the official SEBI domain. Verify independently."

Do not say:

> "This URL is definitely malicious."

unless authoritative threat-intelligence evidence supports that conclusion.

---

# 14. Screenshot Analysis

User uploads:

```text
WhatsApp screenshot
Instagram post
Telegram message
Trading app screenshot
Website screenshot
```

Pipeline:

```text
Image
  |
  v
OCR
  |
  v
Text cleaning
  |
  v
Entity/URL extraction
  |
  v
Scam signal detection
  |
  v
Evidence highlighting
  |
  v
Risk assessment
```

UX feature:

Highlight the exact sentence that triggered each warning.

---

# 15. Voice Interface

Optional MVP enhancement.

```text
Voice note
   |
Speech-to-text
   |
Language detection
   |
Scam signal extraction
   |
Risk analysis
   |
Regional-language explanation
```

Use voice primarily for accessibility and regional-language usability.

Do not store recordings by default.

---

# 16. Multilingual Design

Initial languages:

- English
- Hindi
- Telugu

Architecture:

```text
Input
 |
Language Detector
 |
Canonical Analysis Language
 |
Structured Safety Result
 |
Translation Layer
 |
User Language
```

Important:

Never translate the underlying evidence in a way that changes meaning.

Show the original evidence alongside the translated explanation when practical.

---

# 17. User Journey

## Journey 1 — Suspicious WhatsApp message

```text
Home
 ↓
"Check a suspicious message"
 ↓
Paste message
 ↓
Scan
 ↓
Risk: High concern
 ↓
Red flags:
  - Guaranteed return
  - Urgent payment
  - Personal UPI
 ↓
"Do not pay or share OTP"
 ↓
"Verify entity"
 ↓
Official verification
 ↓
Safety checklist
```

## Journey 2 — Screenshot

```text
Home
 ↓
Upload screenshot
 ↓
OCR
 ↓
Evidence detected
 ↓
Risk result
 ↓
Highlighted evidence
 ↓
Safe actions
```

## Journey 3 — Suspicious website

```text
Paste URL
 ↓
Analyze domain
 ↓
Extract brand/entity
 ↓
Check official-source match
 ↓
Show verification + URL warnings
```

---

# 18. Recommended Technology Stack

## Frontend

**Next.js + TypeScript + Tailwind CSS**

Why:
- fast prototype development;
- responsive web UI;
- easy deployment;
- strong TypeScript support.

## Backend

**FastAPI + Python**

Why:
- natural fit for NLP/ML;
- clean API design;
- easy model integration.

## Database

**PostgreSQL / Supabase**

Store only necessary application data.

## AI/ML

- Python
- scikit-learn
- sentence-transformers
- transformers
- OCR
- optional LLM API
- optional speech-to-text

## Deployment

- Vercel for frontend
- Render/Railway/AWS for FastAPI
- Supabase for database

The exact deployment provider can be changed without changing the architecture.

---

# 19. High-Level Architecture

```text
                         ┌───────────────────────┐
                         │       USER            │
                         │ Text / Image / URL    │
                         └───────────┬───────────┘
                                     |
                                     v
                         ┌───────────────────────┐
                         │   NEXT.JS FRONTEND    │
                         └───────────┬───────────┘
                                     |
                                     v
                         ┌───────────────────────┐
                         │      FASTAPI API      │
                         └───────────┬───────────┘
                                     |
                 ┌───────────────────┼───────────────────┐
                 |                   |                   |
                 v                   v                   v
          ┌────────────┐      ┌────────────┐      ┌────────────┐
          │ OCR Engine │      │ NLP/Rules  │      │ URL Engine │
          └─────┬──────┘      └─────┬──────┘      └─────┬──────┘
                |                   |                   |
                └───────────────────┼───────────────────┘
                                    v
                         ┌───────────────────────┐
                         │ EVIDENCE AGGREGATOR   │
                         └───────────┬───────────┘
                                     |
                         ┌───────────┴───────────┐
                         |                       |
                         v                       v
                ┌────────────────┐      ┌──────────────────┐
                │ Official Source │      │ Risk Engine      │
                │ Verification   │      │ Rules + ML       │
                └───────┬────────┘      └────────┬─────────┘
                        |                        |
                        └────────────┬───────────┘
                                     v
                         ┌───────────────────────┐
                         │ SAFETY GUARDRAIL      │
                         │ No investment advice  │
                         └───────────┬───────────┘
                                     |
                                     v
                         ┌───────────────────────┐
                         │ EXPLANATION ENGINE    │
                         └───────────┬───────────┘
                                     |
                                     v
                         ┌───────────────────────┐
                         │ USER RESULT           │
                         │ Evidence + Actions    │
                         └───────────────────────┘
```

---

# 20. Backend API Design

## POST /api/scan/text

Request:

```json
{
  "text": "Guaranteed 30% monthly return..."
}
```

Response:

```json
{
  "risk_band": "HIGH_CONCERN",
  "risk_score": 78,
  "signals": [
    {
      "type": "GUARANTEED_RETURN",
      "severity": "HIGH",
      "evidence": "Guaranteed 30% monthly return"
    },
    {
      "type": "URGENCY",
      "severity": "HIGH",
      "evidence": "Pay today"
    }
  ],
  "entities": [],
  "verification": [],
  "safe_actions": [
    "Do not transfer money",
    "Do not share OTP/PIN/password",
    "Verify the entity independently"
  ]
}
```

## POST /api/scan/image

Multipart upload.

Returns OCR + analysis.

## POST /api/scan/url

```json
{
  "url": "https://example.com"
}
```

Returns URL findings.

## POST /api/verify/entity

```json
{
  "name": "Example Securities",
  "registration_number": "INZ..."
}
```

Returns:
- match;
- no match;
- ambiguous.

---

# 21. Database Schema

## scans

```text
id
session_id
input_type
language
risk_band
risk_score
created_at
```

## signals

```text
id
scan_id
signal_type
severity
evidence_text
confidence
```

## entities

```text
id
scan_id
entity_type
entity_name
registration_number
verification_status
source
```

## feedback

```text
id
scan_id
feedback_type
created_at
```

Avoid storing raw financial messages unless the user explicitly chooses to save them.

---

# 22. Privacy-by-Design

## Default

- Process data ephemerally where possible.
- Do not collect bank credentials.
- Do not collect OTPs.
- Do not request SMS access.
- Do not request contacts.
- Do not request brokerage login credentials.
- Do not store screenshots permanently by default.
- Do not store voice recordings by default.

## If analytics are required

Collect only:
- anonymous event;
- feature used;
- timestamp;
- coarse technical metadata.

Never use user financial content for training without explicit authorization and appropriate governance.

---

# 23. Security Requirements

Follow the uploaded development guide's principle of treating security as part of development rather than a final step. fileciteturn0file0L1005-L1047

### Required

- Validate all input.
- Limit upload size.
- Validate file types.
- Sanitize extracted text.
- Protect API keys.
- Use environment variables.
- Rate-limit scan endpoints.
- Prevent SSRF when fetching URLs.
- Restrict backend network access.
- Do not execute uploaded files.
- Never expose internal prompts/secrets.
- Log security events without storing sensitive content.

---

# 24. SSRF Protection for URL Scanner

This is important.

If your backend fetches submitted URLs, attackers could attempt to access internal infrastructure.

The URL scanner must:

- reject localhost;
- reject private IP ranges;
- reject loopback;
- reject link-local addresses;
- restrict protocols to HTTP/HTTPS;
- limit redirects;
- set request timeouts;
- cap response size;
- avoid arbitrary file protocols;
- re-check destination after redirects.

For the 4-day prototype, an even safer approach is to analyze the URL string without server-side fetching unless the team has implemented SSRF protections.

---

# 25. Dataset Strategy

Do not claim a high-performing ML model without validation.

## Data sources

Build a labeled dataset from:

- official scam-awareness examples;
- synthetic examples based on known scam patterns;
- public cybersecurity/phishing datasets where licensing permits;
- manually authored benign investment communications;
- manually authored scam-like examples.

Labels:

```text
BENIGN
SUSPICIOUS
SCAM_LIKE
```

Signal labels:

```text
GUARANTEED_RETURN
URGENCY
OTP_REQUEST
PAYMENT_REQUEST
IMPERSONATION
FAKE_REGISTRATION
FAKE_APP
SUSPICIOUS_URL
REFERRAL_PRESSURE
WITHDRAWAL_FEE
SOCIAL_PROOF
```

## Data split

```text
70% train
15% validation
15% test
```

Avoid duplicate or near-duplicate examples across splits.

---

# 26. Model Evaluation

Report:

- precision;
- recall;
- F1;
- confusion matrix;
- false-positive rate;
- false-negative rate.

For a safety product, do not optimize only for overall accuracy.

A false negative can be important because the system may fail to warn a user about a suspicious interaction.

However, false positives also matter because excessive warnings reduce trust.

Therefore show the jury:

```text
Model performance
+
Rule performance
+
Human-readable evidence
+
Known limitations
```

---

# 27. Guardrail Layer

Before displaying the answer, run a policy check.

Reject or rewrite outputs that contain:

- buy recommendation;
- sell recommendation;
- hold recommendation;
- target price;
- price prediction;
- profit promise;
- personalized investment advice;
- promotion of a financial product.

Replace with:

> "This tool does not provide investment recommendations. It only analyzes potential scam and safety signals."

---

# 28. False Positive / False Negative Handling

The UI should include:

> **This is a risk assessment, not a legal determination.**

And:

> **No automated check can guarantee that a message, person or website is genuine. Verify important claims through official sources.**

This is especially important for:
- newly created legitimate entities;
- name collisions;
- spoofed accounts;
- legitimate entities impersonated by scammers.

---

# 29. Explainability UI

Result page:

```text
┌──────────────────────────────────────────┐
│        HIGH CONCERN                      │
│        Safety assessment                 │
├──────────────────────────────────────────┤
│ Why?                                     │
│                                          │
│ ⚠ Guaranteed return promise              │
│   "30% guaranteed every month"           │
│                                          │
│ ⚠ Urgent payment request                 │
│   "Pay within 10 minutes"                │
│                                          │
│ ⚠ Personal payment account               │
│   "Send to this UPI ID"                  │
│                                          │
│ ⚠ Entity could not be verified           │
│                                          │
├──────────────────────────────────────────┤
│ What should you do?                      │
│                                          │
│ 1. Do not transfer money.                │
│ 2. Do not share OTP/PIN/password.       │
│ 3. Verify the entity independently.     │
│ 4. Preserve the evidence.               │
│ 5. Use official reporting channels.     │
└──────────────────────────────────────────┘
```

---

# 30. Bharat-First UX

Use:

- large buttons;
- minimal text;
- icons + words;
- voice input;
- language selector;
- low-bandwidth mode;
- progressive loading;
- no unnecessary animations on analysis screens;
- readable fonts;
- high contrast;
- accessibility labels.

### Language selector

```text
English
हिन्दी
తెలుగు
```

The explanation should use simple language.

Example:

Instead of:

> "This communication exhibits multiple high-risk social-engineering indicators."

Say:

> "This message uses pressure and a guaranteed-return promise. These are warning signs."

---

# 31. Offline / Low-Bandwidth Mode

Where possible:

- perform local text rules;
- compress images before upload;
- avoid unnecessary background requests;
- cache educational content;
- show a lightweight result first;
- progressively load advanced verification.

---

# 32. Accessibility

Support:

- keyboard navigation;
- screen-reader labels;
- sufficient contrast;
- text scaling;
- captions;
- voice interaction;
- no color-only risk indicators.

Use:

```text
High concern — not just red
Needs verification — not just yellow
Low concern — not just green
```

---

# 33. Educational Module

Include a "Learn to Spot Scams" section.

Cards:

1. Guaranteed returns
2. Fake trading apps
3. Social-media investment scams
4. OTP/credential scams
5. Impersonation
6. Deepfake investment content
7. Withdrawal-fee scams
8. Pressure tactics

Each card:

```text
What it looks like
↓
Why it is risky
↓
What to check
↓
What not to do
```

SEBI's current investor education resources already include awareness material on fake apps, social-media scams, OTP scams and deepfakes, so official educational references should be linked rather than replaced with invented regulatory advice.

---

# 34. Official Grievance / Help Integration

If a user says they have already suffered a securities-market grievance, show the official route.

SEBI's SCORES platform allows complaints concerning the securities market against listed companies, SEBI-registered intermediaries and market infrastructure institutions. The current SCORES system also provides complaint tracking and review mechanisms.

The application should link users to official sources rather than impersonating those systems.

Important UX:

```text
Already lost money?
        |
        v
Preserve evidence
        |
        v
Contact appropriate bank/payment provider
        |
        v
Use appropriate official cybercrime/regulatory
reporting route
        |
        v
For securities-market grievances,
see official SEBI/SCORES guidance
```

Do not automatically submit complaints in the MVP.

---

# 35. Prototype Screens

## Screen 1 — Home

- Scan suspicious message
- Check screenshot
- Check link
- Learn about scams
- Get help

## Screen 2 — Scan

Tabs:

```text
Message | Screenshot | Link
```

## Screen 3 — Processing

Show:

```text
Reading content
Extracting evidence
Checking scam signals
Preparing safety explanation
```

Do not expose chain-of-thought.

## Screen 4 — Result

- risk band;
- evidence;
- verification;
- safe actions.

## Screen 5 — Entity Verification

- entity;
- claimed registration;
- official source result;
- limitations.

## Screen 6 — Learn

Scam education.

## Screen 7 — Help

Official links and emergency/reporting guidance.

---

# 36. Suggested Project Structure

Use the uploaded vibe-coding guide's documentation-first workflow: PRD, architecture, design, rules, tasks, testing, security, decisions and project memory. fileciteturn0file0L397-L461

```text
sangyan-shield/
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   ├── AI_ML.md
│   ├── DATASET.md
│   ├── SECURITY.md
│   ├── PRIVACY.md
│   ├── TEST_PLAN.md
│   ├── API.md
│   ├── DECISIONS.md
│   └── MEMORY.md
│
├── .cursor/
│   └── rules/
│       ├── general.mdc
│       ├── frontend.mdc
│       ├── backend.mdc
│       ├── ai-safety.mdc
│       ├── security.mdc
│       └── testing.mdc
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── services/
│   ├── lib/
│   └── types/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── ml/
│   │   ├── rules/
│   │   └── safety/
│   └── tests/
│
├── ml/
│   ├── data/
│   ├── notebooks/
│   ├── training/
│   ├── evaluation/
│   └── models/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/
├── README.md
├── TASKS.md
├── .env.example
└── .gitignore
```

---

# 37. Documentation-First Development

Before coding, create:

1. PRD.md
2. ARCHITECTURE.md
3. DESIGN.md
4. AI_ML.md
5. SECURITY.md
6. PRIVACY.md
7. TEST_PLAN.md
8. API.md
9. TASKS.md
10. MEMORY.md

The uploaded guide specifically recommends giving the AI project context before coding and asking it to understand the PRD, architecture, design, rules and tasks before making changes. fileciteturn0file0L1077-L1119

---

# 38. AI IDE Rules

Put these rules in `.cursor/rules/ai-safety.mdc`.

```text
# SANGYAN SAFETY RULES

1. This application is an investor safety and scam-resilience tool.
2. Never provide buy/sell/hold recommendations.
3. Never predict stock prices or investment returns.
4. Never claim that a user should invest in a product.
5. Never treat an LLM response as authoritative evidence.
6. All high-risk findings must cite structured evidence.
7. Separate observed evidence from model interpretation.
8. Never claim "100% scam" without authoritative evidence.
9. Explain uncertainty.
10. Do not collect OTPs, passwords, PINs or brokerage credentials.
11. Do not request SMS access.
12. Do not store uploaded content by default.
13. Use official sources for regulatory verification.
14. Registration of an entity does not prove a specific message is genuine.
15. Do not invent SEBI/NSDL rules or registration details.
16. Validate all user input.
17. Protect API keys using environment variables.
18. Do not execute uploaded files.
19. Apply SSRF protections to URL analysis.
20. Every feature must have tests.
21. Follow the existing architecture.
22. Do not create duplicate services.
23. Do not modify unrelated files.
24. Preserve multilingual evidence meaning.
25. Use accessible UI.
26. Risk labels must not depend only on color.
27. Provide safe next steps after a high-risk result.
28. Link to official sources for authoritative actions.
29. Never automatically submit complaints without explicit user action.
30. Keep safety-critical logic deterministic where possible.
```

---

# 39. Development Workflow

Follow:

```text
READ
 ↓
UNDERSTAND
 ↓
PLAN
 ↓
IMPLEMENT
 ↓
TEST
 ↓
REVIEW
 ↓
FIX
 ↓
COMMIT
 ↓
UPDATE DOCUMENTATION
```

For each feature:

```text
TASK-001
 ↓
Implement
 ↓
Test
 ↓
Review
 ↓
Commit
 ↓
TASK-002
```

This mirrors the documentation-first, small-task development approach in the provided guide. fileciteturn0file0L2205-L2243

---

# 40. 4-Day Hackathon Execution Plan

## DAY 1 — Problem + Foundation

### Morning
- Finalize user persona.
- Finalize MVP.
- Create repository.
- Create documentation.
- Create architecture.
- Create UI wireframes.

### Afternoon
- Build frontend shell.
- Build FastAPI backend.
- Create scan endpoint.
- Create basic rule engine.

### Evening
- Implement:
  - text scan;
  - risk signals;
  - result page.

### Day 1 target

A user can paste a suspicious message and receive a basic explainable result.

---

# 41. DAY 2 — AI + Screenshot + Verification

### Morning
- OCR.
- Screenshot upload.
- Entity extraction.
- URL extraction.

### Afternoon
- Rule engine.
- NLP classifier.
- Entity verification.
- URL heuristics.

### Evening
- Evidence highlighting.
- Risk aggregation.
- API integration.

### Day 2 target

Message + screenshot + URL analysis works end-to-end.

---

# 42. DAY 3 — Bharat + Safety + Polish

### Morning
- Hindi.
- Telugu.
- Voice input if stable.

### Afternoon
- Accessibility.
- Low-bandwidth UI.
- Safety guardrails.
- Privacy controls.
- Educational module.

### Evening
- E2E tests.
- Security testing.
- False-positive testing.
- Failure handling.

### Day 3 target

A polished, safe, multilingual prototype.

---

# 43. DAY 4 — Demo + Validation + Submission

### Morning
- Fix bugs.
- Deploy.
- Test live environment.
- Prepare sample cases.

### Afternoon
- Record 3–5 minute demo.
- Prepare architecture diagram.
- Prepare impact slide.
- Prepare limitations slide.

### Evening
- Final submission.
- Final README.
- Backup demo.
- Test every demo flow.

---

# 44. Demo Scenario

Use one compelling scenario.

### Opening

> "Imagine a first-time investor receives this WhatsApp message."

Show:

> "SEBI-approved expert group. Guaranteed 30% monthly returns. Pay ₹25,000 today to unlock premium trading signals."

User pastes it into Sangyan Shield.

### Detection

System identifies:

- guaranteed return;
- urgency;
- regulatory claim;
- payment request.

### Verification

The claimed entity cannot be matched to the relevant official registration source.

### Result

```text
HIGH CONCERN
```

Then show exactly why.

### Safety action

```text
DO NOT:
- transfer money
- share OTP
- share PIN/password
- install unknown apps

DO:
- verify independently
- preserve evidence
- use official reporting/grievance channels
```

This is much stronger than simply displaying a red "SCAM" badge.

---

# 45. Second Demo Scenario

Upload a screenshot of a fake trading-app promotion.

Show:

```text
OCR
 ↓
"Guaranteed profit"
 ↓
"Install APK"
 ↓
"Pay activation fee"
 ↓
Multiple risk signals
 ↓
HIGH CONCERN
```

Then show the evidence highlight.

---

# 46. Third Demo Scenario — Benign Message

Use a normal, non-scam educational message.

The system should not flag everything.

Result:

```text
LOW CONCERN

No major scam indicators detected.

This does not prove the message is genuine.
Verify important claims independently.
```

This demonstrates that the system is not merely a fear generator.

---

# 47. Testing Matrix

| Test | Expected |
|---|---|
| Guaranteed return | High signal |
| OTP request | Critical signal |
| Urgency | High signal |
| Unknown APK | High signal |
| Normal educational message | Low/needs verification |
| Screenshot | OCR + analysis |
| Telugu text | Correct language handling |
| Hindi text | Correct language handling |
| Invalid URL | Validation error |
| Oversized image | Rejected |
| Empty text | Validation error |
| Fake registration | Unverified |
| Valid entity | Match shown with limitation |
| LLM unavailable | Rule engine still works |
| OCR unavailable | User can paste text |
| Official source unavailable | Show verification unavailable, not false verification |

---

# 48. Failure-Mode Design

## LLM unavailable

Fallback:

```text
Rule engine + deterministic explanation
```

## OCR unavailable

Ask user to paste the text.

## Official verification unavailable

Say:

> "Official verification is temporarily unavailable. Do not treat this as verified."

## URL analysis unavailable

Do not claim safe.

## Ambiguous entity

Show:

> "We found a partial match. Name similarity alone is not enough to verify the sender."

---

# 49. What Makes the Prototype Technically Strong

The jury should be able to see:

### 1. Multimodal input
Text + image + URL.

### 2. Hybrid AI
Rules + NLP + optional LLM.

### 3. Explainability
Evidence-based warnings.

### 4. Official verification
Regulatory source comparison.

### 5. Safety guardrails
No investment recommendations.

### 6. Bharat-first
English + Hindi + Telugu.

### 7. Privacy
No OTP/SMS/broker credentials.

### 8. Resilience
Works even when the LLM is unavailable.

### 9. Realistic deployment path
Web app → API → model/rules → official-source verification.

---

# 50. What NOT to Tell the Jury

Avoid:

> "Our AI detects every scam."

Instead:

> "Our system combines multiple scam signals and official-source verification to provide an explainable safety assessment."

Avoid:

> "Our AI knows whether an investment is good."

Instead:

> "Our product deliberately avoids investment recommendations and focuses on fraud resilience."

Avoid:

> "The LLM verifies SEBI registration."

Instead:

> "The verification layer uses structured official-source information; the LLM only explains the resulting evidence."

---

# 51. Impact Metrics

Track prototype metrics such as:

### Detection
- precision;
- recall;
- F1;
- false-negative rate.

### User protection
- percentage of warnings with actionable explanations;
- percentage of scans producing evidence;
- percentage of entity checks with clear verification status.

### Accessibility
- languages supported;
- average scan time;
- mobile usability.

### Privacy
- sensitive fields blocked;
- raw inputs not retained by default.

Do not invent impact numbers before testing.

---

# 52. Scalability Roadmap

## Phase 1 — Hackathon

- Text scan.
- Screenshot scan.
- URL analysis.
- Entity verification.
- English/Hindi/Telugu.
- Rule + lightweight ML.
- Explainable results.

## Phase 2

- More Indian languages.
- Voice.
- Better scam classifier.
- Larger evaluation dataset.
- Better URL intelligence.

## Phase 3

- Continuous threat-intelligence updates.
- Official awareness-content integration.
- Human review workflows.
- More accessibility features.

## Phase 4

- Institutional/public-good deployment subject to appropriate governance, security, regulatory review and partnerships.

---

# 53. Future Features

Potential future features:

- browser extension;
- WhatsApp share-to-check workflow;
- call transcript analyzer;
- multilingual voice assistant;
- scam-pattern knowledge graph;
- family safety mode;
- educational quizzes;
- community-reported scam patterns with moderation;
- explainable threat-intelligence dashboard.

These are future scope, not required for the 4-day MVP.

---

# 54. Ethical and Regulatory Positioning

The product should be positioned as:

> **Investor safety technology**

Not:

> investment advisor  
> trading assistant  
> stock-picking tool  
> financial recommendation engine

The system should clearly communicate:

- it does not provide investment advice;
- risk assessment is not a legal determination;
- registration verification does not prove a specific communication is genuine;
- users should independently verify important claims using official sources.

---

# 55. Official Sources to Integrate/Reference

### SEBI Investor
Official investor education and safety material.

### SEBI Recognised Intermediaries
Official intermediary search for verification.

### SEBI SCORES
Official securities-market grievance facilitation platform.

### SEBI investor awareness content
Use official educational material for scam-awareness topics.

The app should link to official pages rather than cloning their functionality.

---

# 56. Submission Documentation Checklist

## Product
- [ ] Problem statement
- [ ] Target users
- [ ] User journey
- [ ] MVP
- [ ] Features
- [ ] Limitations

## Technology
- [ ] Architecture
- [ ] API design
- [ ] Database
- [ ] AI/ML pipeline
- [ ] Dataset
- [ ] Evaluation

## Safety
- [ ] Privacy
- [ ] Guardrails
- [ ] Security
- [ ] False positives
- [ ] False negatives
- [ ] Uncertainty

## Demo
- [ ] Live prototype
- [ ] 3–5 minute video
- [ ] 3 demo scenarios
- [ ] Architecture diagram
- [ ] Impact
- [ ] Scalability

---

# 57. README Opening

Use this positioning in the repository:

> **Sangyan Shield — AI-Powered Digital Fraud & Scam Resilience for Retail Investors**
>
> Sangyan Shield is a privacy-first safety assistant that helps retail investors analyze suspicious investment messages, screenshots and URLs. It extracts evidence, identifies scam indicators, checks relevant claims against trusted public sources where possible, and provides explainable safety guidance.
>
> The system intentionally does not provide investment recommendations, stock predictions, or trading advice.

---

# 58. Final Product Definition

## One-line pitch

> **Sangyan Shield helps investors pause before they pay by turning suspicious investment messages, screenshots and links into explainable safety warnings and trusted verification steps.**

## Three-line pitch

> Digital investment scams often succeed because users cannot quickly distinguish legitimate information from manipulation. Sangyan Shield analyzes suspicious messages, screenshots and URLs using a hybrid rules + NLP pipeline and verifies relevant entity claims against trusted public sources. It explains the evidence in simple regional-language-friendly terms and gives safe next steps without providing investment advice.

## Core promise

```text
SEE THE RED FLAGS
        ↓
UNDERSTAND WHY
        ↓
VERIFY THE CLAIM
        ↓
PAUSE BEFORE YOU PAY
```

---

# 59. Source Notes

This documentation uses:
1. The SANGYAN Track A requirements supplied for this project.
2. The uploaded "Vibe Coding: A Complete Beginner-to-Production Guide" for the documentation-first development workflow, task breakdown, architecture, testing and security structure. fileciteturn0file0L397-L461
3. Current official SEBI investor resources for fraud-awareness, intermediary verification and grievance-redressal references.

Relevant official sources:
- SEBI Investor: https://investor.sebi.gov.in/
- SEBI Recognised Intermediaries: https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes
- SEBI SCORES: https://scores.sebi.gov.in/scores-home
- SEBI Investor fraud-awareness: https://investor.sebi.gov.in/beware-of-investment.html

---

# 60. Immediate Build Order

Do not start by building every feature.

Build in this order:

```text
1. Project setup
2. Documentation
3. Home UI
4. Text scanner
5. Rule engine
6. Explainable result
7. Screenshot/OCR
8. URL analysis
9. Entity verification
10. Risk aggregation
11. Multilingual output
12. Safety guardrails
13. Testing
14. Deployment
15. Demo preparation
```

The first end-to-end vertical slice should be:

```text
Paste suspicious message
        ↓
Detect 3–5 signals
        ↓
Generate evidence
        ↓
Show risk band
        ↓
Show safe actions
```

Only after that should the team add OCR, URL analysis, verification and multilingual features.

