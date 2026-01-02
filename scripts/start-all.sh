#!/bin/bash

# Smart Recruitment Platform - Complete Startup Script
# This script starts both backend and frontend servers

set -e  # Exit on error

echo "🚀 Starting Smart Recruitment Platform"
echo "======================================"
echo ""

# Get project root directory (parent of scripts folder)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $(jobs -p) 2>/dev/null || true
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "📡 Starting Backend Server..."
cd "$PROJECT_ROOT/backend"

# Check backend dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start backend
npm start &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo ""
echo "🎨 Starting Frontend Server..."
cd "$PROJECT_ROOT/frontend"

# Check frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend dev server
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait
