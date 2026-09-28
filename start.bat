@echo off
title Senior Connect Full Stack Starter
echo ========================================
echo    Starting Senior Connect Full Stack...
echo ========================================

:: Start Backend in a separate background window
echo Starting Backend Server (Port 5000)...
start "Senior Connect Backend" cmd /k "cd /d %~dp0backend && npm run dev"

:: Start Frontend and open browser
echo Starting Frontend (Port 5173)...
start "Senior Connect Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait 3 seconds and open the browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo ========================================
echo Senior Connect is now LIVE in your browser!
echo ========================================
