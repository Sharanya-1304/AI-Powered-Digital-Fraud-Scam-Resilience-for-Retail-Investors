# SANGYAN SHIELD - Machine Learning Detection Engine

## Overview
This package implements the production-grade Machine Learning detection layer for **SANGYAN SHIELD — Digital Fraud & Scam Resilience (Track A, SANGYAN Hackathon 2026)**.

The ML architecture operates in defense-in-depth with deterministic safety rules, URL reputational scoring, and SEBI/RBI verification registries to identify investment fraud, Ponzi schemes, Telegram tipping scams, APK sideloading attacks, and credential harvesting across **English**, **Hindi**, and **Telugu**.

---

## Directory Layout
```
ml/
├── datasets/
│   ├── raw/                      # Full un-split corpus (corpus_full.json)
│   ├── processed/                # Normalized & preprocessed records
│   ├── train/                    # 70% holdout-free training split (train.jsonl)
│   ├── validation/               # 15% tuning split (val.jsonl)
│   ├── test/                     # 15% locked evaluation split (test.jsonl)
│   └── dataset_quality_report.json
├── preprocessing/
│   ├── cleaner.py                # OCR remediation, entity extraction & pipeline
│   ├── normalizer.py             # Unicode NFKC, currency standardization & deobfuscation
│   └── language.py               # Multilingual detector (en, hi, te, Hinglish, Tenglish)
├── features/
│   └── tfidf.py                  # Dual-granularity Word + Character subword TF-IDF
├── models/
│   ├── baseline.py               # Transparent TF-IDF + Logistic Regression benchmark
│   ├── classifier.py             # Task A Calibrated 3-Class Classifier (Platt scaling)
│   └── multilabel.py             # Task B 16-Signal Multi-label Classifier & Evidence Spans
├── training/
│   ├── train.py                  # End-to-end training pipeline CLI
│   └── config.yaml               # Reproducible configuration (splits, hyperparams)
├── evaluation/
│   ├── evaluate.py               # Standalone test set evaluator CLI
│   ├── metrics.py                # Precision, Recall, Macro F1, Multilingual metrics
│   ├── calibration.py            # Brier Score & Expected Calibration Error (ECE)
│   └── reports.py                # Safety signal audits & error breakdown generators
├── inference/
│   └── predictor.py              # Structured inference engine with graceful fallback
├── artifacts/                    # Serialized joblib models and JSON metric reports
└── tests/
    ├── test_classifier.py        # Task A & structured schema tests
    ├── test_multilabel.py        # Task B multi-signal & verbatim evidence tests
    ├── test_adversarial.py       # Spacing, punctuation obfuscation & OCR noise tests
    └── test_multilingual.py      # Devanagari, Telugu script, and transliteration tests
```

---

## Reproduction & Pipeline Execution

### 1. Requirements
Install pinned dependencies:
```bash
pip install -r requirements-ml.txt
```

### 2. Run Full Training & Split Pipeline
Executes dataset quality audit, 70/15/15 stratified leak-free split, baseline model training, Task A calibrated classifier, Task B multi-label signal model, and evaluation:
```bash
python -m ml.training.train
```

### 3. Run Standalone Test Evaluation
Evaluates locked test set and outputs calibrated Brier score, ECE, multilingual breakdown, and safety signal reports:
```bash
python -m ml.evaluation.evaluate
```

### 4. Run Test Suite
```bash
python -m unittest discover -s ml/tests -p "test_*.py"
```

---

## Structured Output Schema
The inference engine guarantees structured, verifiable output with exact verbatim evidence span character offsets:
```json
{
  "classification": {
    "label": "SCAM_LIKE",
    "confidence": 0.87,
    "uncertainty": 0.23,
    "class_probabilities": {
      "BENIGN": 0.05,
      "SUSPICIOUS": 0.08,
      "SCAM_LIKE": 0.87
    }
  },
  "signals": [
    {
      "type": "GUARANTEED_RETURN",
      "confidence": 0.96,
      "evidence": "Guaranteed 30% monthly return",
      "start": 0,
      "end": 29,
      "is_safety_critical": false
    },
    {
      "type": "URGENCY",
      "confidence": 0.91,
      "evidence": "within 10 minutes",
      "start": 45,
      "end": 62,
      "is_safety_critical": false
    }
  ],
  "metadata": {
    "language": "en",
    "language_confidence": 0.92,
    "entities": {
      "urls": [],
      "phones": [],
      "upis": []
    }
  }
}
```

---

## Safety Guarantees
1. **Zero Hallucinated Evidence**: Every span `start` and `end` satisfies `input_text[start:end] == evidence`.
2. **Zero Test Leakage**: Template variations are strictly grouped into a single split. No test examples are used during training or threshold tuning.
3. **Graceful Fallback**: If ML weights are corrupted or unavailable, the system safely reports `ML unavailable` while deterministic safety rules continue protecting the user.
4. **Safety-Critical Zero Tolerance**: High-stakes signals (`OTP_REQUEST`, `PAYMENT_REQUEST`, `PASSWORD_REQUEST`, `PIN_REQUEST`, `FAKE_APP`, `SUSPICIOUS_URL`) feature explicit precedence rules.
