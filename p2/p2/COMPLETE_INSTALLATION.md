# 🚀 Complete Installation - Single Requirements File

This guide uses the unified `requirements-all.txt` file that contains all dependencies.

---

## 📋 What's Included

The `requirements-all.txt` file contains:
- ✅ All Python backend dependencies
- ✅ Frontend Node.js dependencies (for reference)
- ✅ System requirements
- ✅ Installation instructions
- ✅ Troubleshooting tips
- ✅ Quick start commands

---

## ⚡ Quick Installation

### Prerequisites (Install Once)

1. **Python 3.8+** → https://www.python.org/downloads/
2. **Node.js 16+** → https://nodejs.org/
3. **FFmpeg** → https://ffmpeg.org/download.html

**Verify installations:**
```bash
python --version    # Should show 3.8+
node --version      # Should show 16+
ffmpeg -version     # Should show FFmpeg info
```

---

## 🔧 Installation Steps

### Step 1: Backend Setup (Python)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate              # Windows
source venv/bin/activate           # Mac/Linux

# Install ALL Python dependencies from single file
pip install -r ../requirements-all.txt

# Create required folders
mkdir uploads temp                 # Windows
mkdir -p uploads temp              # Mac/Linux
```

### Step 2: Frontend Setup (Node.js)

```bash
# Navigate to frontend folder
cd frontend

# Install all Node.js dependencies
npm install
```

**Note:** Frontend dependencies are managed by `package.json`. The `requirements-all.txt` file lists them for reference.

---

## ▶️ Running the Application

### Terminal 1: Start Backend

```bash
cd backend

# Activate virtual environment
venv\Scripts\activate              # Windows
source venv/bin/activate           # Mac/Linux

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Terminal 2: Start Frontend

```bash
cd frontend

# Start development server
npm run dev
```

**Expected output:**
```
VITE v5.0.11  ready in 500 ms
➜  Local:   http://localhost:5173/
```

### Access the Application

Open your browser: **http://localhost:5173**

---

## 📦 What Gets Installed

### From requirements-all.txt (Python - Backend)

**Core Framework:**
- FastAPI 0.109.0
- Uvicorn 0.27.0
- SQLAlchemy 2.0.25
- Pydantic 2.0.0+

**AI/ML Processing:**
- OpenAI Whisper (speech-to-text)
- MediaPipe 0.10.9 (face detection)
- OpenCV 4.9.0.80 (video processing)
- Librosa 0.10.1 (audio analysis)

**Document Processing:**
- PyPDF2 3.0.1
- python-docx 1.1.0

**Optional:**
- Google Generative AI 0.8.0+ (Gemini API)

**Total Size:** ~2.1GB

### From package.json (Node.js - Frontend)

**Core Framework:**
- React 18.2.0
- React Router DOM 6.21.1
- Vite 5.0.11

**UI Libraries:**
- Tailwind CSS 3.4.1
- Framer Motion 10.18.0
- Lucide React 0.309.0
- Recharts 2.10.3

**HTTP Client:**
- Axios 1.6.5

**Total Size:** ~300MB

---

## ✅ Verification

### Check Backend Installation

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip list
```

You should see all packages from requirements-all.txt.

### Check Frontend Installation

```bash
cd frontend
npm list --depth=0
```

You should see all packages from package.json.

### Test the Application

1. **Backend API**: http://localhost:8000/docs
   - Should show interactive API documentation

2. **Frontend**: http://localhost:5173
   - Should show the homepage

3. **Features**: Click "Interviews" in navbar
   - Should see Upload, AI Interview, and Live Interview tabs

---

## 🔄 Updating Dependencies

### Update All Python Dependencies

```bash
cd backend
source venv/bin/activate
pip install -r ../requirements-all.txt --upgrade
```

### Update All Node.js Dependencies

```bash
cd frontend
npm update
```

---

## 🐛 Common Issues

### Issue: "pip install fails"

**Solution:**
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Then install dependencies
pip install -r requirements-all.txt
```

### Issue: "FFmpeg not found"

**Solution:**
- **Windows**: `winget install ffmpeg` or download and add to PATH
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg`
- Restart terminal after installation

### Issue: "Virtual environment won't activate" (Windows)

**Solution:**
```bash
# PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate
venv\Scripts\Activate.ps1
```

### Issue: "Port already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### Issue: "npm install fails"

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Installation Size

| Component | Size |
|-----------|------|
| Python packages | ~2.1GB |
| Node.js packages | ~300MB |
| System tools | ~250MB |
| **Total** | **~2.7GB** |

**Note:** First run will download Whisper AI model (~140MB).

---

## 🎯 Benefits of Single Requirements File

### Advantages:
- ✅ All dependencies in one place
- ✅ Easy to share and version control
- ✅ Complete documentation included
- ✅ Installation instructions embedded
- ✅ Troubleshooting tips included
- ✅ System requirements documented

### How It Works:
- **Python dependencies**: Installed directly via pip
- **Node.js dependencies**: Listed for reference, installed via npm
- **System requirements**: Documented for manual installation

---

## 📚 Additional Resources

- **Complete Guide**: [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)
- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **Dependencies**: [DEPENDENCIES.md](DEPENDENCIES.md)
- **Troubleshooting**: [TROUBLESHOOTING_INSTALL.md](TROUBLESHOOTING_INSTALL.md)
- **Main Docs**: [README.md](README.md)

---

## 🎉 Success!

If you can access http://localhost:5173 and see the homepage, installation is complete!

**Next Steps:**
1. Click "Interviews" in navigation
2. Try uploading a video
3. Test Live Interview with webcam
4. Explore AI Interview feature

---

**File Location:** `requirements-all.txt` in the project root directory

**Installation Command:** `pip install -r requirements-all.txt`
