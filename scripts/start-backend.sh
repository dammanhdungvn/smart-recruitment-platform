#!/bin/bash

# Smart Recruitment Platform - Backend Startup Script
# This script checks dependencies and starts the backend server

set -e  # Exit on error

echo "🚀 Starting Smart Recruitment Platform - Backend"
echo "================================================"

cd "$(dirname "$0")/../backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Please create a .env file with the following variables:"
    echo "  - DB_HOST"
    echo "  - DB_USER"
    echo "  - DB_PASSWORD"
    echo "  - DB_NAME"
    echo "  - JWT_SECRET"
    echo "  - PORT (optional, default: 5000)"
    exit 1
fi

echo "🎯 Starting backend server..."
npm start
