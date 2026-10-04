"""
SANGYAN SHIELD - Multilingual Language Detection Module
Identifies English ('en'), Hindi ('hi'), and Telugu ('te') across
native Indic scripts (Devanagari, Telugu) and romanized transliterations (Hinglish, Tenglish).
"""

import re
from typing import Dict, Any

# Unicode Ranges
DEVANAGARI_RANGE = re.compile(r'[\u0900-\u097F]')
TELUGU_RANGE = re.compile(r'[\u0C00-\u0C7F]')

# Common Romanized Hindi (Hinglish) Keywords
HINGLISH_LEXICON = {
    'paisa', 'paise', 'karo', 'kare', 'karna', 'milega', 'kamaye', 'kamana', 
    'munafa', 'bhejo', 'khata', 'aaj', 'turant', 'yojana', 'dhan', 'bachat',
    'bharo', 'jeet', 'laabh', 'rupaya', 'rupaye', 'shuru', 'bhejiye', 'dekho'
}

# Common Romanized Telugu (Tenglish) Keywords
TENGLISH_LEXICON = {
    'dabbulu', 'dabbu', 'petandi', 'pettandi', 'randi', 'chuskondi', 'chudandi', 
    'laabham', 'labham', 'raabadi', 'tvaraga', 'ippude', 'katha', 'pampandi',
    'avasaram', 'avakasam', 'gelavandi', 'sampadinchandi'
}


def detect_language(text: str) -> Dict[str, Any]:
    """
    Detect the primary language of the input financial text.
    
    Returns:
        Dict with keys:
            - 'language': 'en' | 'hi' | 'te'
            - 'confidence': float (0.0 to 1.0)
            - 'script': 'latin' | 'devanagari' | 'telugu' | 'mixed'
    """
    if not text or not text.strip():
        return {"language": "en", "confidence": 1.0, "script": "latin"}

    clean_text = text.strip()
    total_chars = len(clean_text)
    
    devanagari_chars = len(DEVANAGARI_RANGE.findall(clean_text))
    telugu_chars = len(TELUGU_RANGE.findall(clean_text))
    
    devanagari_ratio = devanagari_chars / max(total_chars, 1)
    telugu_ratio = telugu_chars / max(total_chars, 1)
    
    # 1. Native script detection (high confidence)
    if devanagari_ratio > 0.15:
        confidence = min(0.70 + (devanagari_ratio * 0.30), 0.99)
        return {"language": "hi", "confidence": round(confidence, 3), "script": "devanagari"}
        
    if telugu_ratio > 0.15:
        confidence = min(0.70 + (telugu_ratio * 0.30), 0.99)
        return {"language": "te", "confidence": round(confidence, 3), "script": "telugu"}

    # 2. Check for Romanized Transliteration (Hinglish / Tenglish)
    words = [w.lower().strip(".,!?:;\"'()[]{}₹") for w in clean_text.split() if len(w) > 2]
    if words:
        hinglish_matches = sum(1 for w in words if w in HINGLISH_LEXICON)
        tenglish_matches = sum(1 for w in words if w in TENGLISH_LEXICON)
        
        hinglish_ratio = hinglish_matches / len(words)
        tenglish_ratio = tenglish_matches / len(words)
        
        if hinglish_matches >= 2 or hinglish_ratio >= 0.12:
            return {
                "language": "hi",
                "confidence": round(min(0.65 + (hinglish_ratio * 0.35), 0.95), 3),
                "script": "latin-hinglish"
            }
            
        if tenglish_matches >= 2 or tenglish_ratio >= 0.12:
            return {
                "language": "te",
                "confidence": round(min(0.65 + (tenglish_ratio * 0.35), 0.95), 3),
                "script": "latin-tenglish"
            }

    # 3. Default to English (Latin script)
    return {"language": "en", "confidence": 0.92, "script": "latin"}
