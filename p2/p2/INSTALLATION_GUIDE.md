# 🚀 Complete Installation Guide - AI Interview Analyzer

This guide will help you install and run the AI Interview Analyzer application from scratch. Follow these steps carefully.

---

## 📋 System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 2GB free space
- **Internet**: Required for initial setup and dependency downloads

---

## 🔧 Step 1: Install Prerequisites

### 1.1 Install Python (3.8 or higher)

**Windows:**
1. Download Python from https://www.python.org/downloads/
2. Run the installer
3. ✅ **IMPORTANT**: Check "Add Python to PATH" during installation
4. Verify installation:
   ```bash
   python --version
   ```

**macOS:**
```bash
# Using Homebrew (recommended)
brew install python@3.11

# Verify
python3 --version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
python3 --version
```

### 1.2 Install Node.js (16 or higher)

**Windows & macOS:**
1. Download from https://nodejs.org/ (LTS version recommended)
2. Run the installer
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

### 1.3 Install FFmpeg (Required for audio processing)

**Windows:**

Option A - Using winget (Windows 10/11):
```bash
winget install ffmpeg
```

Option B - Manual installation:
1. Download from https://ffmpeg.org/download.html
2. Extract the zip file
3. Add the `bin` folder to your system PATH
4. Restart your terminal

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Verify FFmpeg installation:**
```bash
ffmpeg -version
```

### 1.4 Install Git (Optional, for cloning)

**Windows:**
Download from https://git-scm.com/downloads

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

---

## 📦 Step 2: Download the Application

### Option A: Using Git (Recommended)
```bash
git clone <your-repository-url>
cd ai-interview-analyzer
```

### Option B: Download ZIP
1. Download the project as ZIP from GitHub
2. Extract to a folder
3. Open terminal/command prompt in that folder

---

## 🔨 Step 3: Backend Setup

### 3.1 Navigate to Backend Folder
```bash
cd backend
```

### 3.2 Create Virtual Environment

**Windows:**
```bash
python -m venv venv
```

**macOS/Linux:**
```bash
python3 -m venv venv
```

### 3.3 Activate Virtual Environment

**Windows (Command Prompt):**
```bash
venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

If you get an error about execution policy:
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` at the beginning of your command prompt.

### 3.4 Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Note:** This will take 5-10 minutes. The first time you run the app, it will also download the Whisper AI model (~140MB).

### 3.5 Create Required Directories

**Windows:**
```bash
mkdir uploads
mkdir temp
```

**macOS/Linux:**
```bash
mkdir -p uploads temp
```

### 3.6 Configure Environment (Optional)

For AI Interview feature with Gemini API:

1. Copy the example environment file:
   ```bash
   copy .env.example .env     # Windows
   cp .env.example .env       # macOS/Linux
   ```

2. Get a Gemini API key from https://makersuite.google.com/app/apikey

3. Edit `.env` file and add your key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

**Note:** The app works without Gemini API, but AI Interview feature will have limited functionality.

---

## 🎨 Step 4: Frontend Setup

### 4.1 Open New Terminal

Keep the backend terminal open. Open a **new terminal window**.

### 4.2 Navigate to Frontend Folder

```bash
cd frontend
```

(If you're in the backend folder: `cd ../frontend`)

### 4.3 Install Node Dependencies

```bash
npm install
```

This will take 2-5 minutes.

---

## ▶️ Step 5: Run the Application

You need **TWO terminal windows** running simultaneously.

### Terminal 1: Start Backend Server

```bash
# Navigate to backend folder
cd backend

# Activate virtual environment
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ Backend is now running at: **http://localhost:8000**

### Terminal 2: Start Frontend Server

```bash
# Navigate to frontend folder
cd frontend

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

✅ Frontend is now running at: **http://localhost:5173**

### 5.3 Access the Application

Open your web browser and go to:

🌐 **http://localhost:5173**

You should see the AI Interview Analyzer homepage!

---

## 🎯 Quick Start Scripts (Alternative Method)

Instead of manual setup, you can use the provided scripts:

### Windows:
```bash
# Install everything
INSTALL_AI_FEATURE.bat

# Run the application
run.bat
```

### macOS/Linux:
```bash
# Make scripts executable
chmod +x install_ai_feature.sh run.sh

# Install everything
./install_ai_feature.sh

# Run the application
./run.sh
```

---

## ✅ Verify Installation

### Test Backend API

Open http://localhost:8000/docs in your browser. You should see the API documentation.

### Test Frontend

1. Go to http://localhost:5173
2. You should see the landing page with navigation
3. Try clicking "Interviews" in the navbar

### Test Upload Feature

1. Click "Interviews" → "Upload" tab
2. Try uploading a video file
3. Check if analysis starts

---

## 🐛 Common Issues & Solutions

### Issue 1: "Python not found" or "python is not recognized"

**Solution:**
- Reinstall Python and check "Add to PATH"
- Or use full path: `C:\Python311\python.exe` (adjust version)
- On macOS/Linux, use `python3` instead of `python`

### Issue 2: "pip not found"

**Solution:**
```bash
python -m ensurepip --upgrade
python -m pip install --upgrade pip
```

### Issue 3: "Cannot activate virtual environment" (Windows PowerShell)

**Solution:**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 4: "FFmpeg not found"

**Solution:**
- Verify installation: `ffmpeg -version`
- Windows: Add FFmpeg to PATH and restart terminal
- Reinstall using package manager

### Issue 5: "Port 8000 already in use"

**Solution:**

**Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:8000 | xargs kill -9
```

Or change the port:
```bash
uvicorn main:app --reload --port 8001
```

### Issue 6: "Port 5173 already in use"

**Solution:**
```bash
# Kill the process or the frontend will auto-select another port
# Just use the new port shown in the terminal
```

### Issue 7: "Module not found" errors

**Solution:**
```bash
# Backend
cd backend
pip install -r requirements.txt --force-reinstall

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 8: "Camera not working" in Live Interview

**Solution:**
- Allow camera permissions in browser
- Use Chrome or Edge (best compatibility)
- Check if another app is using the camera
- Try HTTPS or localhost only

### Issue 9: Slow video processing

**Solution:**
- Use smaller videos (under 50MB)
- Reduce video resolution before upload
- Change Whisper model to "tiny" in `backend/config.py`:
  ```python
  WHISPER_MODEL = "tiny"
  ```

### Issue 10: "Database locked" error

**Solution:**
```bash
cd backend
rm interview_analyzer.db
# Restart backend - database will be recreated
```

---

## 📱 Browser Compatibility

**Recommended:**
- ✅ Google Chrome (latest)
- ✅ Microsoft Edge (latest)
- ✅ Firefox (latest)

**Limited Support:**
- ⚠️ Safari (camera features may have issues)
- ❌ Internet Explorer (not supported)

---

## 🔄 Updating the Application

```bash
# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt --upgrade

# Update frontend dependencies
cd ../frontend
npm install
```

---

## 🛑 Stopping the Application

### Stop Backend:
Press `CTRL + C` in the backend terminal

### Stop Frontend:
Press `CTRL + C` in the frontend terminal

### Deactivate Virtual Environment:
```bash
deactivate
```

---

## 📚 Next Steps

After successful installation:

1. **Read the User Guide**: Check `README.md` for feature details
2. **Test Features**: Try Upload, Live Interview, and AI Interview modes
3. **Configure Gemini API**: For enhanced AI features (see `GEMINI_SETUP.md`)
4. **Explore API**: Visit http://localhost:8000/docs

---

## 🆘 Still Having Issues?

1. Check `TROUBLESHOOTING_INSTALL.md` for detailed solutions
2. Review `README.md` for feature-specific help
3. Check the API documentation at http://localhost:8000/docs
4. Ensure all prerequisites are correctly installed
5. Try the automated installation scripts

---

## 📞 Support Resources

- **API Documentation**: http://localhost:8000/docs
- **Project Documentation**: See all `.md` files in the project root
- **GitHub Issues**: Report bugs or request features

---

## ✨ Success Checklist

Before considering installation complete, verify:

- [ ] Python 3.8+ installed and in PATH
- [ ] Node.js 16+ installed
- [ ] FFmpeg installed and working
- [ ] Backend virtual environment created and activated
- [ ] All Python dependencies installed (`pip list` shows packages)
- [ ] Frontend dependencies installed (`node_modules` folder exists)
- [ ] Backend server starts without errors (port 8000)
- [ ] Frontend server starts without errors (port 5173)
- [ ] Can access http://localhost:5173 in browser
- [ ] Can access http://localhost:8000/docs in browser
- [ ] Homepage loads correctly with navigation
- [ ] Can navigate between different sections

---

**Congratulations! 🎉 You're ready to use the AI Interview Analyzer!**

For usage instructions, see `README.md` or visit the application at http://localhost:5173
