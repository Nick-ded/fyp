# Google OAuth Authentication Setup Guide

## Overview
This guide walks you through setting up Google OAuth login for the Intrex application. This allows users to sign in with their Google account instead of creating a new password.

## Step 1: Get Google OAuth Credentials

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter project name: `Intrex` (or your preferred name)
5. Click "CREATE"
6. Wait for the project to be created

### 1.2 Enable Google+ API
1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "ENABLE"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "CREATE CREDENTIALS" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in required fields (App name, User support email, etc.)
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email)
   - Save and continue
4. Back to credentials, click "CREATE CREDENTIALS" → "OAuth client ID"
5. Choose "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:5173/` (frontend)
   - `http://localhost:5173/auth/callback` (if using callback)
   - `http://localhost:8000/auth/google/callback` (backend)
7. Click "CREATE"
8. Copy your **Client ID** and **Client Secret**

## Step 2: Configure Backend

### 2.1 Update Backend Environment Variables
Edit `p2/backend/.env`:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

Replace with your actual credentials from Step 1.3.

### 2.2 Install Dependencies
The required packages have been added to `requirements.txt`:
- `google-auth==2.26.2`
- `google-auth-oauthlib==1.2.0`
- `google-auth-httplib2==0.2.0`

Install them:
```bash
cd p2/backend
pip install -r requirements.txt
```

### 2.3 Database Migration
The User model has been updated with OAuth fields:
- `google_id` - Stores Google's unique user ID
- `oauth_provider` - Stores the provider name ('google')
- `profile_picture` - Stores user's Google profile picture

If you have an existing database, you may need to reset it:
```bash
# Delete the old database
rm p2/backend/interview_analyzer.db

# The database will be recreated on next run
```

## Step 3: Configure Frontend

### 3.1 Update Frontend Environment Variables
Edit `p2/frontend/.env.local`:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Use the same Client ID from Step 1.3.

### 3.2 Install Dependencies
The required packages have been added to `package.json`:
- `@react-oauth/google==0.12.1`
- `jwt-decode==4.0.0`

Install them:
```bash
cd p2/frontend
npm install
```

## Step 4: Test the Implementation

### 4.1 Start the Backend
```bash
cd p2/backend
python main.py
```

The backend should start on `http://localhost:8000`

### 4.2 Start the Frontend
In a new terminal:
```bash
cd p2/frontend
npm run dev
```

The frontend should start on `http://localhost:5173`

### 4.3 Test Google Login
1. Navigate to `http://localhost:5173/login`
2. You should see a "Sign in with Google" button
3. Click it and sign in with your Google account
4. You should be redirected to the dashboard

## Step 5: Resume Upload Fix

The resume upload feature requires authentication. Here's what was fixed:

### What Changed:
1. **Authentication Required**: Resume uploads now require a valid JWT token
2. **OAuth Support**: Users can now upload resumes after logging in with Google
3. **User Association**: Resumes are properly linked to the authenticated user

### How to Use:
1. Log in with Google (or email/password)
2. Go to the upload page
3. Upload your resume (PDF, DOC, DOCX, or TXT)
4. The resume will be saved to your profile

## Troubleshooting

### Issue: "Google OAuth not configured"
**Solution**: Make sure `GOOGLE_CLIENT_ID` is set in `p2/backend/.env`

### Issue: "Invalid Google token"
**Solution**: 
- Verify the Client ID in frontend `.env.local` matches the backend `.env`
- Check that the redirect URIs are correctly configured in Google Cloud Console

### Issue: Resume upload fails with 401 Unauthorized
**Solution**:
- Make sure you're logged in (check localStorage for 'token')
- Try logging out and logging back in
- Check that the token is being sent in the Authorization header

### Issue: "Email already registered"
**Solution**: 
- If you previously signed up with email/password, you can now log in with Google using the same email
- The system will automatically link your Google account to the existing user

## API Endpoints

### Google Login
```
POST /api/auth/google-login
Content-Type: application/json

{
  "token": "google_id_token_from_frontend"
}

Response:
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "user",
    "full_name": "User Name",
    "google_id": "google_unique_id",
    "oauth_provider": "google",
    "profile_picture": "https://..."
  }
}
```

### Resume Upload (Requires Authentication)
```
POST /api/auth/upload-resume
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

Form Data:
- file: (resume file)

Response:
{
  "message": "Resume uploaded successfully",
  "filename": "1_20240304_resume.pdf",
  "resume_text": "extracted text...",
  "uploaded_at": "2024-03-04T12:00:00"
}
```

## Production Deployment

When deploying to production:

1. **Update Google OAuth Credentials**:
   - Add your production domain to authorized redirect URIs
   - Example: `https://yourdomain.com/`

2. **Update Environment Variables**:
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in production
   - Use secure environment variable management (not in code)

3. **Update Frontend Config**:
   - Update `VITE_GOOGLE_CLIENT_ID` for production

4. **CORS Configuration**:
   - Update CORS settings in backend to allow your production domain

## Files Modified

- `p2/backend/models.py` - Added OAuth fields to User model
- `p2/backend/routers/auth.py` - Added Google login endpoint
- `p2/backend/requirements.txt` - Added Google OAuth packages
- `p2/backend/.env` - Added Google OAuth configuration
- `p2/frontend/package.json` - Added Google OAuth library
- `p2/frontend/.env.local` - Added Google Client ID
- `p2/frontend/src/pages/Login.jsx` - Added Google login button
- `p2/frontend/src/api/api.js` - Added googleLogin function

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Google OAuth documentation: https://developers.google.com/identity/protocols/oauth2
3. Check browser console for error messages
4. Check backend logs for API errors
