@echo off
REM Smart Recruitment Platform - Complete Startup Script (Windows)
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo Starting Smart Recruitment Platform
echo ========================================
echo.

cd /d "%~dp0.."

REM Start backend in new window
echo [96mStarting Backend Server...[0m
start "Backend Server" cmd /k "cd backend && if not exist node_modules\ npm install && npm start"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo [96mStarting Frontend Server...[0m
start "Frontend Server" cmd /k "cd frontend && if not exist node_modules\ npm install && npm run dev"

echo.
echo [92mBoth servers are starting in separate windows...[0m
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window (servers will keep running)
echo Close the server windows to stop them
echo.
pause
