# 📄 Installation Cheat Sheet

One-page reference for installing AI Interview Analyzer.

---

## ✅ Prerequisites

```bash
# Install these first:
Python 3.8+     → https://www.python.org/downloads/
Node.js 16+     → https://nodejs.org/
FFmpeg          → https://ffmpeg.org/download.html

# Verify:
python --version && node --version && ffmpeg -version
```

---

## 🚀 Automated Install (Easiest)

### Windows
```bash
INSTALL_AI_FEATURE.bat
run.bat
```

### Mac/Linux
```bash
chmod +x install_ai_feature.sh run.sh
./install_ai_feature.sh
./run.sh
```

---

## 🔧 Manual Install (5 Steps)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate              # Windows
source venv/bin/activate           # Mac/Linux
pip install -r ../requirements-all.txt
mkdir uploads temp
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Start Backend (Terminal 1)
```bash
cd backend
venv\Scripts\activate              # Windows
source venv/bin/activate           # Mac/Linux
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### 5. Open Browser
```
http://localhost:5173
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## 🐛 Quick Fixes

### Python not found
```bash
# Use python3 or add Python to PATH
python3 --version
```

### Port in use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### Module not found
```bash
# Backend
pip install -r ../requirements-all.txt --force-reinstall

# Frontend
rm -rf node_modules && npm install
```

### FFmpeg not found
```bash
# Install and add to PATH, then restart terminal
ffmpeg -version
```

### Virtual env won't activate (Windows PowerShell)
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📦 File Structure

```
backend/
  ├── venv/              (create this)
  ├── uploads/           (create this)
  ├── temp/              (create this)
  ├── requirements.txt   (install from this)
  └── main.py

frontend/
  ├── node_modules/      (npm creates this)
  ├── package.json       (install from this)
  └── src/
```

---

## 🎯 Verification Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] FFmpeg installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend starts on port 8000
- [ ] Frontend starts on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:8000/docs

---

## 📚 Full Documentation

- **Quick Start**: `QUICK_START.md`
- **Complete Guide**: `INSTALLATION_GUIDE.md`
- **Dependencies**: `DEPENDENCIES.md`
- **Troubleshooting**: `TROUBLESHOOTING_INSTALL.md`
- **Main Docs**: `README.md`

---

## 💡 Pro Tips

- Keep both terminals open while using app
- First run downloads Whisper model (~140MB)
- Use Chrome/Edge for best compatibility
- Allow camera permissions for Live Interview
- Press CTRL+C to stop servers

---

**Need help?** See `INSTALLATION_GUIDE.md` for detailed instructions.
