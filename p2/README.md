# AI Interview Analyzer

A production-ready full-stack application that analyzes interview videos using local AI models. Provides detailed feedback on facial expressions, body language, and speech patterns without requiring external APIs or paid services.

## 🚨 UPLOAD NOT WORKING? → Read `START_HERE.md`

**Quick Fix:** The backend server needs to be running. Double-click `START_BACKEND.bat` or see `START_HERE.md` for instructions.

## Features

- 📹 **Video Upload Analysis**: Upload interview videos for comprehensive analysis
- 🎥 **Live Interview Mode**: Real-time facial feedback using webcam
- 👁️ **Facial Metrics**: Eye contact, head stability, smile detection, face presence
- 🎤 **Speech Analysis**: Speech rate, filler words, pitch analysis, energy stability
- 📊 **Visual Dashboard**: Interactive charts and detailed feedback
- 💾 **SQLite Storage**: Local database for interview history
- 🔒 **100% Local**: No external APIs, all processing runs on your machine

## Tech Stack

### Backend
- FastAPI - Modern Python web framework
- OpenCV - Video processing
- MediaPipe - Facial landmark detection
- Whisper - Speech-to-text transcription
- Librosa - Audio analysis
- SQLite - Database
- FFmpeg - Audio extraction

### Frontend
- React + Vite - Fast development
- Tailwind CSS - Modern styling
- Recharts - Data visualization
- Axios - API communication

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry
├── database.py             # Database configuration
├── models.py               # SQLAlchemy ORM models
├── schemas.py              # Pydantic validation schemas
├── routers/
│   ├── upload.py          # Video upload endpoint
│   ├── live.py            # Live interview WebSocket
│   └── results.py         # Results retrieval
├── services/
│   ├── video_processing.py    # Facial analysis
│   ├── audio_processing.py    # Speech analysis
│   ├── scoring_engine.py      # Confidence scoring
│   └── file_handler.py        # File management
└── utils/

frontend/
├── src/
│   ├── components/
│   │   ├── UploadForm.jsx     # Video upload UI
│   │   ├── LiveInterview.jsx  # Webcam interface
│   │   ├── Dashboard.jsx      # Results display
│   │   ├── ScoreCard.jsx      # Score visualization
│   │   └── Charts.jsx         # Metrics charts
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   └── Results.jsx        # Results page
│   └── api/
│       └── api.js             # API client
```

## Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- FFmpeg (for audio extraction)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Usage

### Upload Mode
1. Navigate to the home page
2. Click "Upload Video" tab
3. Select an interview video file
4. Wait for processing (may take a few minutes)
5. View detailed results and feedback

### Live Mode
1. Click "Live Interview" tab
2. Allow camera access
3. Click "Start Live Interview"
4. See real-time facial metrics
5. Click "Stop Recording" when done

## Metrics Explained

### Facial Metrics (0-1 normalized)
- **Eye Contact**: Measures gaze direction toward camera
- **Head Stability**: Tracks head movement variance
- **Smile Score**: Detects positive facial expressions
- **Face Presence**: Percentage of time face is visible

### Speech Metrics
- **Speech Rate**: Words per minute (optimal: 120-160 WPM)
- **Filler Percentage**: Frequency of "um", "uh", "like", etc.
- **Pitch Mean**: Average vocal pitch in Hz
- **Pitch Variance**: Pitch stability indicator
- **Energy Stability**: Vocal volume consistency

### Confidence Score (0-100)
Weighted formula:
- 25% Eye Contact
- 20% Head Stability
- 10% Smile
- 20% Speech Rate
- 15% Filler Words
- 10% Energy Stability

## API Endpoints

- `POST /api/upload` - Upload and analyze video
- `GET /api/results/{id}` - Get analysis results
- `GET /api/history` - List recent interviews
- `DELETE /api/results/{id}` - Delete interview
- `WS /api/live` - WebSocket for live analysis

## Performance Optimization

- Frames sampled every 10th frame for video processing
- Whisper base model for CPU compatibility
- Uploaded videos deleted after processing
- Efficient MediaPipe face mesh tracking
- Lazy loading of ML models

## Troubleshooting

### FFmpeg not found
Install FFmpeg:
- Windows: Download from ffmpeg.org
- Mac: `brew install ffmpeg`
- Linux: `sudo apt-get install ffmpeg`

### Whisper model download
First run will download the Whisper base model (~140MB). Ensure internet connection.

### Camera access denied
Check browser permissions for camera access in live mode.

## Future Enhancements

- [ ] Multi-language support
- [ ] Export results as PDF
- [ ] Comparison with previous interviews
- [ ] Custom scoring weights
- [ ] Practice mode with tips
- [ ] Mobile app version

## License

MIT License - feel free to use for personal or commercial projects.

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
