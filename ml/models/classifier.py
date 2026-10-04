"""
SANGYAN SHIELD - Task A Overall Content Classifier
3-Class Architecture: BENIGN, SUSPICIOUS, SCAM_LIKE
Combines dual TF-IDF FeatureUnion with Calibrated Platt Scaling and normalized Shannon entropy uncertainty estimation.
"""

from typing import Dict, Any, List, Tuple
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from ml.features.tfidf import SangyanFeatureExtractor


class SangyanTaskAClassifier:
    """Production NLP Classifier for Task A (BENIGN, SUSPICIOUS, SCAM_LIKE)."""

    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.classes_ = ["BENIGN", "SUSPICIOUS", "SCAM_LIKE"]
        self.feature_extractor = SangyanFeatureExtractor(self.config.get("feature_config", {}))

        # Base estimator with balanced class weights to handle minority classes
        base_estimator = LogisticRegression(
            C=1.5,
            max_iter=1000,
            class_weight="balanced",
            solver="lbfgs",
            random_state=42
        )

        # CalibratedClassifierCV implements Platt scaling (method='sigmoid')
        # Ensures output confidence numbers are calibrated probabilities
        self.model = CalibratedClassifierCV(
            estimator=base_estimator,
            method="sigmoid",
            cv=3
        )
        self.is_fitted = False

    def fit(self, texts: List[str], labels: List[str]):
        """Fit feature extractor and calibrated classifier."""
        from ml.preprocessing.cleaner import clean_text_pipeline
        cleaned_texts = [clean_text_pipeline(t)["cleaned_text"] for t in texts]
        x_features = self.feature_extractor.fit_transform(cleaned_texts)
        self.model.fit(x_features, labels)
        self.classes_ = list(self.model.classes_)
        self.is_fitted = True
        return self

    def predict(self, texts: List[str]) -> List[str]:
        if not self.is_fitted:
            raise RuntimeError("Task A classifier is not fitted.")
        from ml.preprocessing.cleaner import clean_text_pipeline
        cleaned_texts = [clean_text_pipeline(t)["cleaned_text"] for t in texts]
        x = self.feature_extractor.transform(cleaned_texts)
        return list(self.model.predict(x))

    def predict_proba(self, texts: List[str]) -> np.ndarray:
        if not self.is_fitted:
            raise RuntimeError("Task A classifier is not fitted.")
        from ml.preprocessing.cleaner import clean_text_pipeline
        cleaned_texts = [clean_text_pipeline(t)["cleaned_text"] for t in texts]
        x = self.feature_extractor.transform(cleaned_texts)
        return self.model.predict_proba(x)

    def predict_single(self, text: str) -> Dict[str, Any]:
        """
        Analyzes a single input string and returns structured classification metadata:
        - label: BENIGN | SUSPICIOUS | SCAM_LIKE
        - confidence: calibrated probability (0.0 to 1.0)
        - class_probabilities: {BENIGN: p1, SUSPICIOUS: p2, SCAM_LIKE: p3}
        - uncertainty: normalized entropy (0.0 = completely certain, 1.0 = maximal ambiguity)
        """
        if not self.is_fitted:
            raise RuntimeError("Task A classifier is not fitted.")

        from ml.preprocessing.cleaner import clean_text_pipeline
        cleaned = clean_text_pipeline(text)["cleaned_text"]
        x = self.feature_extractor.transform([cleaned])
        proba = self.model.predict_proba(x)[0]
        pred_idx = int(np.argmax(proba))
        predicted_label = self.classes_[pred_idx]
        confidence = float(proba[pred_idx])

        # Normalized Shannon entropy as uncertainty metric:
        # H = -sum(p * log2(p)) / log2(K)
        k = len(self.classes_)
        eps = 1e-12
        entropy = -sum(p * np.log2(p + eps) for p in proba)
        max_entropy = np.log2(k)
        normalized_uncertainty = float(np.clip(entropy / max_entropy, 0.0, 1.0))

        prob_dict = {cls_name: round(float(proba[i]), 4) for i, cls_name in enumerate(self.classes_)}

        return {
            "label": predicted_label,
            "confidence": round(confidence, 4),
            "class_probabilities": prob_dict,
            "uncertainty": round(normalized_uncertainty, 4)
        }
