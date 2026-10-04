"""
SANGYAN SHIELD - Machine Learning Model Training, Calibration & Evaluation Pipeline
Trains, cross-validates, and evaluates competitive models on the ground-truth fraud dataset.
Generates comprehensive quantitative metrics (Precision, Recall, F1, ROC-AUC) and serializes artifacts.
"""

import os
import json
import joblib
import numpy as np
from datetime import datetime
from typing import Dict, Any

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

from app.ml.dataset import get_training_data
from app.ml.feature_extractor import create_hybrid_feature_pipeline

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")

def train_and_evaluate_model(artifacts_dir: str = ARTIFACTS_DIR, random_state: int = 42) -> Dict[str, Any]:
    """
    Executes a strict, reproducible training & evaluation workflow:
    1. Loads dataset
    2. Performs stratified 80/20 train/test split
    3. Evaluates multiple algorithms with 5-fold cross-validation
    4. Selects optimal model, evaluates on unseen test set
    5. Computes explainability feature weights
    6. Serializes model artifact and metrics.json
    """
    os.makedirs(artifacts_dir, exist_ok=True)
    texts, labels = get_training_data()

    # 1. Stratified Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        texts,
        labels,
        test_size=0.20,
        random_state=random_state,
        stratify=labels
    )

    # 2. Candidate Models Specification
    candidates = {
        "CalibratedLogisticRegression": CalibratedClassifierCV(
            estimator=LogisticRegression(C=1.5, max_iter=1000, random_state=random_state),
            method="sigmoid",
            cv=3
        ),
        "LinearSVC_Calibrated": CalibratedClassifierCV(
            estimator=LinearSVC(C=1.0, random_state=random_state, dual="auto"),
            method="sigmoid",
            cv=3
        ),
        "RandomForest": RandomForestClassifier(
            n_estimators=100,
            max_depth=12,
            random_state=random_state
        )
    }

    # 3. Model Comparison & 5-Fold Stratified Cross-Validation
    cv_strategy = StratifiedKFold(n_splits=5, shuffle=True, random_state=random_state)
    best_name = None
    best_cv_f1 = -1.0
    cv_results = {}

    for name, clf in candidates.items():
        pipe = Pipeline([
            ("features", create_hybrid_feature_pipeline()),
            ("classifier", clf)
        ])
        scores = cross_val_score(pipe, X_train, y_train, cv=cv_strategy, scoring="f1")
        mean_f1 = float(np.mean(scores))
        std_f1 = float(np.std(scores))
        cv_results[name] = {"mean_f1": round(mean_f1, 4), "std_f1": round(std_f1, 4)}

        if mean_f1 > best_cv_f1:
            best_cv_f1 = mean_f1
            best_name = name

    # 4. Train Selected Best Model on Full Training Set
    selected_classifier = candidates[best_name]
    best_pipeline = Pipeline([
        ("features", create_hybrid_feature_pipeline()),
        ("classifier", selected_classifier)
    ])
    best_pipeline.fit(X_train, y_train)

    # 5. Rigorous Evaluation on Unseen Holdout Test Set
    y_pred = best_pipeline.predict(X_test)
    y_proba = best_pipeline.predict_proba(X_test)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    roc_auc = float(roc_auc_score(y_test, y_proba))
    cm = confusion_matrix(y_test, y_pred).tolist()

    # 6. Explainability: Top Feature Analysis
    # Train auxiliary linear model directly to extract global feature weights
    aux_pipe = Pipeline([
        ("features", create_hybrid_feature_pipeline()),
        ("clf", LogisticRegression(C=1.5, max_iter=1000, random_state=random_state))
    ])
    aux_pipe.fit(X_train, y_train)

    feature_names = aux_pipe.named_steps["features"].get_feature_names_out()
    coefs = aux_pipe.named_steps["clf"].coef_[0]

    top_scam_indices = np.argsort(coefs)[-15:][::-1]
    top_benign_indices = np.argsort(coefs)[:15]

    top_scam_features = [
        {"feature": str(feature_names[i]).replace("tfidf_features__tfidf__", "").replace("domain_features__", ""), "weight": round(float(coefs[i]), 4)}
        for i in top_scam_indices
    ]
    top_benign_features = [
        {"feature": str(feature_names[i]).replace("tfidf_features__tfidf__", "").replace("domain_features__", ""), "weight": round(float(coefs[i]), 4)}
        for i in top_benign_indices
    ]

    from datetime import timezone
    metrics_payload = {
        "model_architecture": best_name,
        "pipeline_version": "1.0.0-cyber-resilience",
        "training_timestamp": datetime.now(timezone.utc).isoformat(),
        "random_state": random_state,
        "dataset_split": {
            "total_samples": len(texts),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "scam_ratio": round(sum(labels) / len(labels), 3)
        },
        "cross_validation_f1": cv_results,
        "test_metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "confusion_matrix": {
                "true_negative": cm[0][0],
                "false_positive": cm[0][1],
                "false_negative": cm[1][0],
                "true_positive": cm[1][1]
            }
        },
        "explainability": {
            "top_scam_indicators": top_scam_features,
            "top_benign_indicators": top_benign_features
        }
    }

    # 7. Serialize Artifacts
    model_path = os.path.join(artifacts_dir, "model.joblib")
    metrics_path = os.path.join(artifacts_dir, "metrics.json")

    joblib.dump(best_pipeline, model_path)
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)

    return metrics_payload

if __name__ == "__main__":
    print("Training SANGYAN SHIELD Machine Learning Detection Pipeline...")
    res = train_and_evaluate_model()
    print("\n--- MODEL TRAINING COMPLETE ---")
    print(f"Selected Model: {res['model_architecture']}")
    print(f"Accuracy:  {res['test_metrics']['accuracy'] * 100:.1f}%")
    print(f"Precision: {res['test_metrics']['precision'] * 100:.1f}%")
    print(f"Recall:    {res['test_metrics']['recall'] * 100:.1f}%")
    print(f"F1-Score:  {res['test_metrics']['f1_score'] * 100:.1f}%")
    print(f"ROC-AUC:   {res['test_metrics']['roc_auc'] * 100:.1f}%")
    print("Metrics written to backend/app/ml/artifacts/metrics.json")
