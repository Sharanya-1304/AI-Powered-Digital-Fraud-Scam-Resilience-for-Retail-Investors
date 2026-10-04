"""
SANGYAN SHIELD - Backend ML Service
Mandated by Prompt Section 37:
Exposes a clean interface: `analyze_text(text)` returning structured detection results.
Includes defensive fallback (Section 38): if the ML model fails or artifacts are unavailable,
does NOT crash the application, but returns structured degradation info allowing deterministic
safety rules and URL analyzers to continue operating smoothly.
"""

import os
import sys

# Ensure workspace root is on sys.path so ml module can be imported anywhere
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from typing import Dict, Any
from ml.inference.predictor import SangyanScamPredictor

_predictor_instance = None


def get_ml_predictor() -> SangyanScamPredictor:
    """Singleton getter for the production ML predictor."""
    global _predictor_instance
    if _predictor_instance is None:
        # Resolve path to ml/artifacts
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        artifacts_dir = os.path.join(base_dir, "ml", "artifacts")
        _predictor_instance = SangyanScamPredictor(artifacts_dir=artifacts_dir)
    return _predictor_instance


def analyze_text(text: str) -> Dict[str, Any]:
    """
    Standard service interface for analyzing digital content.
    Returns structured results adhering to Prompt Section 1 & 50:
    {
      "available": True,
      "model": {"name": "...", "version": "..."},
      "classification": {"label": "...", "confidence": 0.87, "uncertainty": 0.12},
      "signals": [
        {"type": "...", "confidence": 0.96, "evidence": "...", "start": 0, "end": 20}
      ]
    }
    """
    try:
        predictor = get_ml_predictor()
        return predictor.predict(text)
    except Exception as e:
        # Graceful degradation fallback (Section 38)
        return {
            "available": False,
            "error": str(e),
            "model": {
                "name": "sangyan-scam-classifier",
                "version": "1.0.0",
                "status": f"ML unavailable ({str(e)}). Rule-based safety checks are still active."
            },
            "classification": {
                "label": "SUSPICIOUS",
                "confidence": 0.50,
                "uncertainty": 1.0,
                "class_probabilities": {"BENIGN": 0.33, "SUSPICIOUS": 0.34, "SCAM_LIKE": 0.33}
            },
            "signals": [],
            "metadata": {
                "fallback_active": True
            }
        }
