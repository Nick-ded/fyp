@echo off
echo ========================================
echo Installing AI Interview Feature
echo ========================================
echo.

echo Step 1: Installing Python dependencies...
cd backend
pip install PyPDF2==3.0.1 python-docx==1.1.0
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo Step 2: Backing up old database...
if exist interview_analyzer.db (
    copy interview_analyzer.db interview_analyzer.db.backup
    echo ✓ Database backed up to interview_analyzer.db.backup
    del interview_analyzer.db
    echo ✓ Old database removed
) else (
    echo ✓ No existing database found
)
echo.

echo Step 3: Testing AI Interview service...
cd ..
python test_ai_interview.py
if %errorlevel% neq 0 (
    echo ERROR: Tests failed
    pause
    exit /b 1
)
echo.

echo ========================================
echo ✓ Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: cd backend ^&^& python main.py
echo 2. Start frontend: cd frontend ^&^& npm run dev
echo 3. Open http://localhost:5173
echo 4. Click "AI Interview" tab
echo.
pause
