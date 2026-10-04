"""
SANGYAN SHIELD - Machine Learning Inference Engine
Loads calibrated model pipeline and provides real-time, explainable scam probability predictions.
"""

import os
import re
import json
import joblib
from typing import Dict, Any, List
from pydantic import BaseModel
from app.ml.feature_extractor import URGENCY_TERMS, GUARANTEE_TERMS, CREDENTIAL_TERMS, PAYMENT_TERMS

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "model.joblib")
METRICS_PATH = os.path.join(ARTIFACTS_DIR, "metrics.json")

class ContributingFeature(BaseModel):
    feature: str
    category: str
    weight: float

class MLInferenceResult(BaseModel):
    scam_probability: float  # Calibrated probability between 0.0 and 1.0
    predicted_label: str     # "SCAM_SOLICITATION" or "BENIGN_FINANCIAL"
    confidence_level: str    # "High Confidence", "Moderate", "Indicative"
    model_architecture: str
    top_contributing_features: List[ContributingFeature]
    linguistic_summary: Dict[str, Any]

_CACHED_MODEL = None
_CACHED_METRICS = None

def get_or_load_model():
    global _CACHED_MODEL, _CACHED_METRICS
    if _CACHED_MODEL is not None:
        return _CACHED_MODEL, _CACHED_METRICS

    if not os.path.exists(MODEL_PATH):
        # Auto-train if artifacts not present
        from app.ml.trainer import train_and_evaluate_model
        train_and_evaluate_model(ARTIFACTS_DIR)

    _CACHED_MODEL = joblib.load(MODEL_PATH)

    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            _CACHED_METRICS = json.load(f)
    else:
        _CACHED_METRICS = {"model_architecture": "CalibratedLogisticRegression"}

    return _CACHED_MODEL, _CACHED_METRICS

def predict_scam_ml(text: str) -> MLInferenceResult:
    """
    Executes real machine learning inference on input text.
    Returns calibrated probability and instance-level feature explainability.
    """
    model, metrics = get_or_load_model()

    # Predict calibrated probability
    probas = model.predict_proba([text])[0]
    scam_prob = float(probas[1])

    # Instance-level linguistic breakdown
    t_lower = text.lower()
    tokens = set(re.findall(r"\b\w+\b", t_lower))
    char_len = max(len(text), 1)

    matched_urgency = [t for t in URGENCY_TERMS if t in tokens or t in t_lower]
    matched_guarantee = [t for t in GUARANTEE_TERMS if t in tokens or t in t_lower]
    matched_credential = [t for t in CREDENTIAL_TERMS if t in tokens or t in t_lower]
    matched_payment = [t for t in PAYMENT_TERMS if t in tokens or t in t_lower]

    caps_ratio = sum(1 for c in text if c.isupper()) / char_len

    # Identify contributing features from model metadata
    top_indicators = metrics.get("explainability", {}).get("top_scam_indicators", [])
    contributing: List[ContributingFeature] = []

    for item in top_indicators:
        feat = item["feature"]
        if feat in t_lower:
            contributing.append(ContributingFeature(
                feature=feat,
                category="n-gram signal",
                weight=item["weight"]
            ))

    # Add linguistic features if triggered
    if matched_guarantee:
        contributing.append(ContributingFeature(
            feature=f"Guaranteed vocabulary: {', '.join(matched_guarantee[:2])}",
            category="domain heuristic",
            weight=1.85
        ))
    if matched_credential:
        contributing.append(ContributingFeature(
            feature=f"Credential solicitation: {', '.join(matched_credential[:2])}",
            category="domain heuristic",
            weight=2.40
        ))
    if matched_urgency:
        contributing.append(ContributingFeature(
            feature=f"High urgency terms: {', '.join(matched_urgency[:2])}",
            category="domain heuristic",
            weight=1.20
        ))

    # Determine confidence level
    if scam_prob >= 0.80 or scam_prob <= 0.15:
        confidence = "High Confidence"
    elif scam_prob >= 0.60 or scam_prob <= 0.35:
        confidence = "Moderate"
    else:
        confidence = "Indicative"

    label = "SCAM_SOLICITATION" if scam_prob >= 0.50 else "BENIGN_FINANCIAL"

    return MLInferenceResult(
        scam_probability=round(scam_prob, 4),
        predicted_label=label,
        confidence_level=confidence,
        model_architecture=metrics.get("model_architecture", "CalibratedClassifier"),
        top_contributing_features=contributing[:6],
        linguistic_summary={
            "matched_urgency_terms": matched_urgency,
            "matched_guarantee_terms": matched_guarantee,
            "matched_credential_terms": matched_credential,
            "matched_payment_terms": matched_payment,
            "capitalization_ratio": round(caps_ratio, 3),
            "text_length": len(text)
        }
    )
