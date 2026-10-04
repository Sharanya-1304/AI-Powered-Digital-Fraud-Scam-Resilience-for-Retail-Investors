"""
SANGYAN SHIELD - Transparent Baseline Model
Implements standard TF-IDF (word-only) + Logistic Regression baseline as mandated by Section 8.
Serves as the rigorous benchmark that subsequent models must outperform.
"""

from typing import Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, f1_score
import json


class BaselineModel:
    """Standard unigram/bigram TF-IDF + Logistic Regression baseline."""

    def __init__(self, c_reg: float = 1.0, max_iter: int = 1000):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=2500)
        self.classifier = LogisticRegression(C=c_reg, max_iter=max_iter, class_weight="balanced", random_state=42)
        self.is_fitted = False

    def fit(self, texts: List[str], labels: List[str]):
        """Fit vectorizer and baseline logistic regression."""
        x = self.vectorizer.fit_transform(texts)
        self.classifier.fit(x, labels)
        self.is_fitted = True
        return self

    def predict(self, texts: List[str]) -> List[str]:
        if not self.is_fitted:
            raise RuntimeError("Baseline model is not fitted.")
        x = self.vectorizer.transform(texts)
        return list(self.classifier.predict(x))

    def predict_proba(self, texts: List[str]):
        if not self.is_fitted:
            raise RuntimeError("Baseline model is not fitted.")
        x = self.vectorizer.transform(texts)
        return self.classifier.predict_proba(x)

    def evaluate(self, test_texts: List[str], test_labels: List[str]) -> Dict[str, Any]:
        """Compute transparent baseline metrics."""
        preds = self.predict(test_texts)
        acc = accuracy_score(test_labels, preds)
        macro_f1 = f1_score(test_labels, preds, average="macro", zero_division=0)
        weighted_f1 = f1_score(test_labels, preds, average="weighted", zero_division=0)
        report = classification_report(test_labels, preds, output_dict=True, zero_division=0)

        metrics = {
            "model_name": "TF-IDF + Logistic Regression (Baseline)",
            "accuracy": round(float(acc), 4),
            "macro_f1": round(float(macro_f1), 4),
            "weighted_f1": round(float(weighted_f1), 4),
            "classification_report": report
        }
        return metrics
