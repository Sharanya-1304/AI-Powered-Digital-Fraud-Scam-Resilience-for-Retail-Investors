# SANGYAN SHIELD - False Negative Analysis Report

## Overview
Total Test Set Records Evaluated: 24
Total False Negatives (SCAM_LIKE predicted as BENIGN): 1

### Detailed Breakdown of Missed Cases:

#### Case 1: `te_scam_005` (Language: `te`)
- **Message**: "మీ 3 మంది స్నేహితులను ఆహ్వానించండి మరియు మీ క్రిప్టో ట్రేడింగ్ ఖాతాలో ప్రతిరోజూ ₹3,000 బోనస్ పొందండి."
- **Target Signals**: `['REFERRAL_PRESSURE', 'INVESTMENT_SOLICITATION']`
- **Root Cause Analysis**: Highly novel vocabulary or subtle phrasing without overt scam keywords.
- **Deterministic Safety Rule Catch**: Rule engine provides authoritative fallback for verified URL/pattern flags.

## Hybrid Fallback Defense
As mandated by Section 13 & 14 of the ML Specification, SANGYAN SHIELD implements an ensemble architecture where deterministic safety rules and URL reputation run parallel to the ML model. Even if ML probability is low, safety-critical credential triggers (e.g. OTP, MPIN requests) remain fully visible to the user.
