"""
SANGYAN SHIELD - Model Confidence Calibration Assessment
Implements Brier Score, Expected Calibration Error (ECE), and Reliability Diagrams
to verify that model confidence correlates faithfully with empirical accuracy.
"""

from typing import Dict, Any, List
import numpy as np


def compute_brier_score(y_true_indices: np.ndarray, y_proba: np.ndarray, num_classes: int) -> float:
    """
    Computes multi-class Brier score:
    BS = (1 / N) * sum_{i=1}^N sum_{k=1}^K (p_{ik} - y_{ik})^2
    Lower is better (0.0 = perfect calibration and accuracy).
    """
    n = len(y_true_indices)
    one_hot = np.zeros((n, num_classes))
    for i, idx in enumerate(y_true_indices):
        one_hot[i, idx] = 1.0

    brier = float(np.mean(np.sum((y_proba - one_hot) ** 2, axis=1)))
    return round(brier, 4)


def compute_expected_calibration_error(
    y_true_indices: np.ndarray,
    y_proba: np.ndarray,
    n_bins: int = 10
) -> Dict[str, Any]:
    """
    Computes Expected Calibration Error (ECE) and returns reliability table.
    ECE = sum_{m=1}^M (|B_m| / N) * |acc(B_m) - conf(B_m)|
    """
    confidences = np.max(y_proba, axis=1)
    predictions = np.argmax(y_proba, axis=1)
    accuracies = (predictions == y_true_indices).astype(float)

    bin_boundaries = np.linspace(0.0, 1.0, n_bins + 1)
    ece = 0.0
    total_samples = len(y_true_indices)

    reliability_diagram = []

    for i in range(n_bins):
        bin_lower = bin_boundaries[i]
        bin_upper = bin_boundaries[i + 1]

        in_bin = (confidences >= bin_lower) & (confidences < bin_upper if i < n_bins - 1 else confidences <= bin_upper)
        bin_size = int(np.sum(in_bin))

        if bin_size > 0:
            bin_acc = float(np.mean(accuracies[in_bin]))
            bin_conf = float(np.mean(confidences[in_bin]))
            bin_weight = bin_size / max(total_samples, 1)
            ece += bin_weight * abs(bin_acc - bin_conf)

            reliability_diagram.append({
                "bin_range": f"{round(bin_lower, 2)}-{round(bin_upper, 2)}",
                "sample_count": bin_size,
                "confidence": round(bin_conf, 4),
                "accuracy": round(bin_acc, 4),
                "calibration_gap": round(abs(bin_acc - bin_conf), 4)
            })

    return {
        "expected_calibration_error": round(float(ece), 4),
        "reliability_bins": reliability_diagram,
        "is_well_calibrated": bool(ece < 0.15)
    }
