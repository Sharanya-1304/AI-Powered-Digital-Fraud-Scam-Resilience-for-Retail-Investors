"""
SANGYAN SHIELD - Data Cleaner & OCR Noise Remediation
Prepares raw strings, OCR extracted texts, social media posts, and chat transcripts
for downstream feature extraction and model inference.
"""

import re
from typing import Dict, List, Any
from ml.preprocessing.normalizer import normalize_text
from ml.preprocessing.language import detect_language

# URL regex pattern
URL_PATTERN = re.compile(
    r'(?:https?://|www\.)[^\s/$.?#].[^\s]*|'
    r'\b(?:bit\.ly|tinyurl\.com|t\.me|wa\.me|cutt\.ly|is\.gd|rb\.gy)/[a-zA-Z0-9_-]+\b',
    re.IGNORECASE
)

# Phone number regex
PHONE_PATTERN = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}\b')

# UPI ID pattern
UPI_PATTERN = re.compile(r'\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b')

# Common OCR noise artifacts
OCR_LINE_BREAK_FIX = re.compile(r'(\w+)-\s*\n\s*(\w+)')  # Hyphenated word break
OCR_BROKEN_WORDS = re.compile(r'\b([A-Za-z]+)\s+([A-Za-z]+)\b')


def extract_entities(text: str) -> Dict[str, List[str]]:
    """Extract URLs, phone numbers, and UPI handles before text cleaning."""
    urls = URL_PATTERN.findall(text)
    phones = PHONE_PATTERN.findall(text)
    upis = UPI_PATTERN.findall(text)
    return {
        "urls": list(set(urls)),
        "phones": list(set(phones)),
        "upis": list(set(upis))
    }


def clean_ocr_artifacts(text: str) -> str:
    """
    Cleans typical OCR noise from mobile screenshots:
    - Joins words broken across lines by hyphens
    - Normalizes pipe characters (|) often misread as 'I' or 'l'
    - Collapses consecutive newlines
    """
    if not text:
        return ""
    # Fix hyphenated words across lines
    cleaned = OCR_LINE_BREAK_FIX.sub(r'\1\2', text)
    # Replace stray OCR pipes that aren't markdown tables
    cleaned = re.sub(r'(?<=\w)\s*\|\s*(?=\w)', ' ', cleaned)
    # Collapse 3+ newlines into 2
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    return cleaned


def clean_text_pipeline(raw_text: str) -> Dict[str, Any]:
    """
    Complete pre-tokenization cleaning pipeline:
    1. Extracts raw entities (URLs, phones, UPIs)
    2. Removes OCR artifacts
    3. Normalizes unicode, deobfuscates spaced characters
    4. Detects language
    """
    raw_str = str(raw_text or "").strip()
    entities = extract_entities(raw_str)
    ocr_cleaned = clean_ocr_artifacts(raw_str)
    normalized = normalize_text(ocr_cleaned, preserve_case=False)
    lang_info = detect_language(ocr_cleaned)

    return {
        "raw_text": raw_str,
        "cleaned_text": normalized,
        "language": lang_info["language"],
        "language_confidence": lang_info["confidence"],
        "script": lang_info["script"],
        "entities": entities
    }
