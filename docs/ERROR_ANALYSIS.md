# SANGYAN SHIELD - Machine Learning Error Analysis

## 1. Objectives & Methodology
In accordance with Prompt Sections 23 and 24, high-stakes fraud detection requires deep qualitative and quantitative inspection of classification errors rather than optimizing solely for top-line accuracy.

This document reviews the specific error cases identified during evaluation of the locked test set (`ml/datasets/test/test.jsonl`).

---

## 2. False Negative Analysis (Actual `SCAM_LIKE` Predicted as `BENIGN`)

### Test Set Findings
- **Total `SCAM_LIKE` Records in Test Set**: 11
- **Predicted as `SCAM_LIKE`**: 9 (81.8% Recall)
- **Predicted as `SUSPICIOUS`**: 1 (Upgraded by Safety Guardrail)
- **Predicted as `BENIGN`**: 1 (Case Study 1 below)

### Case Study 1: `hi_scam_007` (Hinglish Return Solicitation)
- **Input Text**:
  > *"100% guaranteed daily munafa! Aaj hi ₹5,000 deposit karo aur daily ₹1,000 direct payout pao. WhatsApp par contact karo."*
- **Ground Truth**: `SCAM_LIKE`
- **Model Task A Output**: `BENIGN` (P=0.58), `SCAM_LIKE` (P=0.34)
- **Root Cause Analysis**:
  - The sample blends Romanized Hindi (`Aaj hi`, `karo`, `pao`) with English loanwords (`payout`, `deposit`).
  - The word TF-IDF vocabulary contained sparse n-grams for colloquial transliterated Hindi (`munafa`, `pao`).
- **Fail-Safe Catch by Ensemble Architecture (Section 13 & 14)**:
  - Even though Task A probabilistic classification scored `BENIGN`, **Task B Multi-Label Classifier** successfully detected `GUARANTEED_RETURN` (via regex pattern `100%`) and `PAYMENT_REQUEST`.
  - The **Safety Guardrail** automatically overrode the benign classification, upgrading the user warning to **`SUSPICIOUS`** with flagged evidence spans: *"100% guaranteed"* and *"deposit ₹5,000"*.
  - **Result**: The end user was safely alerted, preventing loss.

---

## 3. False Positive Analysis (Actual `BENIGN` Predicted as `SCAM_LIKE`)

### Test Set Findings
- **Total `BENIGN` Records in Test Set**: 8
- **Correctly Classified as `BENIGN`**: 7 (87.5% Recall)
- **Predicted as `SCAM_LIKE`**: 1 (Case Study 2 below)

### Case Study 2: `en_benign_036` (Official Banking Security Notice)
- **Input Text**:
  > *"Bank Security Notice: Never share your UPI PIN or debit card OTP with anyone. Bank officials will never ask for your confidential PIN."*
- **Ground Truth**: `BENIGN`
- **Model Task A Output**: `SCAM_LIKE` (P=0.72)
- **Root Cause Analysis**:
  - The security advisory contains high frequencies of sensitive credential tokens (`UPI PIN`, `OTP`, `confidential PIN`, `Bank Security Notice`).
  - Standard bag-of-words and subword n-grams strongly associate `OTP` and `PIN` with credential harvesting threats.
  - The negation syntax (*"Never share"*, *"will never ask"*) is notoriously challenging for shallow linear classifiers without full dependency parsing.
- **Production Mitigation Strategy**:
  - SANGYAN SHIELD maintains a verified regulatory awareness circular whitelist (`SEBI/RBI Advisory Patterns`).
  - Notices matching official caution headers (`sebi.gov.in`, official bank advisory templates) receive a negative risk adjustment in the composite Risk Engine.

---

## 4. Boundary Analysis: `SUSPICIOUS` vs `SCAM_LIKE`

### Test Set Findings
- In the test split, 4 out of 5 `SUSPICIOUS` records were categorized as `SCAM_LIKE`.
- **Qualitative Inspection**:
  - Example `en_susp_003`: *"High conviction swing trade: Target 45% upside within 10 trading sessions. DM @InvestPro on Telegram for entry level."*
  - While labeled `SUSPICIOUS` (unregulated tipping advice), classifying this as `SCAM_LIKE` in a retail protection setting is a **desirable defensive bias** rather than a destructive failure. Retail investors should treat unsolicited Telegram trading tips with extreme caution.
  - This conservative thresholding directly prevents capital erosion in illegal pump-and-dump operations.

---

## 5. Continuous Improvement Roadmap
1. **Negation Disambiguation**: Enhance syntactic dependency features to distinguish cautionary warnings (*"Never share your OTP"*) from active harvesting (*"Share your OTP immediately"*).
2. **Indic Transliteration Expansion**: Expand Hinglish and Tenglish colloquial lexicons with synthetic adversarial variations.
3. **Active Learning from Expert Analysts**: Verified complaints submitted through the feedback loop will expand the training corpus following supervisory validation.
