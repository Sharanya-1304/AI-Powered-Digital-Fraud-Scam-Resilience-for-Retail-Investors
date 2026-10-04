@echo off
title SANGYAN Backend + ML Engine (FastAPI)
color 0A
cd /d "%~dp0"
echo ======================================================================
echo   Starting SANGYAN SHIELD Backend + ML Inference Engine (Port 8000)
echo ======================================================================
echo.
python -m uvicorn app.main:app --app-dir backend --reload --port 8000
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Backend failed to start.
)
pause
