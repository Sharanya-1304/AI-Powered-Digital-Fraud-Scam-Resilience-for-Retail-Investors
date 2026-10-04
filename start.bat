@echo off
title SANGYAN SHIELD - Launcher
color 0B
cd /d "%~dp0"

echo ======================================================================
echo           SANGYAN SHIELD - DIGITAL FRAUD RESILIENCE SUITE
echo          Track A - SANGYAN Hackathon 2026 (SEBI ^& NSDL)
echo ======================================================================
echo.

:: 1. Check prerequisites
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not detected in PATH.
    pause
    exit /b 1
)

node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not detected in PATH.
    pause
    exit /b 1
)

:: 2. Check dependencies
if not exist "frontend\node_modules" (
    echo Installing frontend packages...
    call npm install --prefix frontend
)

echo [1/3] Starting FastAPI Backend + Integrated ML Engine...
start "SANGYAN Backend" cmd /c "%~dp0start_backend.bat"

echo [2/3] Starting Vite Frontend UI...
start "SANGYAN Frontend" cmd /c "%~dp0start_frontend.bat"

echo.
echo ======================================================================
echo   Both services are launching in dedicated windows!
echo   - Backend and ML Engine: http://localhost:8000
echo   - Interactive API Docs: http://localhost:8000/docs
echo   - Frontend Interface:  http://localhost:5173
echo ======================================================================
echo.
echo Opening browser in 3 seconds...
ping 127.0.0.1 -n 4 >nul
start http://localhost:5173
