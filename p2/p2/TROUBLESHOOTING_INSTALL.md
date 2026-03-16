# Installation Troubleshooting Guide

## Common Package Installation Issues

### Step 1: Check Python Version
```bash
python --version
```
**Required:** Python 3.8 - 3.11 (3.12+ may have compatibility issues)

### Step 2: Install System Dependencies

#### Windows:
1. Install Visual C++ Build Tools: https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. Install ffmpeg: `winget install ffmpeg` or download from https://ffmpeg.org/

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install -y python3-dev build-essential ffmpeg libsndfile1 portaudio19-dev
```

#### macOS:
```bash
brew install ffmpeg portaudio
```

### Step 3: Install Packages in Order

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install packages in stages
pip install fastapi uvicorn[standard] python-multipart sqlalchemy
pip install numpy scipy
pip install opencv-python-headless
pip install librosa soundfile audioread
pip install openai-whisper
pip install mediapipe PyPDF2 python-docx
```

### Common Specific Issues:

#### Issue 1: opencv-python fails
**Solution:** Use headless version
```bash
pip uninstall opencv-python
pip install opencv-python-headless
```

#### Issue 2: mediapipe fails
**Solution:** Try older version or skip if not using video features
```bash
pip install mediapipe==0.10.9
# Or skip: pip install --no-deps mediapipe
```

#### Issue 3: openai-whisper fails
**Solution:** Install ffmpeg first, then:
```bash
pip install openai-whisper --no-deps
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
```

#### Issue 4: librosa fails
**Solution:** Install audio dependencies first
```bash
pip install soundfile audioread
pip install librosa
```

#### Issue 5: numpy version conflicts
**Solution:** Install compatible version
```bash
pip install "numpy>=1.24.0,<2.0.0"
```

### Step 4: Verify Installation
```bash
python -c "import fastapi; import cv2; import whisper; print('All packages loaded successfully!')"
```

### Alternative: Minimal Installation (Skip AI Features)
If packages keep failing, install minimal version:
```bash
pip install fastapi uvicorn[standard] python-multipart sqlalchemy PyPDF2 python-docx
```

Then manually add AI features later when system dependencies are resolved.

### Still Having Issues?
1. Share the exact error message
2. Check Python version compatibility
3. Try using requirements_fixed.txt instead of requirements.txt
4. Consider using Docker (see below)

## Docker Alternative (Recommended for Complex Setups)
Create `backend/Dockerfile`:
```dockerfile
FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg libsndfile1 build-essential
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
