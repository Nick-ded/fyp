#!/bin/bash

echo "========================================"
echo "Starting Intrex Development Environment"
echo "========================================"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Done!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

echo "[1/2] Starting Backend Server..."
cd backend
python -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

sleep 3

echo "[2/2] Starting Frontend Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "Development servers are running!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Test Upload: http://localhost:5173/test-upload"
echo ""
echo "Press Ctrl+C to stop all servers..."
echo ""

# Wait for user interrupt
wait
