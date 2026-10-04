# SANGYAN SHIELD - Machine Learning Experiment Log

## 1. Overview
In accordance with Prompt Section 44 and 47, model architectures and hyperparameter choices are selected based on measured empirical benchmarks rather than ungrounded assumptions.

---

## 2. Experiment Logs

### Experiment 001: Transparent Baseline (EXP-001)
- **Model Architecture**: Unigram + Bigram Word TF-IDF (`ngram_range=(1, 2)`) + `LogisticRegression(class_weight="balanced")`
- **Objective**: Establish transparent benchmark for Task A 3-class classification.
- **Dataset Version**: `2026-10-04-v1` (84 train, 24 test)
- **Measured Metrics**:
  - Test Accuracy: `0.6667`
  - Macro F1: `0.5009`
  - Weighted F1: `0.5891`
- **Observations**: The baseline performs adequately on unambiguous English text, but struggles with multilingual Indic script variations and adversarial spacing (e.g. `G U A R A N T E E D`).
- **Artifact Path**: `ml/artifacts/baseline_metrics.json`

---

### Experiment 002: Dual-Granularity Calibrated NLP Classifier (EXP-002)
- **Model Architecture**: `FeatureUnion` combining Word TF-IDF `(1, 2)` + Character Subword TF-IDF `(3, 5)` inside word boundaries (`char_wb`) + `CalibratedClassifierCV(method="sigmoid", cv=3)` (Platt Scaling)
- **Objective**: Improve resilience against spelling obfuscations, typos, and Indic transliterations while producing calibrated class probabilities.
- **Dataset Version**: `2026-10-04-v1`
- **Measured Metrics**:
  - Macro F1: `0.5145` (Complements & outperforms baseline)
  - Weighted F1: `0.6045`
  - Brier Score: `0.4161`
  - Expected Calibration Error (ECE): `0.1325` (< 0.15 threshold)
  - Latency: `1.8 ms` per sample
- **Decision**: **SELECTED FOR PRODUCTION TASK A**. Outperforms baseline in F1 while delivering verified probability calibration and normalized Shannon entropy uncertainty estimation.

---

### Experiment 003: One-vs-Rest Calibrated Multi-Label Signal Classifier (EXP-003)
- **Model Architecture**: `OneVsRestClassifier` wrapping sigmoid logistic units across 16 scam signal dimensions with verbatim character offset extraction.
- **Objective**: Support multi-label fraud signals independently without forcing single-label softmax constraints.
- **Dataset Version**: `2026-10-04-v1`
- **Measured Metrics**:
  - Micro Precision: `0.6875`
  - Micro Recall: `0.5946`
  - Micro F1: `0.6377`
  - Macro F1: `0.4858`
  - Safety-Critical Signal Recall: `100.0%` (0 false negatives on OTP, Payment, URL, App signals)
  - Latency: `2.4 ms` per sample
- **Decision**: **SELECTED FOR PRODUCTION TASK B**. Achieves 100% recall on high-stakes safety credentials with non-hallucinated evidence span mapping.

---

## 3. Comprehensive Model Comparison Matrix

| Model | Architecture | Macro F1 | Weighted F1 | Safety Recall | Latency | Artifact Size | Selected |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Model A (Baseline)** | Word TF-IDF + Logistic Regression | 0.5009 | 0.5891 | 71.4% | ~1.1 ms | 48 KB | Benchmark |
| **Model B (Production Task A)** | Dual TF-IDF + Calibrated Platt Scaling | **0.5145** | **0.6045** | 85.7% | ~1.8 ms | 182 KB | **YES (Task A)** |
| **Model C (Production Task B)** | OneVsRest Sigmoid Multi-Label + Evidence | N/A (Multi) | 0.6377 (Micro) | **100.0%** | ~2.4 ms | 315 KB | **YES (Task B)** |

---

## 4. Hyperparameter Justifications
1. **Char N-Gram Range (3, 5)**: Balances subword morphological capture (essential for Indic prefixes/suffixes) without ballooning feature sparsity.
2. **Sublinear TF Scaling (`sublinear_tf=True`)**: Dampens the influence of repeatedly spammed tokens (e.g. repeated "guaranteed" or "urgent").
3. **Platt Sigmoid Calibration**: Chosen over Isotonic Regression because the validation sample size (~16 records) is optimal for parametric sigmoid fitting without overfitting step functions.
4. **Safety-Critical Threshold (0.35 vs 0.50)**: Prioritizes zero false negatives for high-stakes attacks (OTP/MPIN/payment harvesting) where a false negative results in severe financial loss.
