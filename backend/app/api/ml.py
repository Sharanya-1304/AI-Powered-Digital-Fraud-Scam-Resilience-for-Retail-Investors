import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.services.ml_service import analyze_text
from app.ml.inference import predict_scam_ml, MLInferenceResult

router = APIRouter()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
EVAL_METRICS_PATH = os.path.join(BASE_DIR, "ml", "artifacts", "evaluation_metrics.json")
BASELINE_METRICS_PATH = os.path.join(BASE_DIR, "ml", "artifacts", "baseline_metrics.json")
SAFETY_REPORT_PATH = os.path.join(BASE_DIR, "ml", "artifacts", "safety_signal_report.json")
LEGACY_METRICS_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "artifacts", "metrics.json")


class MLPredictRequest(BaseModel):
    text: str


@router.get("/ml/metrics")
async def get_ml_metrics():
    """
    Returns quantitative evaluation metrics, cross-validation scores,
    confusion matrix, and feature importances of the trained model.
    """
    target_path = EVAL_METRICS_PATH if os.path.exists(EVAL_METRICS_PATH) else LEGACY_METRICS_PATH
    if not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="Model metrics artifact not found.")

    with open(target_path, "r", encoding="utf-8") as f:
        metrics = json.load(f)

    # Attach baseline metrics if available
    if os.path.exists(BASELINE_METRICS_PATH):
        with open(BASELINE_METRICS_PATH, "r", encoding="utf-8") as f:
            metrics["baseline_benchmark"] = json.load(f)

    # Attach safety signal audit if available
    if os.path.exists(SAFETY_REPORT_PATH):
        with open(SAFETY_REPORT_PATH, "r", encoding="utf-8") as f:
            metrics["safety_signal_audit"] = json.load(f)

    return metrics


@router.post("/ml/analyze")
async def analyze_ml_endpoint(req: MLPredictRequest) -> Dict[str, Any]:
    """
    Production inference endpoint returning structured multi-task results:
    - classification (label, calibrated confidence, uncertainty)
    - signals with verbatim evidence character spans (start, end)
    - model metadata and language identification
    """
    return analyze_text(req.text)


@router.post("/ml/predict", response_model=MLInferenceResult)
async def predict_ml_endpoint(req: MLPredictRequest):
    """
    Executes real machine learning inference on input text,
    returning calibrated probability and contributing linguistic features.
    """
    return predict_scam_ml(req.text)
