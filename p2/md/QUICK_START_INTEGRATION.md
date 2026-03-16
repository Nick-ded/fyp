# Quick Start - Frontend & Backend Integration

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend (Terminal 1)

```bash
cd backend
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open Your Browser

Navigate to: **http://localhost:5173**

## 🎯 Try the AI Interview Feature

1. Click **"Start Interview"** button or navigate to `/home`
2. Select the **"🤖 AI Interview"** tab
3. Upload your resume (PDF, DOCX, or TXT)
4. Paste a job description
5. Click **"Start AI Interview"**
6. Answer questions using your microphone
7. Get instant feedback and scores!

## 🎥 Try the Live Interview Feature

1. Navigate to `/home`
2. Select the **"🎥 Live Interview"** tab
3. Upload resume and job description
4. Click **"Start Live Interview"**
5. Allow camera/microphone access
6. Answer questions (combines video + AI analysis)
7. View comprehensive results!

## ✅ What's Working

- ✅ Resume upload and text extraction
- ✅ AI question generation (powered by Gemini)
- ✅ Audio recording and transcription
- ✅ Answer scoring and feedback
- ✅ Video analysis (optional)
- ✅ Session management
- ✅ Results dashboard

## 🔧 Configuration

Make sure `backend/.env` has:
```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

## 📱 Browser Requirements

- Chrome, Firefox, or Edge (latest versions)
- Microphone access required
- Camera access optional (for Live Interview)

## 🐛 Common Issues

**Backend won't start?**
- Check if port 8000 is available
- Verify Python dependencies: `pip install -r requirements.txt`

**Frontend won't start?**
- Check if port 5173 is available
- Run: `npm install` first

**Microphone not working?**
- Grant microphone permissions in browser
- Use HTTPS or localhost only

**No questions generated?**
- Verify Gemini API key is set
- Check resume file is readable
- Ensure job description is provided

## 🎉 You're All Set!

The frontend is now fully integrated with the backend. All AI interview features are working and ready to use!
