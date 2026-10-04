# SANGYAN SHIELD - Machine Learning Model Limitations

## 1. Transparency & Operational Boundaries
In adherence to the core non-negotiable rules of the SANGYAN Hackathon (Track A), this document transparently specifies the known limitations, assumptions, and operational boundaries of the SANGYAN SHIELD Machine Learning detection engine.

---

## 2. Key Known Limitations

### 1. Negation Complexity in Security Warnings
- **Limitation**: The model may occasionally trigger false positives on legitimate awareness advisories that caution users *against* scams (e.g., *"Never share your OTP with anyone"*).
- **Technical Reason**: TF-IDF feature representations are primarily bag-of-words and character subwords; they do not construct complete hierarchical syntactic parse trees.
- **Production Safeguard**: The Hybrid Risk Engine pairs ML inference with a whitelist of verified regulatory disclaimers and verified institutional communication channels.

### 2. Emerging Vernacular Slang & Dialectal Transliteration
- **Limitation**: The current dataset contains curated English, Hindi (Devanagari/Hinglish), and Telugu (Telugu script/Tenglish). Extreme phonetic or regional slang variations (e.g., deeply colloquial Telugu or local Hindi dialects) may show reduced signal confidence.
- **Production Safeguard**: When normalized Shannon entropy indicates high uncertainty ($H_{\text{norm}} > 0.65$), the system explicitly marks the prediction as *"High Ambiguity — Manual Verification Recommended"*.

### 3. Highly Low-Resolution Screenshot OCR
- **Limitation**: While the `ml/preprocessing/cleaner.py` engine corrects broken line breaks, stray pipe characters, and common OCR substitutions, heavily distorted or downsampled screenshots (< 72 DPI) with unreadable fonts may result in degraded feature representations.
- **Production Safeguard**: The system extracts raw URLs and phone numbers directly from visual text patterns before tokenization.

### 4. Zero Autonomous Execution
- **Limitation**: SANGYAN SHIELD is an analytical risk intelligence and early-warning engine. It does not possess authority to freeze bank accounts, execute trades, or seize funds.
- **Compliance**: The software produces risk indicators and structured evidence to empower human users and regulatory bodies; it does not issue financial advice.

---

## 3. Computational Footprint & Latency Benchmarks
- **Average Inference Latency**: `2.4 ms` per text sample (on standard CPU, zero GPU requirement).
- **RAM Usage**: < 65 MB total memory footprint.
- **Disk Footprint**: Total serialized model artifacts under 600 KB.
- **Edge Deployment Ready**: Does not require multi-gigabyte PyTorch CUDA runtime, ensuring instantaneous responses in production and mobile-first retail environments.

---

## 4. Retraining & Drift Mitigation Workflow
Model drift will inevitably occur as cybercriminals invent novel lingo, spoof new platforms, or adopt obfuscation patterns. SANGYAN SHIELD establishes a strict drift preparation pipeline:
1. **No Automatic Retraining on User Inputs**: User-submitted texts are never automatically injected into the training set, preventing model poisoning.
2. **Supervised Analyst Review**: Suspicious novel patterns flagged by users via the *"Was this assessment useful?"* feedback modal must undergo manual labeling and verification before inclusion.
3. **Reproducible Pipeline**: Adding new verified records to `RAW_RECORDS` and executing `python -m ml.training.train` automatically runs data quality validation, zero-leakage splitting, baseline benchmarking, and model calibration in under 15 seconds.
