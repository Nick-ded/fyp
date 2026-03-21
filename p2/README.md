# Intrex — AI Interview Analyzer

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.10+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| FFmpeg | any | https://ffmpeg.org/download.html (add to PATH) |

---

## 1. Clone & enter the project

```bash
cd p2
```

---

## 2. Backend Setup

### 2a. Create a virtual environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2b. Install dependencies

```bash
pip install -r requirements.txt
```

> First install takes a few minutes (Whisper model download happens on first run).

> Python 3.12 note: `passlib` has a known compatibility bug with `bcrypt>=4.0`. The fix is already applied in `utils/auth.py` — no action needed.

### 2c. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

Open `backend/.env` and set:

| Variable | Required | Where to get it |
|----------|----------|-----------------|
| `SECRET_KEY` | YES | Run: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `GEMINI_API_KEY` | YES | https://aistudio.google.com/app/apikey |
| `GOOGLE_CLIENT_ID` | Only for Google login | https://console.cloud.google.com → Credentials |
| `GOOGLE_CLIENT_SECRET` | Only for Google login | Same as above |

`DATABASE_URL`, `HOST`, `PORT` already have working defaults — no changes needed.

### 2d. Start the backend

```bash
# Make sure you're in p2/backend/ with venv activated
python main.py
```

Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs

---

## 3. Frontend Setup

### 3a. Install dependencies

```bash
cd frontend
npm install
```

### 3b. Configure environment variables

```bash
cp .env.example .env
```

Open `frontend/.env` and set:

| Variable | Required | Where to get it |
|----------|----------|-----------------|
| `VITE_FIREBASE_API_KEY` | YES | Firebase Console → Project Settings → Your Apps → Web App |
| `VITE_FIREBASE_AUTH_DOMAIN` | YES | Same as above |
| `VITE_FIREBASE_PROJECT_ID` | YES | Same as above |
| `VITE_FIREBASE_STORAGE_BUCKET` | YES | Same as above |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | YES | Same as above |
| `VITE_FIREBASE_APP_ID` | YES | Same as above |
| `VITE_GEMINI_API_KEY` | Optional | https://aistudio.google.com/app/apikey |
| `VITE_GOOGLE_CLIENT_ID` | Only for Google login | https://console.cloud.google.com → Credentials |

> Firebase setup: Go to https://console.firebase.google.com → Create project → Add Web App → copy the config object values.

### 3c. Start the frontend

```bash
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 4. Verify everything works

1. Open http://localhost:5173
2. Click Sign Up and create an account
3. Go to Interview Selection and start an AI interview
4. Upload a resume (PDF or DOCX) and enter a job description

---

## Common Errors & Fixes

### `ModuleNotFoundError: No module named 'google.generativeai'`
```bash
pip install google-generativeai==0.8.3
```

### `FFmpeg not found`
Install FFmpeg and make sure it's in your PATH:
- Windows: Download from https://ffmpeg.org/download.html, extract, add `bin/` folder to system PATH
- Mac: `brew install ffmpeg`
- Linux: `sudo apt install ffmpeg`

### Firebase auth not working / login fails
All 6 `VITE_FIREBASE_*` variables in `frontend/.env` must be filled in with real values from your Firebase project. Placeholder values will silently disable auth.

### `Server configuration error: Google OAuth not configured`
Set `GOOGLE_CLIENT_ID` in `backend/.env`. The same Client ID must also be in `VITE_GOOGLE_CLIENT_ID` in `frontend/.env`.

### `SECRET_KEY` warning
Generate a real secret: `python -c "import secrets; print(secrets.token_hex(32))"` and paste it into `backend/.env`.

### Port already in use
Change the port in `backend/.env` (`PORT=8001`) and update `VITE_API_BASE_URL` in `frontend/.env` to match (`http://localhost:8001/api`).

---

## Project Structure

```
p2/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Your config (not committed)
│   ├── .env.example         # Template — copy to .env
│   ├── routers/             # API route handlers
│   ├── services/            # Business logic (AI, audio, etc.)
│   ├── utils/               # Auth, file validation, MFA
│   └── models.py            # Database models
└── frontend/
    ├── src/
    │   ├── App.jsx           # Routes
    │   ├── pages/            # Page components
    │   ├── components/       # Reusable UI
    │   ├── context/          # Auth & Theme context
    │   └── config/firebase.js
    ├── .env                  # Your config (not committed)
    └── .env.example          # Template — copy to .env
```
