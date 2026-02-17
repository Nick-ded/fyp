@echo off
REM AI Interview Analyzer - Windows Startup Script

echo Starting AI Interview Analyzer...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    exit /b 1
)

REM Check if FFmpeg is installed
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo Warning: FFmpeg is not installed. Audio processing will fail.
    echo Install FFmpeg: https://ffmpeg.org/download.html
)

REM Start backend
echo Starting backend server...
cd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
pip install -r requirements.txt >nul 2>&1
start /B uvicorn main:app --reload --host 0.0.0.0 --port 8000
cd ..

REM Start frontend
echo Starting frontend server...
cd frontend
if not exist "node_modules" (
    echo Installing npm dependencies...
    npm install >nul 2>&1
)
start /B npm run dev
cd ..

echo.
echo Application started successfully!
echo.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop all servers
pause
