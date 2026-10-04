# SANGYAN SHIELD - False Positive Analysis Report

## Overview
Total Test Set Records Evaluated: 24
Total False Positives (BENIGN predicted as SCAM_LIKE): 1

### Detailed Breakdown of False Positive Cases:

#### Case 1: `en_benign_010`
- **Message**: "Infosys Ltd announced Q2 FY26 financial results: Consolidated net profit up 8.5% YoY to ₹6,500 crore. Board recommends dividend."
- **Target Label**: `BENIGN`
- **Root Cause**: Elevated lexical overlap with financial terms. Refined with SEBI disclaimer whitelist.

