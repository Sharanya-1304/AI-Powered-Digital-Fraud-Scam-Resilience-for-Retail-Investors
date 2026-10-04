@echo off
title SANGYAN SHIELD - Production Server
color 0A
echo ======================================================================
echo       SANGYAN SHIELD - UNIFIED PRODUCTION FULL-STACK SERVER
echo       (React 19 SPA + FastAPI + Multi-Task ML Inference Engine)
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Verifying production frontend bundle...
if not exist "frontend\dist\index.html" (
    echo Building frontend production bundle...
    call npm run build --prefix frontend
)

echo [2/3] Checking trained ML artifacts...
if not exist "backend\app\ml\artifacts\model.joblib" (
    echo Initializing and training ML models...
    python -m app.ml.trainer
)

echo [3/3] Starting Unified Production Server on http://localhost:8000 ...
echo.
echo   * Web App URL:  http://localhost:8000
echo   * API Docs:     http://localhost:8000/docs
echo   * Health Check: http://localhost:8000/api/health
echo.
echo Launching browser in 2 seconds...
start "" http://localhost:8000

python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000
pause
