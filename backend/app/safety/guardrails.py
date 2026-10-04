import re

PROHIBITED_ADVICE_PATTERNS = [
    r"(?i)\b(buy|sell|hold)\b\s+(shares|stocks|calls|puts|options|crypto|target)",
    r"(?i)\btarget price\b",
    r"(?i)\bprice prediction\b",
    r"(?i)\bguaranteed returns?\b",
    r"(?i)\bmultibagger stock\b",
    r"(?i)\binvest in\b\s+[A-Za-z0-9]+",
]

def apply_safety_guardrails(explanation_text: str) -> str:
    """
    Enforces Section 41: Detect and reject investment advice, buy/sell calls, or price predictions.
    """
    for pat in PROHIBITED_ADVICE_PATTERNS:
        if re.search(pat, explanation_text):
            return "This tool does not provide investment recommendations. It only analyzes potential scam and safety signals."
    return explanation_text
