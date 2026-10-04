"""
SANGYAN SHIELD - Hybrid Feature Extraction Pipeline
Combines TF-IDF n-grams (1-3 grams) with engineered domain-specific cybersecurity & linguistic features.
"""

import re
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler

URGENCY_TERMS = {
    "urgent", "hurry", "today", "now", "expire", "expires", "fast",
    "instant", "immediately", "limited", "slots", "last", "chance", "quick"
}

GUARANTEE_TERMS = {
    "guaranteed", "guarantee", "assured", "assure", "fixed", "100%", "risk-free",
    "riskfree", "zero", "double", "triple", "multiply", "sure-shot", "sureshot"
}

CREDENTIAL_TERMS = {
    "otp", "password", "pin", "mpin", "cvv", "code", "verification",
    "suspended", "suspend", "blocked", "block", "freeze", "frozen"
}

PAYMENT_TERMS = {
    "pay", "transfer", "deposit", "upi", "gpay", "phonepe", "paytm",
    "fee", "tax", "clearance", "nodal", "wallet", "usdt"
}

class DomainFeatureExtractor(BaseEstimator, TransformerMixin):
    """
    Extracts high-signal domain features engineered specifically for financial fraud detection.
    """
    def __init__(self):
        self.feature_names = [
            "urgency_intensity",
            "guarantee_intensity",
            "credential_intensity",
            "payment_intensity",
            "apk_indicator",
            "capital_ratio",
            "exclamation_density",
            "currency_symbol_density",
            "contact_handle_indicator",
            "character_length_scaled",
        ]

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        features = []
        for text in X:
            t_lower = text.lower()
            tokens = set(re.findall(r"\b\w+\b", t_lower))
            char_len = max(len(text), 1)
            token_count = max(len(tokens), 1)

            # 1. Linguistic domain counts
            urgency_score = sum(1 for term in URGENCY_TERMS if term in tokens or term in t_lower)
            guarantee_score = sum(1 for term in GUARANTEE_TERMS if term in tokens or term in t_lower)
            credential_score = sum(1 for term in CREDENTIAL_TERMS if term in tokens or term in t_lower)
            payment_score = sum(1 for term in PAYMENT_TERMS if term in tokens or term in t_lower)

            # 2. Binary indicators
            has_apk = 1.0 if any(k in t_lower for k in [".apk", "apk", "sideload", "unknown sources"]) else 0.0
            has_contact = 1.0 if any(k in t_lower for k in ["whatsapp", "telegram", "@", "+91-", "+91"]) else 0.0

            # 3. Stylistic & structural indicators
            caps_count = sum(1 for c in text if c.isupper())
            caps_ratio = caps_count / char_len
            exclamation_count = text.count("!") / max(len(text) / 50.0, 1.0)
            currency_count = sum(text.count(sym) for sym in ["₹", "$", "inr", "usdt", "rs."]) / max(len(text) / 50.0, 1.0)
            length_norm = min(char_len / 200.0, 2.0)

            features.append([
                urgency_score / token_count,
                guarantee_score / token_count,
                credential_score / token_count,
                payment_score / token_count,
                has_apk,
                caps_ratio,
                exclamation_count,
                currency_count,
                has_contact,
                length_norm,
            ])

        return np.array(features, dtype=np.float32)

    def get_feature_names_out(self, input_features=None):
        return np.array(self.feature_names)

def create_hybrid_feature_pipeline() -> FeatureUnion:
    """
    Creates a FeatureUnion combining subword/word TF-IDF n-grams with scaled domain features.
    """
    tfidf_pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 3),
            max_features=2500,
            sublinear_tf=True,
            token_pattern=r"(?u)\b\w+\b",
            min_df=1
        ))
    ])

    domain_pipeline = Pipeline([
        ("domain", DomainFeatureExtractor()),
        ("scaler", StandardScaler(with_mean=False))
    ])

    hybrid_union = FeatureUnion([
        ("tfidf_features", tfidf_pipeline),
        ("domain_features", domain_pipeline)
    ])

    return hybrid_union
