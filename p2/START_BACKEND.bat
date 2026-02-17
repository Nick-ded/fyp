@echo off
echo ========================================
echo Starting AI Interview Analyzer Backend
echo ========================================
echo.

cd backend

echo Activating virtual environment...
call venv\Scripts\activate.bat

if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    echo Make sure venv exists in backend folder
    pause
    exit /b 1
)

echo Virtual environment activated
echo.
echo Starting FastAPI server...
echo Server will run on: http://localhost:8000
echo.
echo IMPORTANT: Keep this window open while using the app
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

if errorlevel 1 (
    echo.
    echo ERROR: Server failed to start
    echo Check the error messages above
    pause
)

pause
