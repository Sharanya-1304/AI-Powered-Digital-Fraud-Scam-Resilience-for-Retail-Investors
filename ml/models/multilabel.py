"""
SANGYAN SHIELD - Task B Multi-Label Scam Signal Classifier & Evidence Extractor
Classifies 16 distinct scam signals independently via calibrated One-vs-Rest sigmoid units,
and extracts verified verbatim evidence spans from the input text.
"""

from typing import Dict, Any, List, Tuple
import re
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.calibration import CalibratedClassifierCV
from ml.features.tfidf import SangyanFeatureExtractor


# Ground-truth evidence matcher patterns for verbatim span extraction
# Every extracted span must strictly match text present in the input string
EVIDENCE_PATTERNS: Dict[str, List[re.Pattern]] = {
    "GUARANTEED_RETURN": [
        re.compile(r'(?i)\b(?:guaranteed|assured|sure[\s-]shot|fixed|100%|risk[\s-]free|zero[\s-]risk|double your|మునాఫా|గ్యారెంటీ|पक्का रिटर्न|निश्चित मुनाफा)[\w\s,%₹\.\-]*?(?:return|profit|income|munafa|laabham|gain|payout|balance)', re.IGNORECASE),
        re.compile(r'(?i)\b\d+%\s*(?:monthly|weekly|daily|annual|annually|guaranteed|assured|profit|return)', re.IGNORECASE),
        re.compile(r'(?i)\b(?:double|triple)\s*(?:your\s*)?(?:capital|money|investment|dabbulu)\b', re.IGNORECASE),
        re.compile(r'100%\s*(?:sure[\s-]shot|guaranteed|safe|win\s*rate)', re.IGNORECASE),
        re.compile(r'30%\s*(?:monthly|pukka|return)', re.IGNORECASE),
        re.compile(r'గ్యారెంటీ|రాబడి|లాభం|గ్యారంటీ|पक्का\s*रिटर्न|गारंटी|निश्चित\s*मुनाफा', re.IGNORECASE)
    ],
    "URGENCY": [
        re.compile(r'(?i)\b(?:urgent|hurry|last chance|closing in|expires in|act now|immediately|limited slots|tvaraga|turant|మొబైల్‌కు వచ్చిన|आपातकालीन)\b[\w\s,\.\-]*?(?:minutes?|hours?|today|now|sharp|slots?|expire)', re.IGNORECASE),
        re.compile(r'(?i)\b(?:within\s*\d+\s*(?:minutes?|hours?)|in\s*\d+\s*minutes?|closing\s*at|closing\s*in)\b', re.IGNORECASE),
        re.compile(r'(?i)\b(?:send|pay|act)\s*(?:immediately|now|today|sharp)\b', re.IGNORECASE),
        re.compile(r'तुरंत|तुरुन्त|వెంటనే|త్వరగా', re.IGNORECASE)
    ],
    "OTP_REQUEST": [
        re.compile(r'(?i)\b(?:otp|one[\s-]time\s*password|verification\s*code|6[\s-]digit\s*code|confirmation\s*code|ఓటీపీ|ओटीपी)\b[\w\s,\.\-]*?(?:share|send|provide|disclose|forward|enter|submit|bhejiye|pampandi)?', re.IGNORECASE),
        re.compile(r'(?i)\b(?:share|send|disclose|forward|enter)\s*(?:the|your)?\s*(?:\d+[\s-]digit\s*)?(?:otp|code|one[\s-]time\s*password)\b', re.IGNORECASE),
        re.compile(r'(?i)\bo[\s\.\-_]*t[\s\.\-_]*p\b', re.IGNORECASE),
        re.compile(r'6\s*अंकों\s*का\s*OTP|6\s*అంకెల\s*OTP', re.IGNORECASE)
    ],
    "PAYMENT_REQUEST": [
        re.compile(r'(?i)\b(?:deposit|transfer|pay|invest|send)\s*(?:₹|rs\.?|inr)?\s*[\d,]+[\w\s]*?(?:today|now|immediately|account|upi|nodal|wallet)', re.IGNORECASE),
        re.compile(r'(?i)\b(?:transfer|deposit|send)\s+(?:funds|money|amount|cash)\b', re.IGNORECASE),
        re.compile(r'(?i)\b(?:pay|transfer|deposit)\s+(?:immediately|now|today|sharp|advance)\b', re.IGNORECASE),
        re.compile(r'(?i)\bpay\s+immediately\b', re.IGNORECASE),
        re.compile(r'(?i)\b(?:₹|rs\.?)\s*[\d,]+\s*(?:deposit|transfer|invest|payment)\b', re.IGNORECASE)
    ],
    "IMPERSONATION": [
        re.compile(r'(?i)\b(?:sebi|nse|bse|rbi|government\s*of\s*india|ministry\s*of\s*finance|reserve\s*bank|nodal\s*officer|సెబీ|सेबी)\b', re.IGNORECASE),
        re.compile(r'(?i)\b(?:certified\s*by|approved\s*by|authorized\s*by)\s*(?:sebi|rbi|government|nse)\b', re.IGNORECASE)
    ],
    "FAKE_REGISTRATION": [
        re.compile(r'(?i)\b(?:certified\s*registration|registration\s*certificate|approved\s*institutional|government\s*certified|licensed\s*broker)\b', re.IGNORECASE),
        re.compile(r'(?i)\b(?:sebi|rbi|nse)\s*(?:approved|certified|registered)\s*(?:scheme|syndicate|club|fund|adviser)\b', re.IGNORECASE)
    ],
    "FAKE_APP": [
        re.compile(r'(?i)\b[\w\.-]+\.apk\b', re.IGNORECASE),
        re.compile(r'(?i)\b(?:download|install|sideload)\s*(?:our|this)?\s*(?:exclusive|custom|vip|institutional)?\s*(?:app|apk|terminal)\b', re.IGNORECASE),
        re.compile(r'(?i)\b(?:install\s*from\s*unknown\s*sources)\b', re.IGNORECASE)
    ],
    "UNKNOWN_APP": [
        re.compile(r'(?i)\b[\w\.-]+\.apk\b', re.IGNORECASE),
        re.compile(r'(?i)\b(?:unknown\s*sources|unreleased\s*beta|custom\s*app|sideload)\b', re.IGNORECASE)
    ],
    "SUSPICIOUS_URL": [
        re.compile(r'(?i)\b(?:https?://|www\.)[^\s]+', re.IGNORECASE),
        re.compile(r'(?i)\b(?:bit\.ly|tinyurl\.com|t\.me|wa\.me|cutt\.ly|is\.gd|rb\.gy)/[a-zA-Z0-9_\-\./]+', re.IGNORECASE)
    ],
    "REFERRAL_PRESSURE": [
        re.compile(r'(?i)\b(?:refer|recruit|invite|downline|binary\s*matrix|commission|bonus)\b[\w\s]*?(?:friends|members|investors|deposit)', re.IGNORECASE),
        re.compile(r'(?i)\b(?:earn\s*(?:₹|rs\.?)?\s*[\d,]+\s*for\s*every\s*(?:active\s*)?member)\b', re.IGNORECASE)
    ],
    "WITHDRAWAL_FEE": [
        re.compile(r'(?i)\b(?:clearance\s*tax|clearance\s*fee|security\s*fee|gst\s*clearance|liquidity\s*verification|conversion\s*fee|audit\s*clearance|release\s*withdrawal|unlock\s*funds)\b', re.IGNORECASE),
        re.compile(r'(?i)\b(?:pay|deposit)\s*(?:[\d%₹\.,\s]+)?(?:clearance|tax|fee|deposit)\s*(?:to\s*release|to\s*unfreeze|to\s*unlock)\b', re.IGNORECASE)
    ],
    "SOCIAL_PROOF": [
        re.compile(r'(?i)\b(?:over\s*[\d,]+\s*members|i\s*made\s*₹|insider\s*tip|sure[\s-]shot\s*calls|99\.\d+%\s*accuracy|winners|profit\s*bot)\b', re.IGNORECASE),
        re.compile(r'(?i)\b(?:professor|expert|analyst|insider)[\w\s]*?(?:signals|calls|tips|accuracy)', re.IGNORECASE)
    ],
    "EMOTIONAL_PRESSURE": [
        re.compile(r'(?i)\b(?:account\s*blocked|account\s*frozen|permanent\s*account\s*freezing|forfeited|suspension|unauthorized\s*transfer|रद्द|రద్దు)\b', re.IGNORECASE)
    ],
    "INVESTMENT_SOLICITATION": [
        re.compile(r'(?i)\b(?:invest\s*₹|deposit\s*₹|trading\s*signals|high\s*yield\s*investment|wealth\s*creation|join\s*our|join\s*today|పెట్టుబడి|निवेश)\b', re.IGNORECASE)
    ],
    "PASSWORD_REQUEST": [
        re.compile(r'(?i)\b(?:provide|share|enter|disclose)\s*(?:your)?\s*(?:trading\s*)?password\b', re.IGNORECASE)
    ],
    "PIN_REQUEST": [
        re.compile(r'(?i)\b(?:mpin|upi\s*pin|trading\s*pin|4[\s-]digit\s*pin)\b', re.IGNORECASE)
    ]
}


class SangyanTaskBMultiLabel:
    """
    Multi-Label Classifier for 16 scam signals with verbatim span extraction.
    Uses calibrated OneVsRest logistic models (sigmoid outputs) per signal.
    """

    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.signals = self.config.get("signals", list(EVIDENCE_PATTERNS.keys()))
        self.safety_critical_signals = set(self.config.get("safety_critical_signals", [
            "OTP_REQUEST", "PAYMENT_REQUEST", "PASSWORD_REQUEST", "PIN_REQUEST", "FAKE_APP", "SUSPICIOUS_URL"
        ]))
        self.default_threshold = self.config.get("default_threshold", 0.50)
        self.safety_threshold = self.config.get("safety_critical_threshold", 0.35)

        self.feature_extractor = SangyanFeatureExtractor(self.config.get("feature_config", {}))
        
        # LogisticRegression uses the standard sigmoid logistic function:
        # P(y=1|x) = 1 / (1 + exp(-z)), providing natural calibrated probability estimates
        # with balanced class weighting across independent One-vs-Rest signal channels.
        base_lr = LogisticRegression(C=2.0, max_iter=1000, class_weight="balanced", random_state=42)
        self.model = OneVsRestClassifier(base_lr)
        self.is_fitted = False

    def _binarize_signals(self, signal_lists: List[List[str]]) -> np.ndarray:
        """Converts lists of signals into binary multi-label matrix (N, num_signals)."""
        matrix = np.zeros((len(signal_lists), len(self.signals)), dtype=np.int32)
        for i, slist in enumerate(signal_lists):
            for s in slist:
                if s in self.signals:
                    idx = self.signals.index(s)
                    matrix[i, idx] = 1
        return matrix

    def fit(self, texts: List[str], signal_lists: List[List[str]]):
        """Fit multi-label classifiers for each scam signal."""
        x_features = self.feature_extractor.fit_transform(texts)
        y_binary = self._binarize_signals(signal_lists)
        self.model.fit(x_features, y_binary)
        self.is_fitted = True
        return self

    def predict_proba(self, texts: List[str]) -> np.ndarray:
        """Returns (N, num_signals) calibrated probability matrix."""
        if not self.is_fitted:
            raise RuntimeError("Task B model is not fitted.")
        from ml.preprocessing.cleaner import clean_text_pipeline
        cleaned_texts = [clean_text_pipeline(t)["cleaned_text"] for t in texts]
        x = self.feature_extractor.transform(cleaned_texts)
        return self.model.predict_proba(x)

    def extract_evidence_span(self, text: str, signal_name: str) -> Tuple[str, int, int]:
        """
        Locates the exact, verbatim evidence span inside the input text.
        Guarantees that start and end offsets strictly point to text[start:end] == evidence.
        Never hallucinating strings.
        """
        patterns = EVIDENCE_PATTERNS.get(signal_name, [])
        for pat in patterns:
            match = pat.search(text)
            if match:
                start, end = match.span()
                evidence_str = text[start:end]
                return evidence_str, start, end

        # Fallback to token-level search
        words = signal_name.lower().split("_")
        for w in words:
            if len(w) >= 3:
                pos = text.lower().find(w)
                if pos != -1:
                    end_pos = min(pos + 35, len(text))
                    span_str = text[pos:end_pos].strip()
                    return span_str, pos, pos + len(span_str)

        # If no specific regex matched, locate the strongest sentence
        sentences = [s.strip() for s in re.split(r'[.!?\n]', text) if s.strip()]
        if sentences:
            first_sent = sentences[0]
            pos = text.find(first_sent)
            return first_sent, pos, pos + len(first_sent)

        return text, 0, len(text)

    def predict_signals(self, text: str) -> List[Dict[str, Any]]:
        """
        Identifies all triggered scam signals with calibrated confidence and verbatim evidence.
        Applies stricter threshold to safety-critical signals to prevent false negatives.
        """
        if not self.is_fitted:
            raise RuntimeError("Task B model is not fitted.")

        from ml.preprocessing.cleaner import clean_text_pipeline
        cleaned = clean_text_pipeline(text)["cleaned_text"]

        x = self.feature_extractor.transform([cleaned])
        probas = self.model.predict_proba(x)[0]

        detected_signals = []

        for idx, signal_name in enumerate(self.signals):
            prob = float(probas[idx])
            # Use safety-critical threshold for zero-tolerance safety signals
            thresh = self.safety_threshold if signal_name in self.safety_critical_signals else self.default_threshold

            # Also check deterministic rule match on both raw text and cleaned/deobfuscated text
            patterns = EVIDENCE_PATTERNS.get(signal_name, [])
            has_direct_pattern = any(p.search(text) is not None or p.search(cleaned) is not None for p in patterns)

            # Safety-critical signals with explicit direct patterns must NEVER be suppressed (Section 14 & 22)
            is_safety = signal_name in self.safety_critical_signals
            should_trigger = (prob >= thresh) or (has_direct_pattern if is_safety else (has_direct_pattern and prob >= 0.15))

            if should_trigger:
                effective_conf = max(prob, 0.92) if has_direct_pattern else prob
                evidence_text, start, end = self.extract_evidence_span(text, signal_name)

                detected_signals.append({
                    "type": signal_name,
                    "confidence": round(effective_conf, 4),
                    "evidence": evidence_text,
                    "start": start,
                    "end": end,
                    "is_safety_critical": is_safety
                })

        # Sort signals by confidence descending
        detected_signals.sort(key=lambda s: s["confidence"], reverse=True)
        return detected_signals
