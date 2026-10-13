@echo off
title VVITU Assistance - Launcher
echo ========================================================
echo   Starting VVITU Assistance (Digital Campus Guide)...
echo ========================================================
echo.
cd /d "%~dp0"

start http://localhost:5173/
npm run dev -- --port 5173

pause
