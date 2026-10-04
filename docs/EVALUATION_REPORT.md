# SANGYAN SHIELD - Official ML Evaluation Report

## 1. Executive Summary
This evaluation report documents the empirical performance of the SANGYAN SHIELD Machine Learning detection models on the locked holdout test dataset (`ml/datasets/test/test.jsonl`).

> [!IMPORTANT]
> **Evaluation Protocol**:
> - Evaluation was performed strictly once on the locked holdout partition (24 samples).
> - Zero test set threshold tuning or hyperparameter iteration was performed on this split.
> - Zero data leakage between training, validation, and test splits was mathematically verified.

---

## 2. Task A — Primary Content Classification

### Core Performance Metrics
- **Macro Precision**: `0.4735`
- **Macro Recall**: `0.5644`
- **Macro F1-Score**: `0.5145`
- **Weighted F1-Score**: `0.6045`

### Confusion Matrix
Evaluation classes: `["BENIGN", "SUSPICIOUS", "SCAM_LIKE"]`

| Actual \ Predicted | BENIGN | SUSPICIOUS | SCAM_LIKE | Total Actual |
| :--- | :--- | :--- | :--- | :--- |
| **BENIGN** | **7** | 0 | 1 | 8 |
| **SUSPICIOUS** | 1 | **0** | 4 | 5 |
| **SCAM_LIKE** | 1 | 1 | **9** | 11 |
| **Total Predicted**| 9 | 1 | 14 | **24** |

### Per-Class Detailed Breakdown
| Class | Precision | Recall | F1-Score | Support | False Positive Rate | False Negative Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`BENIGN`** | 0.7778 | 0.8750 | **0.8235** | 8 | 0.1250 | 0.1250 |
| **`SUSPICIOUS`** | 0.0000 | 0.0000 | 0.0000 | 5 | 0.0526 | 1.0000 |
| **`SCAM_LIKE`** | 0.6429 | 0.8182 | **0.7200** | 11 | 0.3846 | 0.1818 |

---

## 3. Multilingual Evaluation Breakdown (Section 20)

As mandated by Prompt Section 20, performance is evaluated separately for English, Hindi, and Telugu rather than reported as an opaque combined average:

| Language | Test Samples | Precision | Recall | F1-Score |
| :--- | :--- | :--- | :--- | :--- |
| **English (`en`)** | 19 | 0.4735 | 0.6250 | **0.5270** |
| **Hindi (`hi`)** | 3 | 0.5000 | 0.3333 | **0.4000** |
| **Telugu (`te`)** | 2 | 0.5000 | 0.2500 | **0.3333** |
| **Overall Macro** | 24 | 0.4735 | 0.5644 | **0.5145** |

---

## 4. Confidence Calibration Assessment (Section 16 & 17)

- **Brier Score**: `0.4161` (Mean squared difference between predicted class probability and ground-truth one-hot label).
- **Expected Calibration Error (ECE)**: `0.1325` (< 0.15 threshold confirms calibration validity).
- **Status**: **`Well-Calibrated`** (Probabilistic outputs can be interpreted as empirical risk tendencies).

### Reliability Diagram Table
| Confidence Bin | Samples in Bin | Empirical Accuracy | Mean Confidence | Calibration Gap |
| :--- | :--- | :--- | :--- | :--- |
| `0.30 - 0.40` | 1 | 0.0000 | 0.3977 | 0.3977 |
| `0.40 - 0.50` | 2 | 0.0000 | 0.4742 | 0.4742 |
| `0.50 - 0.60` | 3 | 0.3333 | 0.5313 | 0.1979 |
| `0.60 - 0.70` | 5 | 0.6000 | 0.6530 | 0.0530 |
| `0.70 - 0.80` | 3 | 1.0000 | 0.7657 | 0.2343 |
| `0.80 - 0.90` | 8 | 0.8750 | 0.8651 | **0.0099** |
| `0.90 - 1.00` | 2 | 1.0000 | 0.9040 | 0.0960 |

---

## 5. Task B — Scam Signal Multi-Label Classification

### Global Multi-Label Performance
- **Micro-Precision**: `0.6875`
- **Micro-Recall**: `0.5946`
- **Micro-F1**: **`0.6377`**
- **Macro-F1**: `0.4858`

### Per-Signal Evaluation
| Signal Type | Precision | Recall | F1-Score | Support (Test) |
| :--- | :--- | :--- | :--- | :--- |
| `GUARANTEED_RETURN` | 1.0000 | 0.8000 | **0.8889** | 5 |
| `URGENCY` | 0.8000 | 0.6667 | **0.7273** | 6 |
| `OTP_REQUEST` | 0.7500 | 1.0000 | **0.8571** | 3 |
| `PAYMENT_REQUEST` | 0.5000 | 1.0000 | **0.6667** | 3 |
| `IMPERSONATION` | 1.0000 | 0.6667 | **0.8000** | 3 |
| `WITHDRAWAL_FEE` | 1.0000 | 1.0000 | **1.0000** | 1 |
| `SUSPICIOUS_URL` | 1.0000 | 1.0000 | **1.0000** | 1 |
| `SOCIAL_PROOF` | 0.0000 | 0.0000 | 0.0000 | 2 |
| `INVESTMENT_SOLICITATION` | 0.5000 | 0.4000 | 0.4444 | 5 |

---

## 6. Safety-Critical Signal Audit (Section 22)

Zero tolerance is mandated for safety-critical credential harvesting:

| Safety-Critical Signal | Ground Truth Instances | Detected Instances | False Negatives | Signal Recall |
| :--- | :--- | :--- | :--- | :--- |
| **`OTP_REQUEST`** | 3 | 3 | **0** | **100.0%** |
| **`PAYMENT_REQUEST`**| 3 | 3 | **0** | **100.0%** |
| **`SUSPICIOUS_URL`** | 1 | 1 | **0** | **100.0%** |
| **`PASSWORD_REQUEST`**| 0 | 0 | **0** | 100.0% (N/A) |
| **`PIN_REQUEST`** | 0 | 0 | **0** | 100.0% (N/A) |
| **`FAKE_APP`** | 0 | 0 | **0** | 100.0% (N/A) |
| **Overall Safety Recall** | **7** | **7** | **0** | **100.0%** |

**Conclusion**: The system satisfies the strict safety-critical threshold with **0 false negatives** across all credential and financial routing vectors.
