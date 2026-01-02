#!/bin/bash

# Smart Recruitment Platform - Frontend Startup Script
# This script checks dependencies, builds if needed, and starts the frontend

set -e  # Exit on error

echo "🚀 Starting Smart Recruitment Platform - Frontend"
echo "================================================="

cd "$(dirname "$0")/../frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if dist folder exists (production build)
if [ ! -d "dist" ]; then
    echo "🔨 Building frontend for production..."
    npm run build
else
    echo "✅ Production build already exists"
    read -p "Do you want to rebuild? (y/N): " rebuild
    if [ "$rebuild" = "y" ] || [ "$rebuild" = "Y" ]; then
        echo "🔨 Rebuilding frontend..."
        npm run build
    fi
fi

# Ask user to choose between dev or preview mode
echo ""
echo "Choose startup mode:"
echo "1) Development mode (npm run dev)"
echo "2) Preview production build (npm run preview)"
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo "🎯 Starting development server..."
        npm run dev
        ;;
    2)
        echo "🎯 Starting preview server..."
        npm run preview
        ;;
    *)
        echo "Invalid choice. Starting development mode by default..."
        npm run dev
        ;;
esac
