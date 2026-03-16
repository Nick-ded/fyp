# 🚀 Quick Start Guide

Get the AI Interview Analyzer running in 5 minutes!

---

## ⚡ Super Quick Start (Automated)

### Windows Users:
1. Double-click `INSTALL_AI_FEATURE.bat` (installs everything)
2. Double-click `run.bat` (starts the app)
3. Open browser to http://localhost:5173

### Mac/Linux Users:
```bash
chmod +x install_ai_feature.sh run.sh
./install_ai_feature.sh
./run.sh
```
Then open browser to http://localhost:5173

---

## 📋 Prerequisites Checklist

Before starting, install these (one-time setup):

- [ ] **Python 3.8+** → https://www.python.org/downloads/
- [ ] **Node.js 16+** → https://nodejs.org/
- [ ] **FFmpeg** → https://ffmpeg.org/download.html

**Verify installations:**
```bash
python --version    # Should show 3.8 or higher
node --version      # Should show 16 or higher
ffmpeg -version     # Should show FFmpeg info
```

---

## 🛠️ Manual Installation (5 Steps)

### Step 1: Install Backend Dependencies
```bash
cd backend
python -m venv venv

# Activate virtual environment:
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux

pip install -r ../requirements-all.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 3: Create Required Folders
```bash
cd backend
mkdir uploads temp    # Windows
mkdir -p uploads temp # Mac/Linux
```

### Step 4: Start Backend (Terminal 1)
```bash
cd backend
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 5: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### Step 6: Open Browser
Go to: **http://localhost:5173**

---

## ✅ Verify It's Working

1. **Backend Check**: Open http://localhost:8000/docs
   - You should see API documentation

2. **Frontend Check**: Open http://localhost:5173
   - You should see the homepage

3. **Feature Check**: Click "Interviews" in navbar
   - You should see Upload, AI Interview, and Live Interview tabs

---

## 🎯 What Can You Do?

### 1. Upload & Analyze Videos
- Click "Interviews" → "Upload" tab
- Upload a video file
- Get detailed analysis and feedback

### 2. Live Interview Practice
- Click "Interviews" → "Live Interview" tab
- Allow camera access
- Practice with real-time feedback

### 3. AI-Powered Interview
- Click "Interviews" → "AI Interview" tab
- Upload resume and job description
- Get personalized interview questions

---

## 🐛 Quick Troubleshooting

### "Python not found"
- Reinstall Python with "Add to PATH" checked
- Or use `python3` instead of `python`

### "FFmpeg not found"
- Install FFmpeg and restart terminal
- Windows: Add FFmpeg to system PATH

### "Port already in use"
- Kill the process or use different port:
  ```bash
  uvicorn main:app --reload --port 8001
  ```

### "Module not found"
- Reinstall dependencies:
  ```bash
  pip install -r ../requirements-all.txt
  npm install
  ```

### "Camera not working"
- Allow camera permissions in browser
- Use Chrome or Edge browser
- Check if another app is using camera

---

## 📚 Need More Help?

- **Detailed Installation**: See `INSTALLATION_GUIDE.md`
- **Full Documentation**: See `README.md`
- **API Docs**: http://localhost:8000/docs
- **Troubleshooting**: See `TROUBLESHOOTING_INSTALL.md`

---

## 🎉 You're All Set!

The application is now running:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

Start by clicking "Interviews" in the navigation bar and explore the features!

---

**Pro Tip**: Keep both terminal windows open while using the app. Press `CTRL+C` in each terminal to stop the servers when done.
