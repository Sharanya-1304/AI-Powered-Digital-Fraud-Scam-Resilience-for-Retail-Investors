"""
SANGYAN SHIELD - Comprehensive ML Evaluation Metrics
Implements precision, recall, macro/weighted F1, confusion matrices, per-class breakdown,
per-language breakdown (en, hi, te), multi-label metrics (micro/macro), and safety-critical signal recall.
"""

from typing import Dict, Any, List
import numpy as np
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)


def compute_task_a_metrics(
    y_true: List[str],
    y_pred: List[str],
    classes: List[str] = ["BENIGN", "SUSPICIOUS", "SCAM_LIKE"]
) -> Dict[str, Any]:
    """Computes full evaluation suite for Task A 3-class classifier."""
    macro_p = precision_score(y_true, y_pred, average="macro", zero_division=0)
    macro_r = recall_score(y_true, y_pred, average="macro", zero_division=0)
    macro_f1 = f1_score(y_true, y_pred, average="macro", zero_division=0)
    weighted_f1 = f1_score(y_true, y_pred, average="weighted", zero_division=0)

    cm = confusion_matrix(y_true, y_pred, labels=classes)
    
    # Calculate per-class metrics and false positive / negative counts
    per_class = {}
    for i, cls_name in enumerate(classes):
        tp = cm[i, i]
        fn = np.sum(cm[i, :]) - tp
        fp = np.sum(cm[:, i]) - tp
        tn = np.sum(cm) - (tp + fp + fn)

        p = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        r = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * p * r) / (p + r) if (p + r) > 0 else 0.0
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0
        fnr = fn / (fn + tp) if (fn + tp) > 0 else 0.0

        per_class[cls_name] = {
            "precision": round(float(p), 4),
            "recall": round(float(r), 4),
            "f1": round(float(f1), 4),
            "support": int(np.sum(cm[i, :])),
            "false_positive_rate": round(float(fpr), 4),
            "false_negative_rate": round(float(fnr), 4)
        }

    return {
        "macro_precision": round(float(macro_p), 4),
        "macro_recall": round(float(macro_r), 4),
        "macro_f1": round(float(macro_f1), 4),
        "weighted_f1": round(float(weighted_f1), 4),
        "confusion_matrix": {
            "classes": classes,
            "matrix": cm.tolist()
        },
        "per_class": per_class
    }


def compute_multilingual_metrics(
    records: List[Dict[str, Any]],
    y_pred: List[str]
) -> Dict[str, Dict[str, float]]:
    """
    Computes per-language breakdown: English, Hindi, Telugu (Section 20).
    Never fabricating numbers.
    """
    lang_groups = {"en": {"true": [], "pred": []}, "hi": {"true": [], "pred": []}, "te": {"true": [], "pred": []}}

    for rec, pred in zip(records, y_pred):
        lang = rec.get("language", "en")
        if lang in lang_groups:
            lang_groups[lang]["true"].append(rec["label"])
            lang_groups[lang]["pred"].append(pred)

    results = {}
    for lang, data in lang_groups.items():
        if not data["true"]:
            results[lang] = {"precision": 0.0, "recall": 0.0, "f1": 0.0, "sample_count": 0}
            continue

        p = precision_score(data["true"], data["pred"], average="macro", zero_division=0)
        r = recall_score(data["true"], data["pred"], average="macro", zero_division=0)
        f1 = f1_score(data["true"], data["pred"], average="macro", zero_division=0)

        results[lang] = {
            "precision": round(float(p), 4),
            "recall": round(float(r), 4),
            "f1": round(float(f1), 4),
            "sample_count": len(data["true"])
        }

    return results


def compute_multilabel_metrics(
    y_true_matrix: np.ndarray,
    y_pred_matrix: np.ndarray,
    signal_names: List[str]
) -> Dict[str, Any]:
    """Computes micro/macro and per-label metrics for Task B signals."""
    micro_p = precision_score(y_true_matrix, y_pred_matrix, average="micro", zero_division=0)
    micro_r = recall_score(y_true_matrix, y_pred_matrix, average="micro", zero_division=0)
    micro_f1 = f1_score(y_true_matrix, y_pred_matrix, average="micro", zero_division=0)
    macro_f1 = f1_score(y_true_matrix, y_pred_matrix, average="macro", zero_division=0)

    per_signal = {}
    for i, name in enumerate(signal_names):
        col_true = y_true_matrix[:, i]
        col_pred = y_pred_matrix[:, i]

        p = precision_score(col_true, col_pred, zero_division=0)
        r = recall_score(col_true, col_pred, zero_division=0)
        f1 = f1_score(col_true, col_pred, zero_division=0)
        support = int(np.sum(col_true))

        per_signal[name] = {
            "precision": round(float(p), 4),
            "recall": round(float(r), 4),
            "f1": round(float(f1), 4),
            "support": support
        }

    return {
        "micro_precision": round(float(micro_p), 4),
        "micro_recall": round(float(micro_r), 4),
        "micro_f1": round(float(micro_f1), 4),
        "macro_f1": round(float(macro_f1), 4),
        "per_signal": per_signal
    }
