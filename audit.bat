@echo off
title SANGYAN SHIELD - System Audit
color 0B
echo ======================================================================
echo           SANGYAN SHIELD - TRIPLE LAYER AUDIT SUITE
echo       Frontend (React + Vite + TS) ^| Backend (FastAPI) ^| ML Engine
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Verifying Python Environment...
python --version
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    pause
    exit /b 1
)

echo [2/3] Verifying Node.js Environment...
node --version
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    pause
    exit /b 1
)

echo [3/3] Running Unified Multi-Engine System Audit...
echo.
python audit_all.py

if %ERRORLEVEL% equ 0 (
    color 0A
    echo.
    echo ======================================================================
    echo   [SUCCESS] ALL CHECKS PASSED WITH 0 ERRORS! SYSTEM IS PRODUCTION READY
    echo ======================================================================
) else (
    color 0C
    echo.
    echo ======================================================================
    echo   [FAILED] AUDIT DETECTED ISSUES. PLEASE REVIEW LOGS ABOVE.
    echo ======================================================================
)

echo.
pause
