# 🎯 AI Interview Feature - Complete Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [How It Works](#how-it-works)
4. [Installation](#installation)
5. [Usage Guide](#usage-guide)
6. [API Documentation](#api-documentation)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

The AI Interview feature transforms your interview analyzer into a complete interview preparation platform. It:

- **Analyzes** your resume and job description
- **Generates** relevant interview questions
- **Transcribes** your audio answers using Whisper AI
- **Scores** your responses on multiple dimensions
- **Provides** actionable feedback for improvement

### Key Features
✅ Resume parsing (PDF, DOCX, TXT)  
✅ AI-powered question generation  
✅ Audio recording and transcription  
✅ Multi-dimensional answer scoring  
✅ Real-time feedback  
✅ Knowledge score calculation  
✅ Session history tracking  

---

## 🚀 Quick Start

### Option 1: Automated Installation (Recommended)

**Windows:**
```bash
INSTALL_AI_FEATURE.bat
```

**Linux/Mac:**
```bash
chmod +x install_ai_feature.sh
./install_ai_feature.sh
```

### Option 2: Manual Installation

```bash
# 1. Install dependencies
cd backend
pip install PyPDF2==3.0.1 python-docx==1.1.0

# 2. Remove old database (to add new tables)
# Windows: del interview_analyzer.db
# Linux/Mac: rm interview_analyzer.db

# 3. Test the feature
cd ..
python test_ai_interview.py

# 4. Start backend
cd backend
python main.py

# 5. Start frontend (new terminal)
cd frontend
npm run dev
```

---

## 🔍 How It Works

### 1. Question Generation Algorithm

```
Input: Resume + Job Description
  ↓
Extract Skills (Python, React, SQL, etc.)
  ↓
Identify Job Role (Developer, Engineer, etc.)
  ↓
Generate Questions:
  - Technical (based on skills)
  - Behavioral (teamwork, problem-solving)
  - Role-specific (motivation, fit)
  ↓
Output: 3-10 tailored questions
```

### 2. Answer Analysis System

Each answer is scored on three dimensions:

#### Relevance Score (0-100)
- Does the answer address the question?
- Are relevant keywords mentioned?
- Is the topic discussed?

#### Completeness Score (0-100)
- Is the answer detailed enough? (50-150 words optimal)
- Does it have proper structure? (3-6 sentences)
- Is the duration appropriate?

#### Clarity Score (0-100)
- Are filler words minimized? (um, uh, like)
- Is the sentence structure clear?
- Is communication effective?

### 3. Knowledge Score Calculation

```
Overall Score = Average of all answer scores
Technical Score = Average of technical question scores
Behavioral Score = Average of behavioral question scores
```

---

## 💻 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- FFmpeg (for audio processing)
- Microphone access

### Step-by-Step Installation

#### 1. Backend Setup

```bash
cd backend

# Install new dependencies
pip install PyPDF2==3.0.1 python-docx==1.1.0

# Or install all requirements
pip install -r requirements.txt
```

#### 2. Database Migration

The feature adds two new tables:
- `ai_interview_sessions` - Stores session data
- `ai_interview_answers` - Stores answers and scores

```bash
# Backup existing database (optional)
cp interview_analyzer.db interview_analyzer.db.backup

# Remove old database
rm interview_analyzer.db  # Linux/Mac
del interview_analyzer.db  # Windows

# New database will be created automatically on startup
```

#### 3. Verify Installation

```bash
python test_ai_interview.py
```

Expected output:
```
✅ All tests completed successfully!
The AI Interview feature is working correctly.
```

#### 4. Start Services

```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 📖 Usage Guide

### For Candidates

#### Step 1: Prepare Materials
- Have your resume ready (PDF, DOCX, or TXT)
- Copy the job description you're applying for

#### Step 2: Start Interview
1. Open http://localhost:5173
2. Click **"🤖 AI Interview"** tab
3. Upload your resume
4. Paste the job description
5. Select number of questions (3-10)
6. Click **"Start AI Interview"**

#### Step 3: Answer Questions
For each question:
1. Read the question carefully
2. Click **"Start Recording"**
3. Speak your answer clearly
4. Click **"Stop Recording"**
5. Review or re-record if needed
6. Click **"Submit Answer"**

#### Step 4: Review Results
- View your overall knowledge score
- Check technical vs behavioral performance
- Read detailed feedback for each answer
- Identify areas for improvement

### Tips for Best Results

✅ **Speak clearly** - Minimize background noise  
✅ **Be specific** - Use examples from your experience  
✅ **Stay relevant** - Address the question directly  
✅ **Structure answers** - Use STAR method (Situation, Task, Action, Result)  
✅ **Avoid fillers** - Minimize "um", "uh", "like"  
✅ **Take time** - 30-60 seconds per answer is ideal  

---

## 📡 API Documentation

### Endpoint: Start Interview

```http
POST /api/ai-interview/start
Content-Type: multipart/form-data
```

**Request:**
```javascript
{
  resume: File,              // PDF, DOCX, or TXT
  job_description: string,   // Job posting text
  num_questions: int         // 3-10 (default: 5)
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "ai_session_abc123",
  "questions": [
    {
      "question": "Can you explain your experience with Python?",
      "type": "technical",
      "topic": "python"
    }
  ],
  "num_questions": 5
}
```

### Endpoint: Submit Answer

```http
POST /api/ai-interview/submit-answer
Content-Type: multipart/form-data
```

**Request:**
```javascript
{
  session_id: string,
  question_index: int,
  answer_audio: File,        // Optional (WebM audio)
  answer_text: string,       // Optional (if no audio)
  answer_duration: float     // Seconds
}
```

**Response:**
```json
{
  "success": true,
  "answer_text": "I have 3 years of Python experience...",
  "analysis": {
    "score": 85,
    "feedback": "Excellent answer! Provides good detail.",
    "metrics": {
      "relevance": 90,
      "completeness": 85,
      "clarity": 80
    },
    "word_count": 87
  }
}
```

### Endpoint: Complete Interview

```http
POST /api/ai-interview/complete
Content-Type: multipart/form-data
```

**Request:**
```javascript
{
  session_id: string
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "ai_session_abc123",
  "overall_results": {
    "overall_score": 82,
    "technical_score": 85,
    "behavioral_score": 78,
    "total_questions": 5,
    "answered_questions": 5
  },
  "detailed_answers": [...]
}
```

### Endpoint: Get Session

```http
GET /api/ai-interview/session/{session_id}
```

**Response:**
```json
{
  "session_id": "ai_session_abc123",
  "questions": [...],
  "num_questions": 5,
  "status": "active",
  "answered_questions": [0, 1, 2],
  "timestamp": "2024-02-21T10:30:00"
}
```

### Endpoint: Get History

```http
GET /api/ai-interview/history
```

**Response:**
```json
{
  "sessions": [
    {
      "session_id": "ai_session_abc123",
      "timestamp": "2024-02-21T10:30:00",
      "num_questions": 5,
      "answered_questions": 5,
      "average_score": 82,
      "status": "completed"
    }
  ]
}
```

---

## 🎨 Customization

### 1. Add Custom Skills

Edit `backend/services/ai_interviewer.py`:

```python
common_skills = [
    # Add your skills here
    "rust", "go", "kotlin", "swift",
    "tensorflow", "pytorch", "scikit-learn",
    "redis", "elasticsearch", "kafka"
]
```

### 2. Customize Question Templates

```python
self.question_templates = {
    "technical": [
        "Describe a challenging project involving {skill}.",
        "How would you optimize {skill} performance?",
        "What are the pros and cons of {skill}?"
    ],
    "behavioral": [
        "Tell me about a time when you {situation}.",
        "How do you approach {situation}?"
    ]
}
```

### 3. Adjust Scoring Weights

Modify scoring methods in `ai_interviewer.py`:

```python
def _calculate_relevance(self, answer, topic, question_type):
    score = 50  # Base score
    
    # Customize scoring logic
    if topic.lower() in answer.lower():
        score += 40  # Increase weight
    
    return min(score, 100)
```

### 4. Integrate LLM APIs

For better question generation:

**OpenAI GPT-4:**
```python
import openai

def generate_questions_with_gpt(resume, job_desc):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{
            "role": "system",
            "content": "Generate interview questions..."
        }]
    )
    return response.choices[0].message.content
```

**Anthropic Claude:**
```python
import anthropic

def generate_questions_with_claude(resume, job_desc):
    client = anthropic.Anthropic(api_key="...")
    message = client.messages.create(
        model="claude-3-opus-20240229",
        messages=[{
            "role": "user",
            "content": f"Generate questions for: {resume}"
        }]
    )
    return message.content
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to extract text from resume"

**Causes:**
- Corrupted file
- Password-protected PDF
- Unsupported format

**Solutions:**
```bash
# Try converting to different format
# Use online converters or:
pip install pdf2docx
python -c "from pdf2docx import Converter; Converter('resume.pdf').convert('resume.docx')"
```

#### 2. "Could not access microphone"

**Causes:**
- Browser permissions denied
- Microphone in use by another app
- Browser doesn't support MediaRecorder API

**Solutions:**
- Grant microphone permissions in browser settings
- Close other apps using microphone (Zoom, Teams, etc.)
- Use Chrome or Edge (best compatibility)
- Check: chrome://settings/content/microphone

#### 3. Database errors

**Error:** `no such table: ai_interview_sessions`

**Solution:**
```bash
# Delete and recreate database
rm backend/interview_analyzer.db
cd backend && python main.py
```

#### 4. Import errors

**Error:** `ModuleNotFoundError: No module named 'PyPDF2'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

#### 5. Audio transcription fails

**Error:** `FFmpeg not found`

**Solution:**
```bash
# Windows (using winget)
winget install FFmpeg

# Mac
brew install ffmpeg

# Linux
sudo apt install ffmpeg
```

### Debug Mode

Enable detailed logging:

```python
# backend/main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## 📊 Performance Metrics

### Typical Processing Times
- Resume parsing: 1-2 seconds
- Question generation: 0.5-1 second
- Audio transcription: 2-5 seconds (depends on length)
- Answer analysis: 0.1-0.3 seconds

### Resource Usage
- Memory: ~500MB (Whisper model loaded)
- CPU: Moderate during transcription
- Storage: ~100KB per session

---

## 🔐 Privacy & Security

- ✅ All processing happens locally
- ✅ No data sent to external servers (unless you add LLM APIs)
- ✅ Resume text stored in local SQLite database
- ✅ Audio files transcribed locally using Whisper
- ✅ Sessions can be deleted anytime
- ✅ No tracking or analytics

---

## 🎓 Best Practices

### For Developers

1. **Test thoroughly** before deploying
2. **Backup database** before updates
3. **Monitor logs** for errors
4. **Optimize scoring** based on feedback
5. **Add rate limiting** for production

### For Users

1. **Practice regularly** to improve scores
2. **Review feedback** carefully
3. **Focus on weak areas** identified
4. **Use STAR method** for behavioral questions
5. **Record in quiet environment**

---

## 📈 Future Roadmap

Planned enhancements:

- [ ] Video recording during answers
- [ ] Real-time feedback while speaking
- [ ] LLM integration for smarter questions
- [ ] PDF report export
- [ ] Performance comparison across sessions
- [ ] Industry-specific question templates
- [ ] Multi-language support
- [ ] Mobile app version

---

## 🤝 Contributing

Want to improve the feature? Here's how:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📞 Support

Having issues? Check:

1. This README
2. `AI_INTERVIEW_SETUP.md`
3. `test_ai_interview.py` output
4. Backend logs
5. Browser console

---

## 📄 License

Same as the main project.

---

**Happy Interviewing! 🎉**
