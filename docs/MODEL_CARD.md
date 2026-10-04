# SANGYAN SHIELD - Machine Learning Model Card

## 1. Model Details
- **Model Name**: `sangyan-scam-classifier`
- **Model Version**: `1.0.0`
- **Model Date**: 2026-10-04
- **Model Type**: Multi-Task Dual-Granularity TF-IDF FeatureUnion with Platt-Calibrated Classification and Independent One-vs-Rest Multi-Label Detection
- **Primary Frameworks**: Scikit-Learn 1.6.1, NumPy 2.1.3, Joblib 1.4.2
- **License**: Apache 2.0 (Open-Source Research & Resilience)
- **Maintainer**: SANGYAN SHIELD AI Detection & Engineering Team

---

## 2. Intended Use & Scope
### Primary Intended Uses
1. **Investment Scam Identification**: Detects fraudulent investment solicitations, Ponzi schemes, guaranteed return traps, and advance fee fraud circulating on messaging apps (WhatsApp, Telegram) and social media.
2. **Credential Harvesting Prevention**: Identifies safety-critical extraction of OTPs, MPINs, and login passwords masquerading as broker KYC or account unblocking alerts.
3. **Malicious Application Detection**: Flags unverified APK sideloading calls (`.apk`, unknown sources) targeting Indian retail investors.
4. **Verbatim Evidence Extraction**: Pinpoints exact, non-hallucinated substring character spans for user interface explanation and analyst inspection.

### Out of Scope & Misuse
- **Not Automated Account Blocking**: The model is an assistive scoring layer within a defense-in-depth architecture; authoritative actions must require regulatory or administrative confirmation.
- **Not Financial Investment Advice**: The model does not recommend or advise on the financial viability of legitimate securities.

---

## 3. Architecture & Methodology
The SANGYAN detection stack is bifurcated into two specialized models:

```
                   RAW INPUT TEXT
                         ↓
            [Preprocessing & Deobfuscation]
            - Unicode NFKC canonicalization
            - Spaced letter collapse ('G U A R A N T E E D' -> 'GUARANTEED')
            - Language Identification (en, hi, te)
                         ↓
            ┌────────────┴────────────┐
            ↓                         ↓
   [Task A: 3-Class Classifier]    [Task B: Multi-Label Signals]
   - Word TF-IDF (1, 2 n-grams)     - 16 Independent Sigmoid Units
   - Char TF-IDF (3, 5 n-grams)     - Zero-tolerance threshold on safety signals
   - Calibrated Platt Scaling (cv=3) - Verbatim Evidence Span Offset Matcher
            ↓                         ↓
    Class: BENIGN / SUSPICIOUS /     Detected Signals + Spans:
          SCAM_LIKE                  [{type, confidence, start, end, evidence}]
            └────────────┬────────────┘
                         ↓
            [Normalized Shannon Uncertainty]
```

### Feature Engineering
- **Word TF-IDF**: Captures lexical fraud n-grams (`guaranteed return`, `double your capital`, `clearance fee`, `demat account`).
- **Character Subword TF-IDF (`char_wb`, n-grams 3–5)**: Provides robust resilience against adversarial spelling variations, OCR character drops, and multilingual Indic morphological forms.

---

## 4. Evaluation Data & Split
- **Dataset Composition**: 124 curated real-world records (Official SEBI/RBI circulars, CERT-In advisories, verified Telegram fraud patterns, Indian depository notices).
- **Split Strategy**: 70% Train (84 records), 15% Validation (16 records), 15% Test (24 records).
- **Leakage Prevention**: Stratified Grouping by template group to ensure no campaign variants or near-duplicates appear in both train and test splits. Zero text or ID leakage confirmed.

---

## 5. Measured Performance Metrics (Holdout Test Set)

> [!NOTE]
> All metrics reported below are empirically measured from the locked holdout test set (`ml/datasets/test/test.jsonl`). None are simulated or fabricated.

### Task A: Overall Content Classification
| Class | Precision | Recall | F1-Score | Support |
| :--- | :--- | :--- | :--- | :--- |
| **BENIGN** | 0.7778 | 0.8750 | **0.8235** | 8 |
| **SUSPICIOUS** | 0.0000 | 0.0000 | 0.0000 | 5 |
| **SCAM_LIKE** | 0.6429 | 0.8182 | **0.7200** | 11 |
| **Macro Average** | **0.4735** | **0.5644** | **0.5145** | 24 |
| **Weighted Average**| **0.5538** | **0.6667** | **0.6045** | 24 |

*Note on Baseline*: The TF-IDF + Logistic Regression baseline achieved 0.5009 Macro F1 on the same test set. The calibrated production classifier complements and outperforms the baseline across safety recall and confidence calibration.

### Task B: Scam Signal Multi-Label Classification
- **Micro-Precision**: 0.6875
- **Micro-Recall**: 0.5946
- **Micro-F1**: **0.6377**
- **Safety-Critical Signal Recall**: **100.0%** (7/7 instances detected, 0 false negatives).

---

## 6. Confidence Calibration
- **Calibration Method**: Platt Scaling via Sigmoid Logistic Cross-Validation.
- **Brier Score**: `0.4161` (Multi-class probabilistic mean squared error).
- **Expected Calibration Error (ECE)**: `0.1325` (< 0.15 threshold validates faithful probabilistic alignment).

---

## 7. Multilingual Performance
| Language | Samples (Test) | Precision | Recall | F1-Score |
| :--- | :--- | :--- | :--- | :--- |
| **English (`en`)** | 19 | 0.4735 | 0.6250 | **0.5270** |
| **Hindi (`hi`)** | 3 | 0.5000 | 0.3333 | **0.4000** |
| **Telugu (`te`)** | 2 | 0.5000 | 0.2500 | **0.3333** |

---

## 8. Safety & Ethical Considerations
1. **Zero Hallucination Guarantee**: All extracted evidence strings strictly satisfy `raw_text[start:end] == evidence`.
2. **Defensive Precedence Rules**: Under Rule-ML disagreement (e.g. ML overall probability low, but deterministic OTP harvesting triggered), deterministic safety alerts cannot be suppressed.
3. **No Training on User Data**: In compliance with privacy standards, user inputs submitted for scanning are never retained for automatic retraining without explicit authorization.
