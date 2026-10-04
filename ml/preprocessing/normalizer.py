"""
SANGYAN SHIELD - Text Normalization and De-obfuscation Engine
Handles unicode canonicalization, adversarial spacing, character-level punctuation
obfuscation (e.g. 'g.u.a.r.a.n.t.e.e.d', 'G U A R A N T E E D'), currency normalization,
and Indic script standardizations.
"""

import re
import unicodedata
from typing import Tuple

# Pattern for single spaced letters like "G U A R A N T E E D" or "O T P"
SPACED_LETTERS_PATTERN = re.compile(r'\b([A-Za-z])(?:\s+([A-Za-z]))+(?:\s+([A-Za-z]))*\b')

# Pattern for punctuation-delimited letters like "g.u.a.r.a.n.t.e.e.d" or "o-t-p"
PUNCT_LETTERS_PATTERN = re.compile(r'\b([A-Za-z])(?:[.\-_*~]([A-Za-z]))+\b')

# Common Indian currency representations
CURRENCY_PATTERNS = [
    (re.compile(r'(?i)\brs\.?\s*(\d+)'), r'₹\1'),
    (re.compile(r'(?i)\binr\s*(\d+)'), r'₹\1'),
    (re.compile(r'(?i)\brupees\s*(\d+)'), r'₹\1'),
]

# Multiple exclamation/question marks
EXCESSIVE_PUNCT = re.compile(r'([!?.]){2,}')


def deobfuscate_spaced_text(text: str) -> str:
    """
    Collapses spaced or punctuation-separated letters deliberately inserted to bypass NLP.
    Examples:
        'G U A R A N T E E D' -> 'GUARANTEED'
        'g.u.a.r.a.n.t.e.e.d' -> 'guaranteed'
        'O - T - P' -> 'OTP'
    """
    def _punct_replacer(match: re.Match) -> str:
        s = match.group(0)
        # Remove separators like '.', '-', '_', '*', '~'
        return re.sub(r'[.\-_*~]', '', s)

    # 1. Punctuation delimited
    cleaned = PUNCT_LETTERS_PATTERN.sub(_punct_replacer, text)
    
    # 2. Space delimited letters (only collapse if sequence is 3 or more chars, or is 'O T P')
    def _space_replacer(match: re.Match) -> str:
        chars = match.group(0).split()
        joined = "".join(chars)
        # If short like 'a b', keep as is, unless it's known scam keyword like 'otp'
        if len(joined) >= 3 or joined.upper() in {"OTP", "PIN", "APK", "VIP", "KYC"}:
            return joined
        return match.group(0)

    cleaned = SPACED_LETTERS_PATTERN.sub(_space_replacer, cleaned)
    return cleaned


def normalize_text(text: str, preserve_case: bool = False) -> str:
    """
    Standardizes input text for reproducible ML processing and adversarial resilience.
    """
    if not text:
        return ""

    # 1. Unicode NFKC normalization (replaces zero-width spaces, decomposes ligatures)
    normalized = unicodedata.normalize("NFKC", text)

    # 2. Strip non-printable / control characters (except common whitespace)
    normalized = "".join(ch for ch in normalized if unicodedata.category(ch)[0] != "C" or ch in "\n\t ")

    # 3. Deobfuscate adversarial character spacing
    normalized = deobfuscate_spaced_text(normalized)

    # 4. Standardize Indian currency representations
    for pat, repl in CURRENCY_PATTERNS:
        normalized = pat.sub(repl, normalized)

    # 5. Compress duplicate exclamation/question marks to single token with whitespace
    normalized = EXCESSIVE_PUNCT.sub(r' \1 ', normalized)

    # 6. Normalize whitespace
    normalized = re.sub(r'[ \t]+', ' ', normalized).strip()

    if not preserve_case:
        normalized = normalized.lower()

    return normalized
