# AI Interview Analyzer

A full-stack application that analyzes interview videos using local AI models. Get detailed feedback on facial expressions, body language, and speech patterns without requiring external APIs or paid services.

---

## 📚 Documentation Quick Links

**New to the project? Start here:**

| Guide | Description | Best For |
|-------|-------------|----------|
| [🚀 Quick Start](QUICK_START.md) | Get running in 5 minutes | Beginners |
| [📖 Installation Guide](INSTALLATION_GUIDE.md) | Complete setup with troubleshooting | First-time setup |
| [📦 Single Requirements File](COMPLETE_INSTALLATION.md) | Install from one file: `requirements-all.txt` | Simplified setup |
| [📋 Setup Summary](SETUP_SUMMARY.md) | Quick reference for all setup info | Quick lookup |
| [📦 Dependencies](DEPENDENCIES.md) | All packages and versions | Understanding requirements |
| [🐛 Troubleshooting](TROUBLESHOOTING_INSTALL.md) | Common issues and solutions | Problem solving |
| [📄 Cheat Sheet](INSTALL_CHEATSHEET.md) | One-page command reference | Quick commands |

**📚 [View All Documentation](DOCUMENTATION_INDEX.md)** - Complete documentation index

**⚡ Single Requirements File:** All dependencies are now in [`requirements-all.txt`](requirements-all.txt) - see [COMPLETE_INSTALLATION.md](COMPLETE_INSTALLATION.md) for usage.

---

## 🚀 Quick Start

### 📖 New to the Project?

**Start here for step-by-step instructions:**
- **Complete Guide**: See [`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md) - Detailed installation with troubleshooting
- **Quick Setup**: See [`QUICK_START.md`](QUICK_START.md) - Get running in 5 minutes

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
# Double-click or run:
INSTALL_AI_FEATURE.bat
run.bat
```

**Linux/Mac:**
```bash
chmod +x install_ai_feature.sh run.sh
./install_ai_feature.sh
./run.sh
```

### Option 2: Manual Setup

Follow the instructions in [`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md) for detailed steps.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Python 3.8 or higher**
   - Download: https://www.python.org/downloads/
   - Verify: `python --version` or `python3 --version`

2. **Node.js 16 or higher**
   - Download: https://nodejs.org/
   - Verify: `node --version`

3. **FFmpeg** (Required for audio extraction)
   - **Windows**: Download from https://ffmpeg.org/download.html
     - Extract and add to PATH, or use: `winget install ffmpeg`
   - **Mac**: `brew install ffmpeg`
   - **Linux**: `sudo apt-get install ffmpeg` or `sudo yum install ffmpeg`
   - Verify: `ffmpeg -version`

4. **Git** (for cloning)
   - Download: https://git-scm.com/downloads

---

## 🛠️ Installation

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-folder>
```

### Step 2: Backend Setup

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

# Install dependencies
pip install -r requirements.txt

# Create uploads and temp directories
mkdir uploads temp

# Copy environment file (optional)
cp .env.example .env

# (Optional) Configure Gemini API for AI Interview feature
# Edit .env and add your Gemini API key
# See GEMINI_SETUP.md for detailed instructions
```

**Optional - Gemini API Setup:**
For enhanced AI-powered interview questions and answer analysis, configure Google Gemini API:
1. Get API key from https://makersuite.google.com/app/apikey
2. Add to `backend/.env`: `GEMINI_API_KEY=your_key_here`
3. See `GEMINI_SETUP.md` for complete guide

**Note:** First run will download the Whisper AI model (~140MB). Ensure you have internet connection.

### Step 3: Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

You need to run both backend and frontend servers simultaneously.

### Terminal 1: Start Backend

```bash
cd backend

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000

### Terminal 2: Start Frontend

```bash
cd frontend

# Run development server
npm run dev
```

Frontend will be available at: http://localhost:5173

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

---

## 🎯 Features

### 1. Video Upload Analysis
- Upload pre-recorded interview videos
- Comprehensive analysis of facial expressions and speech
- Detailed metrics and feedback

### 2. Live Interview Mode
- Real-time webcam analysis
- Instant facial feedback
- Practice mode for interview preparation

### 3. AI-Powered Interview
- Interactive AI interviewer
- Resume-based question generation
- Real-time conversation and feedback

### 4. Detailed Metrics

**Facial Analysis:**
- Eye contact tracking
- Head stability measurement
- Smile detection
- Face presence monitoring

**Speech Analysis:**
- Speech rate (words per minute)
- Filler word detection
- Pitch analysis
- Energy stability
- Transcription

**Overall Score:**
- Confidence score (0-100)
- Weighted metrics
- Actionable feedback

---

## 📁 Project Structure

```
.
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── config.py                  # Configuration settings
│   ├── database.py                # Database setup
│   ├── models.py                  # SQLAlchemy models
│   ├── schemas.py                 # Pydantic schemas
│   ├── requirements.txt           # Python dependencies
│   ├── routers/
│   │   ├── upload.py             # Video upload endpoints
│   │   ├── live.py               # Live interview WebSocket
│   │   ├── ai_interview.py       # AI interview endpoints
│   │   └── results.py            # Results endpoints
│   ├── services/
│   │   ├── video_processing.py   # Facial analysis
│   │   ├── audio_processing.py   # Speech analysis
│   │   ├── ai_interviewer.py     # AI interview logic
│   │   ├── scoring_engine.py     # Score calculation
│   │   └── file_handler.py       # File management
│   ├── uploads/                   # Uploaded videos (auto-created)
│   └── temp/                      # Temporary files (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadForm.jsx    # Video upload UI
│   │   │   ├── LiveInterview.jsx # Webcam interface
│   │   │   ├── AIInterview.jsx   # AI interview UI
│   │   │   ├── Dashboard.jsx     # Results display
│   │   │   ├── ScoreCard.jsx     # Score visualization
│   │   │   └── Charts.jsx        # Metrics charts
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   └── Results.jsx       # Results page
│   │   ├── api/
│   │   │   └── api.js            # API client
│   │   └── App.jsx               # Main app component
│   ├── package.json              # Node dependencies
│   └── vite.config.js            # Vite configuration
│
├── run.bat / run.sh              # Quick start scripts
├── INSTALL_AI_FEATURE.bat        # Windows installer
└── install_ai_feature.sh         # Linux/Mac installer
```

---

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env` or `backend/config.py`:

```python
# Database
DATABASE_URL=sqlite:///./interview_analyzer.db

# Server
HOST=0.0.0.0
PORT=8000

# File Upload
MAX_UPLOAD_SIZE=100000000  # 100MB
UPLOAD_DIR=uploads
TEMP_DIR=temp

# Processing
FRAME_SAMPLE_RATE=10        # Process every 10th frame
WHISPER_MODEL=base          # Options: tiny, base, small, medium, large
```

### Frontend Configuration

Edit `frontend/src/api/api.js` if backend URL changes:

```javascript
const API_BASE_URL = 'http://localhost:8000';
```

---

## 🐛 Troubleshooting

### Issue: "Upload not working" or "Connection refused"

**Solution:** Make sure the backend server is running.
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Issue: "FFmpeg not found"

**Solution:** Install FFmpeg and add to PATH
- Windows: Download from https://ffmpeg.org, extract, and add bin folder to system PATH
- Mac: `brew install ffmpeg`
- Linux: `sudo apt-get install ffmpeg`

### Issue: "Module not found" errors

**Solution:** Reinstall dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Issue: "Port already in use"

**Solution:** Change the port or kill the process
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Issue: Whisper model download fails

**Solution:** Download manually or use smaller model
```python
# In backend/config.py, change:
WHISPER_MODEL = "tiny"  # Smaller, faster model
```

### Issue: Camera not working in Live Mode

**Solution:** 
- Check browser permissions (allow camera access)
- Use HTTPS or localhost only
- Try a different browser (Chrome recommended)

### Issue: "Virtual environment not activating"

**Solution:**
```bash
# Windows PowerShell (if scripts disabled)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate
venv\Scripts\activate
```

### Issue: Database errors

**Solution:** Delete and recreate database
```bash
cd backend
rm interview_analyzer.db
# Restart backend - database will be recreated
```

---

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

```
POST   /api/upload              # Upload video for analysis
GET    /api/results/{id}        # Get analysis results
GET    /api/history             # List all interviews
DELETE /api/results/{id}        # Delete interview
WS     /api/live                # WebSocket for live analysis
POST   /api/ai-interview/start  # Start AI interview
POST   /api/ai-interview/message # Send message to AI
```

---

## 🧪 Testing

### Test Backend

```bash
cd backend
python test_backend.py
python test_api.py
python test_upload.py
```

### Test AI Interview

```bash
python test_ai_interview.py
```

---

## 🚀 Production Deployment

### Backend

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend

```bash
# Build for production
cd frontend
npm run build

# Serve with any static server
npm install -g serve
serve -s dist -p 5173
```

---

## 🔒 Security Notes

- All processing happens locally - no data sent to external servers
- Uploaded videos are deleted after processing
- SQLite database stores only metadata and metrics
- No authentication required for local use
- Add authentication before deploying publicly

---

## 💡 Tips for Best Results

1. **Video Quality**: Use well-lit videos with clear face visibility
2. **Audio Quality**: Ensure clear audio for accurate transcription
3. **File Size**: Keep videos under 100MB for faster processing
4. **Camera Position**: Face the camera directly in live mode
5. **Speech**: Speak clearly at a moderate pace (120-160 WPM optimal)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - feel free to use for personal or commercial projects.

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review existing documentation files:
   - `AI_INTERVIEW_FEATURE.md`
   - `AI_INTERVIEW_SETUP.md`
   - `COMBINED_INTERVIEW_FEATURE.md`
3. Check API documentation at http://localhost:8000/docs
4. Open an issue on GitHub

---

## 🎓 Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- OpenCV - Video processing
- MediaPipe - Facial landmark detection
- Whisper - Speech-to-text transcription
- Librosa - Audio analysis
- SQLAlchemy - ORM
- SQLite - Database

**Frontend:**
- React 18 - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Recharts - Data visualization
- Axios - HTTP client

---

## 🌟 Acknowledgments

- OpenAI Whisper for speech recognition
- Google MediaPipe for facial analysis
- FastAPI for the excellent web framework
- React and Vite communities

---

**Happy Interviewing! 🎤📹**
