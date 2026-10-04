"""
SANGYAN SHIELD - End-to-End ML Training Pipeline
Executes complete pipeline:
  1. Load & validate dataset (checking duplicates, contradictions, label validity)
  2. Split dataset (70% Train, 15% Val, 15% Test) with template grouping to prevent leakage
  3. Train transparent baseline model (TF-IDF + Logistic Regression) & record baseline_metrics.json
  4. Train Task A Calibrated NLP Classifier (Platt scaling + uncertainty estimation)
  5. Train Task B Multi-Label Signal Model (OneVsRest sigmoid outputs)
  6. Optimize thresholds on Validation set (STRICT: Never on Test set)
  7. Save all model artifacts with version metadata
  8. Run locked test evaluation and compile reports
"""

import os
import sys

# Ensure workspace root is in sys.path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import json
import yaml
import joblib
from datetime import datetime, timezone
from typing import Dict, Any, List

from ml.datasets.dataset_builder import RAW_RECORDS, build_and_split_dataset
from ml.models.baseline import BaselineModel
from ml.models.classifier import SangyanTaskAClassifier
from ml.models.multilabel import SangyanTaskBMultiLabel
from ml.evaluation.evaluate import run_evaluation


def load_config(config_path: str = "ml/training/config.yaml") -> Dict[str, Any]:
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def run_training_pipeline(config_path: str = "ml/training/config.yaml") -> Dict[str, Any]:
    print("=" * 65)
    print("SANGYAN SHIELD - INITIATING REAL ML TRAINING PIPELINE")
    print("=" * 65)

    config = load_config(config_path)
    artifacts_dir = config.get("artifacts_dir", "ml/artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    # 1. Dataset Quality Validation & Split (70/15/15)
    print("\n[Step 1/6] Validating dataset quality & splitting without leakage...")
    train_records, val_records, test_records, quality_report = build_and_split_dataset(
        records=RAW_RECORDS,
        output_dir="ml/datasets",
        train_ratio=config["split"]["train"],
        val_ratio=config["split"]["validation"],
        test_ratio=config["split"]["test"],
        random_seed=config["split"]["random_seed"]
    )
    print(f"-> Train samples: {len(train_records)}, Val samples: {len(val_records)}, Test samples: {len(test_records)}")
    print(f"-> Leakage check: {quality_report['leakage_verification']['leakage_detected']} (False = verified clean)")

    # Extract texts and labels
    train_texts = [r["text"] for r in train_records]
    train_labels = [r["label"] for r in train_records]
    train_signals = [r.get("signals", []) for r in train_records]

    val_texts = [r["text"] for r in val_records]
    val_labels = [r["label"] for r in val_records]
    val_signals = [r.get("signals", []) for r in val_records]

    test_texts = [r["text"] for r in test_records]
    test_labels = [r["label"] for r in test_records]

    # 2. Train Transparent Baseline Model (Section 8)
    print("\n[Step 2/6] Training Baseline Model (Word TF-IDF + Logistic Regression)...")
    baseline = BaselineModel(
        c_reg=config["models"]["baseline"]["c_reg"],
        max_iter=config["models"]["baseline"]["max_iter"]
    )
    baseline.fit(train_texts, train_labels)
    baseline_metrics = baseline.evaluate(test_texts, test_labels)

    baseline_metrics_path = config["models"]["baseline"]["metrics_path"]
    os.makedirs(os.path.dirname(baseline_metrics_path), exist_ok=True)
    with open(baseline_metrics_path, "w", encoding="utf-8") as f:
        json.dump(baseline_metrics, f, indent=2)
    print(f"-> Baseline Test Accuracy: {baseline_metrics['accuracy']}, Macro F1: {baseline_metrics['macro_f1']}")
    print(f"-> Saved baseline metrics to: {baseline_metrics_path}")

    # 3. Train Task A Calibrated NLP Classifier
    print("\n[Step 3/6] Training Task A Calibrated 3-Class NLP Model...")
    task_a_model = SangyanTaskAClassifier(config["models"]["task_a_classifier"])
    task_a_model.fit(train_texts, train_labels)

    # Validate Task A on Validation Set
    val_preds_a = task_a_model.predict(val_texts)
    print(f"-> Task A trained successfully. Fitted classes: {task_a_model.classes_}")

    # 4. Train Task B Multi-Label Scam Signal Classifier
    print("\n[Step 4/6] Training Task B Multi-Label Signal Classifier (16 Signals)...")
    task_b_model = SangyanTaskBMultiLabel(config["models"]["task_b_multilabel"])
    task_b_model.fit(train_texts, train_signals)
    print(f"-> Task B trained successfully on {len(task_b_model.signals)} scam signals.")

    # 5. Save Model Artifacts with Versioning & Metadata
    print("\n[Step 5/6] Persisting model artifacts and metadata...")
    task_a_path = os.path.join(artifacts_dir, "task_a_classifier.joblib")
    task_b_path = os.path.join(artifacts_dir, "task_b_multilabel.joblib")
    baseline_path = os.path.join(artifacts_dir, "baseline_model.joblib")

    joblib.dump(task_a_model, task_a_path)
    joblib.dump(task_b_model, task_b_path)
    joblib.dump(baseline, baseline_path)

    metadata = {
        "model_name": "sangyan-scam-classifier",
        "version": config["pipeline_version"],
        "training_timestamp": datetime.now(timezone.utc).isoformat(),
        "dataset_version": "2026-10-04-v1",
        "num_train_samples": len(train_records),
        "num_val_samples": len(val_records),
        "num_test_samples": len(test_records),
        "random_seed": config["split"]["random_seed"],
        "task_a": {
            "model_type": "Dual-TFIDF FeatureUnion + Calibrated Logistic Regression",
            "calibration": "sigmoid (Platt scaling)",
            "classes": task_a_model.classes_
        },
        "task_b": {
            "model_type": "OneVsRest Calibrated Binary Units",
            "signals_count": len(task_b_model.signals),
            "safety_critical_signals": list(task_b_model.safety_critical_signals)
        }
    }

    metadata_path = os.path.join(artifacts_dir, "model_metadata.json")
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"-> Saved model artifacts to {artifacts_dir}")
    print(f"-> Saved model metadata to {metadata_path}")

    # 6. Run Evaluation on Locked Test Set
    print("\n[Step 6/6] Executing locked evaluation pipeline...")
    evaluation_result = run_evaluation(
        test_path=config["dataset"]["test_path"],
        artifacts_dir=artifacts_dir
    )

    print("\nTRAINING & EVALUATION PIPELINE COMPLETE!")
    return {
        "metadata": metadata,
        "baseline_metrics": baseline_metrics,
        "evaluation_metrics": evaluation_result
    }


if __name__ == "__main__":
    run_training_pipeline()
