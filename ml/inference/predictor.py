"""
SANGYAN SHIELD - Production ML Inference Predictor
Combines Task A (Overall Content Classification) and Task B (Multi-Label Signals & Evidence Spans)
into a unified, calibrated, explainable, and defensive prediction engine.
"""

import os
import json
import joblib
from typing import Dict, Any, List, Optional
from ml.preprocessing.cleaner import clean_text_pipeline


class SangyanScamPredictor:
    """
    Production inference engine for SANGYAN SHIELD fraud and scam resilience.
    Loads trained Task A (3-class) and Task B (16-signal multi-label) artifacts.
    Provides graceful degradation if models are unavailable.
    """

    def __init__(self, artifacts_dir: str = "ml/artifacts"):
        self.artifacts_dir = artifacts_dir
        self.is_loaded = False
        self.task_a_model = None
        self.task_b_model = None
        self.metadata = {
            "name": "sangyan-scam-classifier",
            "version": "1.0.0",
            "status": "UNLOADED"
        }
        self._load_artifacts()

    def _load_artifacts(self):
        try:
            task_a_path = os.path.join(self.artifacts_dir, "task_a_classifier.joblib")
            task_b_path = os.path.join(self.artifacts_dir, "task_b_multilabel.joblib")
            meta_path = os.path.join(self.artifacts_dir, "model_metadata.json")

            if os.path.exists(task_a_path) and os.path.exists(task_b_path):
                self.task_a_model = joblib.load(task_a_path)
                self.task_b_model = joblib.load(task_b_path)
                if os.path.exists(meta_path):
                    with open(meta_path, "r", encoding="utf-8") as f:
                        loaded_meta = json.load(f)
                        self.metadata.update(loaded_meta)
                self.metadata["status"] = "ACTIVE"
                self.is_loaded = True
            else:
                self.metadata["status"] = "UNAVAILABLE"
                self.is_loaded = False
        except Exception as e:
            self.metadata["status"] = f"ERROR: {str(e)}"
            self.is_loaded = False

    def predict(self, text: str) -> Dict[str, Any]:
        """
        Main inference entrypoint:
        1. Preprocessing, entity extraction, and language detection
        2. Task A 3-class classification with calibrated confidence and uncertainty
        3. Task B multi-label scam signal detection with verbatim evidence span offsets
        4. Graceful fallback on error or missing models (Section 38)
        """
        raw_input = str(text or "").strip()
        if not raw_input:
            return {
                "available": True,
                "model": {"name": self.metadata.get("model_name", "sangyan-scam-classifier"), "version": self.metadata.get("version", "1.0.0")},
                "classification": {
                    "label": "BENIGN",
                    "confidence": 1.0,
                    "uncertainty": 0.0,
                    "class_probabilities": {"BENIGN": 1.0, "SUSPICIOUS": 0.0, "SCAM_LIKE": 0.0}
                },
                "signals": [],
                "metadata": {
                    "language": "en",
                    "language_confidence": 1.0,
                    "entities": {"urls": [], "phones": [], "upis": []}
                }
            }

        # Preprocessing & Language Detection
        prep = clean_text_pipeline(raw_input)

        if not self.is_loaded or self.task_a_model is None or self.task_b_model is None:
            # Graceful degradation fallback (Section 38)
            return {
                "available": False,
                "model": {
                    "name": self.metadata.get("model_name", "sangyan-scam-classifier"),
                    "version": self.metadata.get("version", "1.0.0"),
                    "status": "ML unavailable. Rule-based safety checks are still active."
                },
                "classification": {
                    "label": "SUSPICIOUS",
                    "confidence": 0.50,
                    "uncertainty": 1.0,
                    "class_probabilities": {"BENIGN": 0.33, "SUSPICIOUS": 0.34, "SCAM_LIKE": 0.33}
                },
                "signals": [],
                "metadata": {
                    "language": prep["language"],
                    "language_confidence": prep["language_confidence"],
                    "entities": prep["entities"],
                    "fallback_active": True
                }
            }

        try:
            # Task A: Calibrated 3-class classification
            task_a_res = self.task_a_model.predict_single(raw_input)

            # Task B: Multi-label scam signals with verbatim evidence spans
            detected_signals = self.task_b_model.predict_signals(raw_input)

            # Rule + ML Precedence Ensembling (Section 14 & 39)
            # If safety-critical signal detected, ensure overall classification reflects at least SUSPICIOUS or SCAM_LIKE
            has_safety_critical = any(s.get("is_safety_critical", False) for s in detected_signals)
            effective_label = task_a_res["label"]
            effective_conf = task_a_res["confidence"]

            if has_safety_critical and effective_label == "BENIGN":
                effective_label = "SUSPICIOUS"
                effective_conf = max(task_a_res["confidence"], 0.75)

            return {
                "available": True,
                "model": {
                    "name": self.metadata.get("model_name", "sangyan-scam-classifier"),
                    "version": self.metadata.get("version", "1.0.0"),
                    "status": "ACTIVE"
                },
                "classification": {
                    "label": effective_label,
                    "confidence": round(effective_conf, 4),
                    "uncertainty": task_a_res["uncertainty"],
                    "class_probabilities": task_a_res["class_probabilities"]
                },
                "signals": detected_signals,
                "metadata": {
                    "language": prep["language"],
                    "language_confidence": prep["language_confidence"],
                    "script": prep["script"],
                    "entities": prep["entities"],
                    "fallback_active": False
                }
            }
        except Exception as e:
            # Safe degradation fallback
            return {
                "available": False,
                "model": {
                    "name": self.metadata.get("model_name", "sangyan-scam-classifier"),
                    "version": self.metadata.get("version", "1.0.0"),
                    "status": f"ML model error: {str(e)}. Rule-based safety checks remain active."
                },
                "classification": {
                    "label": "SUSPICIOUS",
                    "confidence": 0.50,
                    "uncertainty": 1.0,
                    "class_probabilities": {"BENIGN": 0.33, "SUSPICIOUS": 0.34, "SCAM_LIKE": 0.33}
                },
                "signals": [],
                "metadata": {
                    "language": prep["language"],
                    "language_confidence": prep["language_confidence"],
                    "entities": prep["entities"],
                    "fallback_active": True
                }
            }
