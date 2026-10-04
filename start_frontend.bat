@echo off
title SANGYAN Frontend (Vite)
color 0B
cd /d "%~dp0frontend"
echo ======================================================================
echo   Starting SANGYAN SHIELD Frontend UI (Port 5173)
echo ======================================================================
echo.
npm run dev
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Frontend failed to start.
)
pause
