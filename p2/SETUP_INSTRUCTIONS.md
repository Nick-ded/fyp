# Setup Instructions for Enhanced Upload Features

## Overview
This guide covers the setup for the enhanced resume upload and API integration features.

## Backend Setup

### 1. Install Python Dependencies

```bash
cd p2/backend
pip install -r requirements.txt
```

### 2. Install System Dependencies (for python-magic)

#### Windows
```bash
# Install python-magic-bin (Windows-specific)
pip install python-magic-bin
```

#### macOS
```bash
brew install libmagic
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install libmagic1
```

### 3. Create Required Directories

The application will create these automatically, but you can create them manually:

```bash
mkdir -p uploads/resumes
mkdir -p temp
```

### 4. Environment Configuration

Ensure your `.env` file has the correct settings:

```env
DATABASE_URL=sqlite:///./interview_analyzer.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Start Backend Server

```bash
cd p2/backend
python -m uvicorn main:app --reload --port 8000
```

## Frontend Setup

### 1. Install Node Dependencies

```bash
cd p2/frontend
npm install
```

### 2. Verify API Configuration

Check that `src/api/api.js` has the correct backend URL:

```javascript
const API_BASE_URL = 'http://localhost:8000/api'
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Features Implemented

### 1. Enhanced API Service (`api.js`)
- ✅ Axios instance with 30s timeout
- ✅ Request interceptor for auth tokens
- ✅ Response interceptor for global error handling
- ✅ Retry logic with exponential backoff (3 attempts)
- ✅ File validation utilities
- ✅ Progress tracking for uploads

### 2. Resume Upload Component (`EnhancedResumeUpload.jsx`)
- ✅ Drag and drop interface
- ✅ File type validation (PDF, DOC, DOCX, TXT)
- ✅ File size validation (5MB limit)
- ✅ Real-time upload progress
- ✅ Success/error feedback
- ✅ Resume data preview
- ✅ Responsive design

### 3. Enhanced Video Upload (`UploadForm.jsx`)
- ✅ Drag and drop interface
- ✅ File type validation (MP4, WebM, MOV, AVI)
- ✅ File size validation (100MB limit)
- ✅ Real-time upload progress
- ✅ Error handling with retry
- ✅ Visual feedback

### 4. Backend File Validation (`file_validation.py`)
- ✅ Comprehensive file size checks
- ✅ Extension validation
- ✅ MIME type validation (checks actual file content)
- ✅ Filename sanitization
- ✅ Security checks against malicious files

### 5. Enhanced Backend Endpoints
- ✅ `/api/auth/upload-resume` - Resume upload with validation
- ✅ `/api/upload` - Video upload with validation
- ✅ Automatic cleanup of old files
- ✅ Detailed error messages
- ✅ Progress tracking support

## Testing the Features

### Test Resume Upload

1. Navigate to the profile or upload page
2. Use the `EnhancedResumeUpload` component
3. Try uploading:
   - Valid PDF resume
   - Invalid file type (should show error)
   - File larger than 5MB (should show error)
4. Verify progress bar appears
5. Check success message with extracted data

### Test Video Upload

1. Navigate to the upload page
2. Try uploading:
   - Valid video file (MP4, WebM)
   - Invalid file type (should show error)
   - File larger than 100MB (should show error)
3. Verify progress bar appears
4. Check navigation to results page

### Test Error Handling

1. Stop the backend server
2. Try uploading a file
3. Verify error message appears
4. Start backend server
5. Try again - should work with retry logic

### Test Drag and Drop

1. Drag a valid file over the upload area
2. Verify visual feedback (border color change)
3. Drop the file
4. Verify file is selected

## API Endpoints

### Resume Upload
```
POST /api/auth/upload-resume
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body: file (PDF, DOC, DOCX, TXT)
Max Size: 5MB

Response:
{
  "message": "Resume uploaded successfully",
  "filename": "1_20240303_120000_resume.pdf",
  "resume_text": "Extracted text...",
  "uploaded_at": "2024-03-03T12:00:00"
}
```

### Video Upload
```
POST /api/upload
Content-Type: multipart/form-data

Body: file (MP4, WebM, MOV, AVI)
Max Size: 100MB

Response:
{
  "id": 1,
  "confidence_score": 85,
  "strengths": [...],
  "improvements": [...],
  "facial_metrics": {...},
  "speech_metrics": {...}
}
```

## Error Codes

- `400` - Bad Request (invalid file type, format, etc.)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (access denied)
- `413` - Payload Too Large (file size exceeds limit)
- `500` - Internal Server Error

## Security Features

1. **File Type Validation**
   - Extension checking
   - MIME type verification (checks actual file content)
   - Prevents file type spoofing

2. **File Size Limits**
   - Resume: 5MB
   - Video: 100MB
   - Audio: 50MB

3. **Filename Sanitization**
   - Removes path traversal attempts
   - Removes dangerous characters
   - Prevents directory traversal attacks

4. **Content Validation**
   - Verifies file can be parsed
   - Checks for minimum content length
   - Validates extracted text

5. **Automatic Cleanup**
   - Removes files on validation failure
   - Deletes old resume files
   - Cleans up temporary files

## Troubleshooting

### python-magic not working on Windows
```bash
pip uninstall python-magic
pip install python-magic-bin
```

### CORS errors
Verify backend CORS settings in `main.py`:
```python
allow_origins=["http://localhost:5173", ...]
```

### Upload timeout
Increase timeout in `api.js`:
```javascript
timeout: 60000, // 60 seconds
```

### File validation errors
Check backend logs for detailed error messages:
```bash
# Backend terminal will show validation errors
```

## Next Steps

1. Add malware scanning (ClamAV integration)
2. Implement chunked uploads for large files
3. Add resume parsing with AI (extract skills, experience)
4. Add video thumbnail generation
5. Implement upload resume on network failure
6. Add rate limiting per user
7. Add upload history and management

## Support

For issues or questions:
1. Check backend logs: `p2/backend/` terminal
2. Check frontend console: Browser DevTools
3. Verify file meets requirements (type, size)
4. Test with smaller files first
