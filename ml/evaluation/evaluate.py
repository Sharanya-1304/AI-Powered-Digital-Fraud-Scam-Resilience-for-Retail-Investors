"""
SANGYAN SHIELD - Test Set Evaluation Pipeline
Executes standalone, locked test set evaluation:
python -m ml.evaluation.evaluate
Loads test data, runs predictions across Task A & Task B, validates calibration,
measures safety-critical signals, and generates all required reports.
"""

import os
import sys

# Ensure workspace root is in sys.path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import json
import joblib
import numpy as np
from typing import Dict, Any, List

from ml.evaluation.metrics import (
    compute_task_a_metrics,
    compute_multilingual_metrics,
    compute_multilabel_metrics
)
from ml.evaluation.calibration import (
    compute_brier_score,
    compute_expected_calibration_error
)
from ml.evaluation.reports import (
    generate_safety_signal_report,
    generate_false_negative_analysis,
    generate_false_positive_analysis
)


def load_jsonl(path: str) -> List[Dict[str, Any]]:
    records = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def run_evaluation(
    test_path: str = "ml/datasets/test/test.jsonl",
    artifacts_dir: str = "ml/artifacts"
) -> Dict[str, Any]:
    """Runs rigorous locked evaluation on the holdout test set."""
    if not os.path.exists(test_path):
        raise FileNotFoundError(f"Test dataset not found at {test_path}")

    task_a_path = os.path.join(artifacts_dir, "task_a_classifier.joblib")
    task_b_path = os.path.join(artifacts_dir, "task_b_multilabel.joblib")

    if not os.path.exists(task_a_path) or not os.path.exists(task_b_path):
        raise FileNotFoundError(f"Model artifacts missing in {artifacts_dir}. Train models first.")

    task_a_model = joblib.load(task_a_path)
    task_b_model = joblib.load(task_b_path)

    test_records = load_jsonl(test_path)
    texts = [r["text"] for r in test_records]
    true_labels = [r["label"] for r in test_records]

    # 1. Task A Predictions & Metrics
    pred_labels = task_a_model.predict(texts)
    probas = task_a_model.predict_proba(texts)
    task_a_metrics = compute_task_a_metrics(true_labels, pred_labels)

    # 2. Multilingual Metrics (en, hi, te)
    multilingual_metrics = compute_multilingual_metrics(test_records, pred_labels)

    # 3. Calibration Evaluation (Brier score & ECE)
    class_map = {cls: idx for idx, cls in enumerate(task_a_model.classes_)}
    true_indices = np.array([class_map[lbl] for lbl in true_labels], dtype=np.int32)
    brier_score = compute_brier_score(true_indices, probas, len(task_a_model.classes_))
    calib_info = compute_expected_calibration_error(true_indices, probas)

    # 4. Task B Multi-Label Predictions & Evidence Extraction
    detected_signals_per_sample = []
    binary_pred_matrix = np.zeros((len(texts), len(task_b_model.signals)), dtype=np.int32)
    binary_true_matrix = np.zeros((len(texts), len(task_b_model.signals)), dtype=np.int32)

    for i, rec in enumerate(test_records):
        txt = rec["text"]
        detected = task_b_model.predict_signals(txt)
        detected_signals_per_sample.append(detected)

        for d in detected:
            if d["type"] in task_b_model.signals:
                s_idx = task_b_model.signals.index(d["type"])
                binary_pred_matrix[i, s_idx] = 1

        for s in rec.get("signals", []):
            if s in task_b_model.signals:
                s_idx = task_b_model.signals.index(s)
                binary_true_matrix[i, s_idx] = 1

    task_b_metrics = compute_multilabel_metrics(
        binary_true_matrix,
        binary_pred_matrix,
        task_b_model.signals
    )

    # 5. Safety-Critical Report & Error Analysis
    safety_report_path = os.path.join(artifacts_dir, "safety_signal_report.json")
    safety_summary = generate_safety_signal_report(test_records, detected_signals_per_sample, safety_report_path)

    fn_report_path = "reports/false_negative_analysis.md"
    generate_false_negative_analysis(test_records, pred_labels, fn_report_path)

    fp_report_path = "reports/false_positive_analysis.md"
    generate_false_positive_analysis(test_records, pred_labels, fp_report_path)

    # Compile unified evaluation package
    evaluation_result = {
        "evaluation_dataset": {
            "test_sample_count": len(test_records),
            "test_path": test_path
        },
        "task_a_classification": task_a_metrics,
        "multilingual_evaluation": multilingual_metrics,
        "calibration": {
            "brier_score": brier_score,
            "expected_calibration_error": calib_info["expected_calibration_error"],
            "reliability_bins": calib_info["reliability_bins"],
            "is_well_calibrated": calib_info["is_well_calibrated"]
        },
        "task_b_multilabel": task_b_metrics,
        "safety_critical_summary": {
            "safety_recall": safety_summary["overall_safety_signal_recall"],
            "total_false_negatives": safety_summary["total_false_negatives"],
            "assessment": safety_summary["assessment"]
        }
    }

    eval_out_path = os.path.join(artifacts_dir, "evaluation_metrics.json")
    with open(eval_out_path, "w", encoding="utf-8") as f:
        json.dump(evaluation_result, f, indent=2, ensure_ascii=False)

    print("\n" + "="*60)
    print("SANGYAN SHIELD - ML EVALUATION COMPLETED")
    print("="*60)
    print(f"Test Records: {len(test_records)}")
    print(f"Task A Macro F1: {task_a_metrics['macro_f1']}")
    print(f"Task A Weighted F1: {task_a_metrics['weighted_f1']}")
    print(f"Brier Calibration Score: {brier_score} (Lower is better)")
    print(f"Expected Calibration Error: {calib_info['expected_calibration_error']}")
    print(f"Task B Multi-label Micro F1: {task_b_metrics['micro_f1']}")
    print(f"Safety-Critical Signal Recall: {safety_summary['overall_safety_signal_recall'] * 100}%")
    print(f"Results saved to: {eval_out_path}")
    print("="*60 + "\n")

    return evaluation_result


if __name__ == "__main__":
    run_evaluation()
