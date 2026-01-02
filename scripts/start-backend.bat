@echo off
REM Smart Recruitment Platform - Backend Startup Script (Windows)
REM This script checks dependencies and starts the backend server

echo.
echo ========================================
echo Starting Smart Recruitment Platform - Backend
echo ========================================
echo.

cd /d "%~dp0..\backend"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [96mInstalling dependencies...[0m
    call npm install
    if errorlevel 1 (
        echo [91mFailed to install dependencies[0m
        pause
        exit /b 1
    )
) else (
    echo [92mDependencies already installed[0m
)

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo [93mWarning: .env file not found[0m
    echo Please create a .env file with the following variables:
    echo   - DB_HOST
    echo   - DB_USER
    echo   - DB_PASSWORD
    echo   - DB_NAME
    echo   - JWT_SECRET
    echo   - PORT ^(optional, default: 5000^)
    echo.
    pause
    exit /b 1
)

echo.
echo [96mStarting backend server...[0m
call npm start
