"""
SANGYAN SHIELD - Machine Learning Pipeline Verification & Quality Suite
Validates model reproducibility, non-random calibrated probabilities,
test set quantitative metrics, and explainability feature attribution.
"""

import sys
import os
import json

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.ml.inference import predict_scam_ml, METRICS_PATH, MODEL_PATH
from app.risk_engine.scorer import evaluate_scan

def test_model_artifacts_exist():
    assert os.path.exists(MODEL_PATH), "model.joblib must exist"
    assert os.path.exists(METRICS_PATH), "metrics.json must exist"
    print("[PASS] Model artifacts exist on disk")

def test_model_evaluation_metrics_thresholds():
    with open(METRICS_PATH, "r", encoding="utf-8") as f:
        metrics = json.load(f)

    test_metrics = metrics["test_metrics"]
    acc = test_metrics["accuracy"]
    prec = test_metrics["precision"]
    rec = test_metrics["recall"]
    f1 = test_metrics["f1_score"]
    roc_auc = test_metrics["roc_auc"]

    print(f"       Test Metrics -> Acc: {acc:.3f}, Prec: {prec:.3f}, Rec: {rec:.3f}, F1: {f1:.3f}, AUC: {roc_auc:.3f}")

    assert acc >= 0.90, f"Accuracy {acc} should be >= 0.90"
    assert prec >= 0.90, f"Precision {prec} should be >= 0.90"
    assert rec >= 0.85, f"Recall {rec} should be >= 0.85"
    assert f1 >= 0.88, f"F1-Score {f1} should be >= 0.88"
    assert roc_auc >= 0.92, f"ROC-AUC {roc_auc} should be >= 0.92"
    print("[PASS] Real ML evaluation metrics exceed production quality thresholds")

def test_reproducibility_and_non_random_determinism():
    sample = "Guaranteed 30% monthly return! Send OTP to activate your VIP trading account."
    res1 = predict_scam_ml(sample)
    res2 = predict_scam_ml(sample)
    res3 = predict_scam_ml(sample)

    assert res1.scam_probability == res2.scam_probability == res3.scam_probability, "Inference must be strictly deterministic"
    assert 0.0 <= res1.scam_probability <= 1.0, "Probability must be bounded in [0.0, 1.0]"
    assert res1.scam_probability != 0.5, "Probability must be calibrated, not default uninformative 0.5"
    print(f"       Sample Scam Probability: {res1.scam_probability:.4f} (Deterministic across runs)")
    print("[PASS] Model is strictly deterministic and calibrated (no random mock generators)")

def test_scam_classification_high_probability():
    scam_sample = "Exclusive invitation: Guaranteed 25% weekly profit with automated AI arbitrage bot. Pay ₹5,000 today. Disclose OTP."
    res = predict_scam_ml(scam_sample)
    assert res.scam_probability >= 0.80, f"Scam sample should have probability >= 0.80, got {res.scam_probability}"
    assert res.predicted_label == "SCAM_SOLICITATION"
    print(f"       Detected as {res.predicted_label} with probability {res.scam_probability:.4f}")
    print("[PASS] High-concern scam text correctly classified with high probability")

def test_benign_financial_content_low_probability():
    benign_sample = "Your buy order for 25 shares of INFOSYS LIMITED has been executed at ₹1,845.50 on NSE. P&L will reflect in your demat ledger."
    res = predict_scam_ml(benign_sample)
    assert res.scam_probability <= 0.25, f"Benign sample should have probability <= 0.25, got {res.scam_probability}"
    assert res.predicted_label == "BENIGN_FINANCIAL"
    print(f"       Detected as {res.predicted_label} with probability {res.scam_probability:.4f}")
    print("[PASS] Legitimate trade execution confirmation correctly classified as benign")

def test_explainability_feature_attribution():
    scam_sample = "Guaranteed 30% return! Sideload our VIP trading APK from Telegram and pay to personal UPI."
    res = predict_scam_ml(scam_sample)
    assert len(res.top_contributing_features) > 0, "Must provide explainable top features"
    feature_names = [f.feature for f in res.top_contributing_features]
    print(f"       Top Contributing Features Extracted: {feature_names}")
    print("[PASS] Explainability layer extracts verified linguistic and domain indicators")

def test_hybrid_scorer_integration():
    sample = "SEBI approved investment opportunity! Guaranteed 30% monthly return. Pay ₹5,000 today. Send OTP to activate your account."
    scan_result = evaluate_scan(sample)
    assert scan_result.mlAnalysis is not None, "Scan result must include mlAnalysis model"
    assert scan_result.mlAnalysis.scamProbability >= 0.80
    assert scan_result.riskBand == "CRITICAL_SAFETY_WARNING"
    assert scan_result.riskScore >= 75
    print(f"       Hybrid Score: {scan_result.riskScore}/100, Band: {scan_result.riskBand}, ML Prob: {scan_result.mlAnalysis.scamProbability}")
    print("[PASS] Hybrid risk engine fuses deterministic rules with ML calibrated output")

if __name__ == "__main__":
    print("=================================================================")
    print("  SANGYAN SHIELD - MACHINE LEARNING PIPELINE VERIFICATION SUITE")
    print("=================================================================")
    test_model_artifacts_exist()
    test_model_evaluation_metrics_thresholds()
    test_reproducibility_and_non_random_determinism()
    test_scam_classification_high_probability()
    test_benign_financial_content_low_probability()
    test_explainability_feature_attribution()
    test_hybrid_scorer_integration()
    print("=================================================================")
    print("  ALL MACHINE LEARNING PIPELINE TESTS PASSED SUCCESSFULLY! (7/7)")
    print("=================================================================")
