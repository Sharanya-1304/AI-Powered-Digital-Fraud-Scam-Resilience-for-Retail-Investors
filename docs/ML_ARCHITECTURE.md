# SANGYAN SHIELD - Machine Learning Architecture

## 1. High-Level Architecture

The SANGYAN SHIELD detection system adheres to an ensemble defense-in-depth model. Machine Learning serves as a probabilistic evidence source that feeds a deterministic Risk Engine alongside URL Analysis, Pattern Rules, and Authoritative SEBI/RBI Registries.

```
                              USER INPUT
              (Plain Text, Screenshot OCR, Social Media)
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │   NORMALIZATION & CLEANER   │
                   │  - Unicode NFKC Canonical   │
                   │  - Spaced Text Collapse     │
                   │  - OCR Artifact Remediation │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │     LANGUAGE DETECTION      │
                   │   English / Hindi / Telugu  │
                   └──────────────┬──────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  RULE ENGINE │          │   ML MODEL   │          │ URL ANALYZER │
│ Deterministic│          │ Dual TF-IDF  │          │ Reputation / │
│ Safety Logic │          │ + Calibrated │          │ Homoglyphs   │
└───────┬──────┘          └──────┬───────┘          └──────┬───────┘
        │                        │                         │
        └────────────────────────┼─────────────────────────┘
                                 ▼
                   ┌─────────────────────────────┐
                   │     EVIDENCE AGGREGATOR     │
                   │   - Verbatim Offset Spans   │
                   │   - Confidence Scores       │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │         RISK ENGINE         │
                   │   Composite Score Synthesis │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │    REGISTRY VERIFICATION    │
                   │ SEBI Broker / App Whitelist │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │     SAFETY GUARDRAIL        │
                   │   Disagreement Resolution   │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │     EXPLANATION ENGINE      │
                   │  - What did we detect?      │
                   │  - Where did we detect it?  │
                   │  - Why does it matter?      │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                             REACT UI
```

---

## 2. Core Machine Learning Pipelines

### Task A — Overall Content Classification (3 Classes)
- **Classes**: `BENIGN`, `SUSPICIOUS`, `SCAM_LIKE`
- **Feature Extractor**: `SangyanFeatureExtractor`
  - Word TF-IDF: N-gram range `(1, 2)`, sublinear TF, accent stripping.
  - Character TF-IDF: N-gram range `(3, 5)` within word boundaries (`char_wb`), capturing spelling variations, zero-width hacks, and Indic morphemes.
- **Model**: `LogisticRegression(class_weight="balanced")` calibrated via `CalibratedClassifierCV(method="sigmoid", cv=3)` (Platt scaling).
- **Uncertainty Quantification**:
  Normalized Shannon Entropy over the 3-class calibrated probability distribution:
  $$H_{\text{norm}}(p) = -\frac{\sum_{k=1}^K p_k \log_2(p_k)}{\log_2(K)}$$
  Where $H_{\text{norm}} \in [0.0, 1.0]$. A score of 0.0 denotes absolute decision confidence; 1.0 indicates maximum classification ambiguity.

### Task B — Scam Signal Multi-Label Classification (16 Signals)
- **Model**: `OneVsRestClassifier` wrapping sigmoid logistic units.
- **Independence Guarantee**: Unlike single-label softmax, each signal represents an independent binary classifier. A message such as:
  > *"Guaranteed 30% return. Pay today and send your OTP."*
  
  simultaneously activates `GUARANTEED_RETURN`, `PAYMENT_REQUEST`, `URGENCY`, and `OTP_REQUEST`.

---

## 3. Verbatim Evidence Span Extraction (Zero Hallucination)
For every detected signal, the inference engine executes deterministic character offset mapping against the raw input text.

```json
{
  "signal": "GUARANTEED_RETURN",
  "evidence": "Guaranteed 30% monthly return",
  "start": 0,
  "end": 29,
  "confidence": 0.96
}
```

The system strictly enforces:
$$\text{raw\_text}[\text{start}:\text{end}] == \text{evidence}$$
Under no circumstances are external or fabricated tokens returned as evidence spans.

---

## 4. Hybrid Risk Engine Synthesis

The risk engine computes the final numeric score (0 to 100) through a weighted composite formulation:

$$\text{Final Risk Score} = \text{rule\_score} + \text{model\_score} + \text{url\_score} + \text{verification\_score}$$

Where:
- **`model_score`** ($0 - 40$): Calibrated scam probability scaled to maximum 40 points.
- **`rule_score`** ($0 - 35$): Points attributed to high-confidence safety pattern triggers.
- **`url_score`** ($0 - 25$): Risk points from unregistered domains, IP hostnames, or URL shorteners.
- **`verification_score`** ($0 - 30$): Penalty for unverified claims of SEBI/NSE affiliation.

---

## 5. Disagreement Handling & Precedence Guardrails

In compliance with Prompt Section 14:
> **Safety Principle**: Deterministic safety-critical signals must never be suppressed by low statistical ML probability.

### Scenario Example
- **ML Task A**: `SCAM_LIKE` probability = 0.38 (`BENIGN` / `SUSPICIOUS`)
- **Deterministic Rule**: `OTP_REQUEST` pattern triggered on *"Please share the 6-digit OTP"*

### Guardrail Action
1. The overall assessment is upgraded to **`SUSPICIOUS`** (Needs Verification).
2. The `OTP_REQUEST` warning remains prominently visible with high severity.
3. The explanation engine explicitly alerts: *"Safety-Critical Credential Solicitation Detected: The message requests a one-time password."*
4. Probabilistic model predictions do not override authoritative rules or official verification registries.
