# SANGYAN SHIELD - Dataset Card

## 1. Dataset Overview
- **Dataset Title**: SANGYAN Indian Retail Financial Fraud & Scam Communications Dataset (SANGYAN-Corpus-v1)
- **Version**: `2026-10-04-v1`
- **Total Records**: 124 curated and verified records
- **Languages**: English (`en`), Hindi (`hi`), Telugu (`te`)
- **Primary Domain**: Indian Retail Investment, Demat Accounts, Trading Channels, Mutual Funds & Depository Communications

---

## 2. Dataset Purpose & Provenance
The dataset is engineered to train and evaluate automated detection systems protecting Indian retail investors from pervasive cyber fraud. It reflects real-world communication modalities:
1. **Unsolicited Telegram & WhatsApp Solicitations** (High-yield schemes, algorithmic trading bots)
2. **Credential & Identity Harvesting Traps** (KYC suspension panic messages, fake SEBI/broker emails)
3. **Malicious Sideloading Calls** (Unverified Android APK links promising zero brokerage or institutional limits)
4. **Legitimate Financial Communications** (NSE/BSE order fills, CDSL/NSDL depository notices, mutual fund SIP confirmations)

### Sources & Fair Use Licensing
All entries comply with ethical cybersecurity research and fair-use educational guidelines:
- **Public Regulatory Alerts**: Official cautionary circulars released by the Securities and Exchange Board of India (SEBI) and Reserve Bank of India (RBI).
- **CERT-In Phishing Advisories**: Documented threat actor lures from national cybersecurity alerts.
- **Curated Field Templates**: Synthesized variants based strictly on documented cybercrime case records without incorporating private citizen PII.
- **Authored Legitimate Baselines**: Real-world templates from public corporate announcements, dividend circulars, and standard broker contract note formats.

---

## 3. Label Methodology & Ontology

### Task A: Primary Content Classification (3 Classes)
| Class | Definition | Inclusion Criteria |
| :--- | :--- | :--- |
| **`BENIGN`** | Legitimate financial communication | Standard trade executions, dividend credits, mutual fund confirmations, and official SEBI investor safety circulars. |
| **`SUSPICIOUS`** | Unverified or high-risk solicitation | Unsolicited stock recommendations, pump-and-dump tips, aggressive advisory channels lacking verified registration details. |
| **`SCAM_LIKE`** | Active financial fraud or deception | Guarantees of fixed/high returns, advance withdrawal fees, OTP/MPIN credential harvesting, unauthorized APK installation links. |

### Task B: Scam Signal Multi-Label Classification (16 Signals)
1. `GUARANTEED_RETURN`: Promises of fixed/assured profits (e.g. "30% monthly return", "100% sure-shot").
2. `URGENCY`: Artificially pressurized deadlines (e.g. "pay within 10 minutes", "expires at 3:30 sharp").
3. `OTP_REQUEST`: Sensitive one-time password harvesting.
4. `PAYMENT_REQUEST`: Solicitation of bank transfers, UPI credits, or deposits.
5. `IMPERSONATION`: Unauthorized claims of affiliation with SEBI, RBI, NSE, BSE, or Government ministries.
6. `FAKE_REGISTRATION`: Fabricated broker certificates, registration claims, or institutional authorization.
7. `FAKE_APP`: Distribution of unverified APK files or sideloaded applications.
8. `UNKNOWN_APP`: Prompts to enable "install from unknown sources" or download non-store binaries.
9. `SUSPICIOUS_URL`: URL shorteners (`bit.ly`, `tinyurl.com`) or unauthorized redirect domains.
10. `REFERRAL_PRESSURE`: Multi-level recruitment schemes, binary matrix matrices, or downline bonuses.
11. `WITHDRAWAL_FEE`: Demands for clearance taxes, security deposits, or GST to release frozen profits.
12. `SOCIAL_PROOF`: Fabricated testimonials, insider accuracy claims (e.g. "99.4% accuracy", "over 10,000 members").
13. `EMOTIONAL_PRESSURE`: Threats of account freezing, police audit, or permanent balance forfeiture.
14. `INVESTMENT_SOLICITATION`: Overt solicitation to invest capital into unofficial pools or algorithms.
15. `PASSWORD_REQUEST`: Demands for trading platform login credentials or master passwords.
16. `PIN_REQUEST`: Requests for confidential MPINs, UPI PINs, or trading security codes.

---

## 4. Distribution Analysis

### Class Distribution
- **`SCAM_LIKE`**: 69 records (55.6%)
- **`BENIGN`**: 46 records (37.1%)
- **`SUSPICIOUS`**: 9 records (7.3%)
- **Total**: 124 records

### Language Distribution
- **English (`en`)**: 101 records (81.5%)
- **Hindi (`hi`)**: 12 records (9.7% - Devanagari script + Hinglish)
- **Telugu (`te`)**: 11 records (8.8% - Telugu script + Tenglish)

### Synthetic Data Ratio
- **Curated Real-World / Official Patterns**: 75%
- **Synthetic Multilingual Variants**: 25% (Devanagari and Telugu translations of verified threat vectors).

---

## 5. Preprocessing & Quality Assurance
Before splitting or model consumption, every record undergoes automated dataset validation (`ml/datasets/dataset_builder.py`):
1. **Empty / Short Text Guard**: Fails if text is empty or under 5 characters.
2. **Exact Duplicate Prevention**: MD5 hashing validates zero duplicate texts across the corpus.
3. **Near Duplicate Normalization**: Normalizes whitespace, character spacing, and punctuation.
4. **Contradiction Checking**: Ensures benign samples never contain aggressive signals like `OTP_REQUEST` or `WITHDRAWAL_FEE`.
5. **Quality Report Generated**: Persisted at `ml/datasets/dataset_quality_report.json`.

---

## 6. Split Strategy & Leakage Prevention (70 / 15 / 15)
- **Train Set**: 84 records (67.7%)
- **Validation Set**: 16 records (12.9%)
- **Holdout Test Set**: 24 records (19.4%)
- **Leakage Prevention Guarantee**: Records are partitioned using **Stratified Template Grouping**. All variations derived from the same base template remain strictly within a single partition.
- **Verification Result**:
  - `train_val_id_leak`: 0
  - `train_test_id_leak`: 0
  - `val_test_id_leak`: 0
  - `train_val_text_leak`: 0
  - `train_test_text_leak`: 0
  - `val_test_text_leak`: 0
  - **Leakage Detected**: `False` (Verified clean).
