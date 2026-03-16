# 📦 Dependencies Guide

Complete list of all dependencies required for the AI Interview Analyzer application.

---

## 🔧 System Requirements

### Operating System
- **Windows**: 10 or 11
- **macOS**: 10.15 (Catalina) or higher
- **Linux**: Ubuntu 20.04+, Debian 10+, or equivalent

### Hardware
- **CPU**: Dual-core processor (Quad-core recommended)
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free space
- **Camera**: Required for Live Interview feature
- **Microphone**: Required for audio recording

---

## 🐍 Python Dependencies (Backend)

### Required Python Version
- **Python 3.8 or higher** (3.11 recommended)
- Download: https://www.python.org/downloads/

### Core Framework (API & Server)
```
fastapi==0.109.0              # Modern web framework
uvicorn[standard]==0.27.0     # ASGI server with WebSocket
python-multipart==0.0.6       # File upload support
sqlalchemy==2.0.25            # Database ORM
pydantic>=2.0.0               # Data validation
websockets>=11.0              # WebSocket support
```

### Computer Vision & Video Processing
```
opencv-python-headless==4.9.0.80  # Video processing (no GUI)
mediapipe==0.10.9                 # Face detection & landmarks
```

**Why these versions?**
- `opencv-python-headless`: Lighter version without GUI dependencies
- `mediapipe`: Google's optimized ML solutions for real-time face analysis

### Audio Processing & Speech Recognition
```
openai-whisper                # Speech-to-text AI model
librosa==0.10.1               # Audio feature extraction
soundfile>=0.12.1             # Audio file I/O
audioread>=3.0.0              # Audio file reading
ffmpeg-python>=0.2.0          # FFmpeg Python wrapper
```

**Important**: FFmpeg must be installed separately on your system!

### Scientific Computing
```
numpy>=1.24.0,<2.0.0          # Numerical computing
scipy>=1.10.0,<2.0.0          # Scientific algorithms
```

**Note**: Version constraints prevent compatibility issues with other packages.

### Document Processing
```
PyPDF2==3.0.1                 # PDF file reading
python-docx==1.1.0            # Word document reading
```

### Utilities
```
setuptools>=65.0.0            # Package management
python-dotenv>=1.0.0          # Environment variables
```

### AI/LLM Integration (Optional)
```
google-generativeai>=0.8.0    # Google Gemini API
```

**Note**: Only required for enhanced AI Interview feature. App works without it.

### Installation Command
```bash
cd backend
pip install -r requirements.txt
```

**First Run Note**: Whisper model (~140MB) will be downloaded automatically on first use.

---

## 📦 Node.js Dependencies (Frontend)

### Required Node.js Version
- **Node.js 16 or higher** (18 LTS recommended)
- Download: https://nodejs.org/

### Core Dependencies
```json
{
  "react": "^18.2.0",              // UI framework
  "react-dom": "^18.2.0",          // React DOM rendering
  "react-router-dom": "^6.21.1",   // Client-side routing
  "axios": "^1.6.5",               // HTTP client
  "framer-motion": "^10.18.0",     // Animation library
  "lucide-react": "^0.309.0",      // Icon library
  "recharts": "^2.10.3"            // Chart library
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^4.2.1",  // Vite React plugin
  "vite": "^5.0.11",                 // Build tool
  "tailwindcss": "^3.4.1",           // CSS framework
  "autoprefixer": "^10.4.16",        // CSS post-processor
  "postcss": "^8.4.33"               // CSS transformer
}
```

### Installation Command
```bash
cd frontend
npm install
```

**Installation Time**: 2-5 minutes depending on internet speed.

---

## 🎬 External Dependencies

### FFmpeg (Required)
**Purpose**: Audio extraction and processing from video files

**Installation:**

**Windows:**
```bash
# Option 1: Using winget
winget install ffmpeg

# Option 2: Manual
# Download from https://ffmpeg.org/download.html
# Extract and add bin folder to PATH
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Verify Installation:**
```bash
ffmpeg -version
```

---

## 📊 Dependency Size Breakdown

### Backend (Python)
- **Virtual Environment**: ~500MB
- **Installed Packages**: ~1.5GB
- **Whisper Model** (first run): ~140MB
- **Total**: ~2.1GB

### Frontend (Node.js)
- **node_modules**: ~300MB
- **Build Output**: ~2MB
- **Total**: ~300MB

### System Tools
- **Python**: ~100MB
- **Node.js**: ~50MB
- **FFmpeg**: ~100MB
- **Total**: ~250MB

### Grand Total: ~2.7GB

---

## 🔄 Updating Dependencies

### Update Backend Dependencies
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install --upgrade -r requirements.txt
```

### Update Frontend Dependencies
```bash
cd frontend
npm update
```

### Check for Outdated Packages
```bash
# Backend
pip list --outdated

# Frontend
npm outdated
```

---

## 🔒 Security Considerations

### Backend
- All packages from PyPI (official Python package index)
- Regular security updates recommended
- Use virtual environment to isolate dependencies

### Frontend
- All packages from npm (official Node package registry)
- Run `npm audit` to check for vulnerabilities
- Update regularly with `npm update`

### Best Practices
```bash
# Check for security issues
pip check                    # Backend
npm audit                    # Frontend

# Fix security issues
pip install --upgrade <package>
npm audit fix
```

---

## 🐛 Common Dependency Issues

### Issue: "No module named 'cv2'"
**Solution:**
```bash
pip install opencv-python-headless==4.9.0.80
```

### Issue: "Cannot find module 'react'"
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "FFmpeg not found"
**Solution:**
- Install FFmpeg using system package manager
- Add FFmpeg to system PATH
- Restart terminal after installation

### Issue: "numpy version conflict"
**Solution:**
```bash
pip install "numpy>=1.24.0,<2.0.0" --force-reinstall
```

### Issue: "SSL certificate error" during pip install
**Solution:**
```bash
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
```

---

## 📝 Dependency Licenses

### Backend
- **FastAPI**: MIT License
- **OpenCV**: Apache 2.0 License
- **MediaPipe**: Apache 2.0 License
- **Whisper**: MIT License
- **SQLAlchemy**: MIT License

### Frontend
- **React**: MIT License
- **Vite**: MIT License
- **Tailwind CSS**: MIT License
- **Framer Motion**: MIT License
- **Recharts**: MIT License

**All dependencies are open-source and free for commercial use.**

---

## 🔍 Verifying Installation

### Check Python Packages
```bash
cd backend
source venv/bin/activate
pip list
```

Expected output should include all packages from requirements.txt.

### Check Node Packages
```bash
cd frontend
npm list --depth=0
```

Expected output should show all packages from package.json.

### Check System Tools
```bash
python --version    # Should show 3.8+
node --version      # Should show 16+
npm --version       # Should show 8+
ffmpeg -version     # Should show FFmpeg info
```

---

## 📚 Additional Resources

- **Python Packages**: https://pypi.org/
- **Node Packages**: https://www.npmjs.com/
- **FFmpeg Documentation**: https://ffmpeg.org/documentation.html
- **React Documentation**: https://react.dev/
- **FastAPI Documentation**: https://fastapi.tiangolo.com/

---

## 🆘 Need Help?

If you encounter dependency issues:

1. Check this guide for common solutions
2. See `INSTALLATION_GUIDE.md` for detailed setup
3. See `TROUBLESHOOTING_INSTALL.md` for specific errors
4. Ensure all prerequisites are correctly installed
5. Try reinstalling dependencies from scratch

---

**Last Updated**: Compatible with Python 3.8-3.11 and Node.js 16-20
