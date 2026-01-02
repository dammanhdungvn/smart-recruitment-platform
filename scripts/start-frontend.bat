@echo off
REM Smart Recruitment Platform - Frontend Startup Script (Windows)
REM This script checks dependencies, builds if needed, and starts the frontend

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Starting Smart Recruitment Platform - Frontend
echo ========================================
echo.

cd /d "%~dp0..\frontend"

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

REM Check if dist folder exists (production build)
if not exist "dist\" (
    echo [96mBuilding frontend for production...[0m
    call npm run build
    if errorlevel 1 (
        echo [91mFailed to build frontend[0m
        pause
        exit /b 1
    )
) else (
    echo [92mProduction build already exists[0m
    set /p rebuild="Do you want to rebuild? (y/N): "
    if /i "!rebuild!"=="y" (
        echo [96mRebuilding frontend...[0m
        call npm run build
        if errorlevel 1 (
            echo [91mFailed to build frontend[0m
            pause
            exit /b 1
        )
    )
)

REM Ask user to choose between dev or preview mode
echo.
echo Choose startup mode:
echo 1^) Development mode ^(npm run dev^)
echo 2^) Preview production build ^(npm run preview^)
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo [96mStarting development server...[0m
    call npm run dev
) else if "%choice%"=="2" (
    echo.
    echo [96mStarting preview server...[0m
    call npm run preview
) else (
    echo.
    echo [93mInvalid choice. Starting development mode by default...[0m
    call npm run dev
)
