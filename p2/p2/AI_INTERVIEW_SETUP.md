# AI Interview Feature Setup Guide

## Overview
The AI Interview feature allows users to:
1. Upload their resume (PDF, DOCX, or TXT)
2. Provide a job description
3. Get AI-generated interview questions based on both
4. Record audio answers
5. Receive instant feedback and knowledge scores

## Installation Steps

### 1. Install New Python Dependencies
```bash
cd backend
pip install PyPDF2==3.0.1 python-docx==1.1.0
```

Or install all requirements:
```bash
pip install -r requirements.txt
```

### 2. Update Database Schema
The new feature adds two tables: `ai_interview_sessions` and `ai_interview_answers`

Delete the old database to recreate with new schema:
```bash
# Windows
del backend\interview_analyzer.db

# Linux/Mac
rm backend/interview_analyzer.db
```

The database will be recreated automatically when you start the backend.

### 3. Start the Backend
```bash
cd backend
python main.py
```

Or use the provided scripts:
```bash
# Windows
START_BACKEND.bat

# Linux/Mac
./run.sh
```

### 4. Start the Frontend
```bash
cd frontend
npm install  # if not already done
npm run dev
```

## How to Use

### For Users:
1. Navigate to the home page
2. Click on the "🤖 AI Interview" tab
3. Upload your resume (PDF, DOCX, or TXT format)
4. Paste the job description
5. Select number of questions (3-10)
6. Click "Start AI Interview"
7. For each question:
   - Click "Start Recording" to record your answer
   - Click "Stop Recording" when done
   - Click "Submit Answer" to analyze
8. View your overall score and detailed feedback

### Features:
- **Question Generation**: AI analyzes your resume and job description to create relevant questions
- **Speech-to-Text**: Your audio answers are automatically transcribed
- **Answer Analysis**: Each answer is scored on:
  - Relevance (how well it addresses the question)
  - Completeness (depth and detail)
  - Clarity (communication quality)
- **Knowledge Score**: Overall score showing technical and behavioral performance

## API Endpoints

### Start Interview
```
POST /api/ai-interview/start
Content-Type: multipart/form-data

Fields:
- resume: File (PDF, DOCX, TXT)
- job_description: string
- num_questions: int (default: 5)

Response:
{
  "success": true,
  "session_id": "ai_session_xxx",
  "questions": [...],
  "num_questions": 5
}
```

### Submit Answer
```
POST /api/ai-interview/submit-answer
Content-Type: multipart/form-data

Fields:
- session_id: string
- question_index: int
- answer_audio: File (optional)
- answer_text: string (optional)
- answer_duration: float

Response:
{
  "success": true,
  "answer_text": "transcribed text",
  "analysis": {
    "score": 85,
    "feedback": "Excellent answer!",
    "metrics": {...}
  }
}
```

### Complete Interview
```
POST /api/ai-interview/complete
Content-Type: multipart/form-data

Fields:
- session_id: string

Response:
{
  "success": true,
  "overall_results": {
    "overall_score": 82,
    "technical_score": 85,
    "behavioral_score": 78,
    ...
  },
  "detailed_answers": [...]
}
```

## Customization

### Adding More Question Templates
Edit `backend/services/ai_interviewer.py` and modify the `question_templates` dictionary.

### Improving Question Generation
For better AI-powered questions, you can integrate:
- OpenAI GPT API
- Anthropic Claude API
- Local LLMs via Ollama

Add API keys to `.env` file and update the `generate_questions` method.

### Adjusting Scoring Algorithm
Modify the scoring methods in `ai_interviewer.py`:
- `_calculate_relevance()`
- `_calculate_completeness()`
- `_calculate_clarity()`

## Troubleshooting

### "Failed to extract text from resume"
- Ensure the file is a valid PDF, DOCX, or TXT
- Check file is not corrupted or password-protected
- Try converting to a different format

### "Could not access microphone"
- Grant microphone permissions in browser
- Check microphone is not in use by another app
- Try a different browser (Chrome/Edge recommended)

### Database errors
- Delete the database file and restart backend
- Check SQLAlchemy version compatibility

### Audio transcription fails
- Ensure Whisper model is installed
- Check audio file is not empty
- Verify FFmpeg is installed for audio processing

## Future Enhancements

Potential improvements:
1. Video recording during answers (facial analysis)
2. Real-time feedback during recording
3. Integration with LLM APIs for better questions
4. Export results as PDF report
5. Compare performance across multiple sessions
6. Industry-specific question templates
7. Multi-language support
