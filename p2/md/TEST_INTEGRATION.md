# Frontend-Backend Integration Test Guide

## Overview
The frontend has been successfully integrated with the backend AI interview system.

## What Was Updated

### 1. API Layer (`frontend/src/api/api.js`)
Added new API functions for AI interview features:
- `startAIInterview()` - Start a new AI interview session with resume and job description
- `submitAnswer()` - Submit audio/text answers for analysis
- `completeInterview()` - Complete interview and get overall results
- `getAISession()` - Get session details
- `getAIInterviewHistory()` - Get list of past interviews

### 2. Components Updated

#### AIInterview Component (`frontend/src/components/AIInterview.jsx`)
- Now uses the new API functions instead of direct axios calls
- Properly handles resume upload and question generation
- Records audio answers and submits them for analysis
- Displays results with scores and feedback

#### LiveInterview Component (`frontend/src/components/LiveInterview.jsx`)
- Integrated with AI interview backend
- Combines video analysis with AI question generation
- Supports both audio and text answer submission
- Shows real-time metrics and final results

### 3. Navigation Updates

#### App.jsx
- Reordered routes for better flow
- `/home` route shows all interview options

#### Navbar Component
- Added "Interview Options" link to `/home`
- Updated CTA buttons to point to `/home`

#### HeroSection Component
- Updated CTA buttons to point to `/home` for better user flow

## How to Test

### 1. Start Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

Backend should start on `http://localhost:8000`

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend should start on `http://localhost:5173`

### 3. Test AI Interview Flow

1. Navigate to `http://localhost:5173/home`
2. Click on "AI Interview" tab
3. Upload a resume (PDF, DOCX, or TXT)
4. Paste a job description
5. Select number of questions (3-10)
6. Click "Start AI Interview"
7. Record answers using the microphone
8. Submit each answer
9. View final results with scores and feedback

### 4. Test Live Interview Flow

1. Navigate to `http://localhost:5173/home`
2. Click on "Live Interview" tab
3. Upload resume and job description
4. Click "Start Live Interview"
5. Allow camera/microphone access
6. Answer questions (minimum 5 seconds each)
7. View results with overall scores

## API Endpoints Used

### AI Interview Endpoints
- `POST /api/ai-interview/start` - Start interview session
- `POST /api/ai-interview/submit-answer` - Submit answer
- `POST /api/ai-interview/complete` - Complete interview
- `GET /api/ai-interview/session/{session_id}` - Get session
- `GET /api/ai-interview/history` - Get history

### Backend Configuration
- CORS enabled for `http://localhost:5173`
- Gemini API integration for AI features
- Audio transcription with Whisper
- Resume text extraction (PDF, DOCX, TXT)

## Environment Variables Required

Create `backend/.env` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
WHISPER_MODEL=base
DATABASE_URL=sqlite:///./interview_analyzer.db
```

## Features Working

✅ Resume upload and text extraction
✅ AI question generation based on resume and job description
✅ Audio recording and transcription
✅ Answer analysis with scoring
✅ Overall interview results calculation
✅ Real-time video analysis (optional)
✅ Session management
✅ Interview history

## Troubleshooting

### Backend Issues
- Ensure Gemini API key is set in `.env`
- Check if all Python dependencies are installed
- Verify database is created (`interview_analyzer.db`)

### Frontend Issues
- Clear browser cache if seeing old code
- Check browser console for errors
- Ensure backend is running on port 8000

### CORS Issues
- Backend already configured for `localhost:5173`
- If using different port, update `backend/main.py` CORS settings

## Next Steps

1. Test with real resume and job description
2. Verify audio recording works in your browser
3. Check that scores and feedback are meaningful
4. Test on different browsers (Chrome, Firefox, Edge)
5. Verify mobile responsiveness

## Notes

- Audio recording requires HTTPS or localhost
- Microphone permission must be granted
- Minimum answer duration is 5 seconds
- Resume must be readable (PDF, DOCX, or TXT)
- Job description should be detailed for better questions
