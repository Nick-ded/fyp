# Google Authentication Flow Diagram

## Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 1: User Initiates Login
┌──────────────────┐
│   React App      │
│  (Frontend)      │
│                  │
│ User clicks      │
│ "Sign in with    │
│  Google"         │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│ Google Identity Services (gsi/client)                           │
│                                                                  │
│ 1. Shows Google login dialog                                    │
│ 2. User authenticates with Google                               │
│ 3. Returns ID token to frontend                                 │
│                                                                  │
│ ID Token contains:                                              │
│ - sub: Google user ID (123456789)                               │
│ - email: user@example.com                                       │
│ - name: User Name                                               │
│ - picture: https://...                                          │
│ - email_verified: true                                          │
│ - exp: 1234567890 (expires in 1 hour)                           │
└────────┬─────────────────────────────────────────────────────────┘
         │
         │ ID Token (JWT)
         │ eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMyJ9.eyJzdWIiOiIxMjM0NTY3ODkiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20ifQ.signature
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│ React Frontend (GoogleSignIn Component)                         │
│                                                                  │
│ handleCredentialResponse(response) {                            │
│   const idToken = response.credential  // ← ID Token            │
│   await googleLogin(idToken)           // ← Send to backend     │
│ }                                                                │
└────────┬─────────────────────────────────────────────────────────┘
         │
         │ POST /api/auth/google-login
         │ Content-Type: application/json
         │ {"token": "eyJhbGciOiJSUzI1NiIs..."}
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│ FastAPI Backend (auth.py - google_login endpoint)               │
│                                                                  │
│ STEP 2: Validate Configuration                                  │
│ ├─ Check GOOGLE_CLIENT_ID is set in .env                        │
│ └─ ✅ Found: YOUR_GOOGLE_CLIENT_ID_HERE                         │
│                                                                  │
│ STEP 3: Validate Token Format                                   │
│ ├─ Check token is not None                                      │
│ ├─ Check token is a string                                      │
│ └─ ✅ Valid format                                              │
│                                                                  │
│ STEP 4: Verify Token with Google                                │
│ ├─ Call: id_token.verify_oauth2_token(token, Request(),         │
│ │         GOOGLE_CLIENT_ID)                                     │
│ ├─ Google verifies:                                             │
│ │  - Token signature (signed by Google)                         │
│ │  - Token expiration (not older than 1 hour)                   │
│ │  - Client ID matches (aud field)                              │
│ │  - Token not tampered with                                    │
│ └─ ✅ Token verified successfully                               │
│                                                                  │
│ STEP 5: Extract User Information                                │
│ ├─ google_id = idinfo.get('sub')        → "123456789"           │
│ ├─ email = idinfo.get('email')          → "user@example.com"    │
│ ├─ name = idinfo.get('name')            → "User Name"           │
│ ├─ picture = idinfo.get('picture')      → "https://..."         │
│ └─ email_verified = idinfo.get('email_verified') → true         │
│                                                                  │
│ STEP 6: Check/Create User in Database                           │
│ ├─ Query: SELECT * FROM users WHERE google_id = "123456789"     │
│ ├─ If found:                                                    │
│ │  └─ Update profile picture if needed                          │
│ ├─ Else, query: SELECT * FROM users WHERE email = "user@..."    │
│ │  ├─ If found:                                                 │
│ │  │  └─ Link Google account to existing user                   │
│ │  └─ Else:                                                     │
│ │     └─ Create new user with:                                  │
│ │        - email: user@example.com                              │
│ │        - username: user (auto-generated)                      │
│ │        - full_name: User Name                                 │
│ │        - google_id: 123456789                                 │
│ │        - oauth_provider: 'google'                             │
│ │        - profile_picture: https://...                         │
│ └─ ✅ User created/updated                                      │
│                                                                  │
│ STEP 7: Create JWT Token for App                                │
│ ├─ Call: create_access_token({"sub": user.email})               │
│ ├─ JWT contains:                                                │
│ │  - sub: user@example.com                                      │
│ │  - exp: now + 30 minutes (configurable)                       │
│ │  - iat: now                                                   │
│ └─ ✅ JWT created: eyJhbGciOiJIUzI1NiIs...                      │
│                                                                  │
│ STEP 8: Return Response                                         │
│ └─ HTTP 200 OK                                                  │
│    {                                                            │
│      "access_token": "eyJhbGciOiJIUzI1NiIs...",                │
│      "token_type": "bearer",                                    │
│      "user": {                                                  │
│        "id": 1,                                                 │
│        "email": "user@example.com",                             │
│        "username": "user",                                      │
│        "full_name": "User Name",                                │
│        "profile_picture": "https://..."                         │
│      }                                                          │
│    }                                                            │
└────────┬─────────────────────────────────────────────────────────┘
         │
         │ Response with JWT token
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│ React Frontend (GoogleSignIn Component)                         │
│                                                                  │
│ 1. Receive response with JWT token                              │
│ 2. Store JWT in localStorage:                                   │
│    localStorage.setItem('token', result.access_token)           │
│ 3. Store user info:                                             │
│    localStorage.setItem('user', JSON.stringify(result.user))    │
│ 4. Redirect to dashboard:                                       │
│    navigate('/dashboard')                                       │
│ 5. ✅ User logged in successfully                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Token Types Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE TOKEN TYPES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ID TOKEN (✅ USE THIS)                                          │
│ ├─ Purpose: User authentication & info                         │
│ ├─ Contains: email, name, picture, sub (Google ID)             │
│ ├─ Expires: 1 hour                                             │
│ ├─ Signed by: Google                                           │
│ ├─ Verified on: Backend                                        │
│ └─ Example: response.credential from Google Sign-In            │
│                                                                 │
│ ACCESS TOKEN (❌ DON'T USE THIS)                                │
│ ├─ Purpose: API calls to Google services                       │
│ ├─ Contains: scope, client_id                                  │
│ ├─ Expires: Varies (usually 1 hour)                            │
│ ├─ Signed by: Google                                           │
│ ├─ Verified on: Google API servers                             │
│ └─ Example: response.accessToken (if available)                │
│                                                                 │
│ JWT TOKEN (✅ USE THIS FOR APP)                                 │
│ ├─ Purpose: App authentication                                 │
│ ├─ Contains: sub (email), exp, iat                             │
│ ├─ Expires: 30 minutes (configurable)                          │
│ ├─ Signed by: Your backend                                     │
│ ├─ Verified on: Your backend                                   │
│ └─ Example: Returned by /api/auth/google-login                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Scenarios

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ SCENARIO 1: Missing GOOGLE_CLIENT_ID                           │
│ ├─ Backend checks: os.getenv("GOOGLE_CLIENT_ID")               │
│ ├─ Result: None                                                │
│ └─ Response: HTTP 500 "Google OAuth not configured"            │
│                                                                 │
│ SCENARIO 2: Token Expired                                      │
│ ├─ Backend calls: id_token.verify_oauth2_token(...)            │
│ ├─ Google checks: exp timestamp < now                          │
│ └─ Response: HTTP 401 "Invalid or expired Google token"        │
│                                                                 │
│ SCENARIO 3: Client ID Mismatch                                 │
│ ├─ Token issued for: 111111111-aaaa.apps.googleusercontent.com │
│ ├─ Backend verifying with: 222222222-bbbb.apps.googleusercontent.com
│ └─ Response: HTTP 401 "Invalid or expired Google token"        │
│                                                                 │
│ SCENARIO 4: Wrong Token Type (Access Token)                    │
│ ├─ Frontend sends: response.accessToken                        │
│ ├─ Backend tries to verify as ID token                         │
│ └─ Response: HTTP 401 "Invalid or expired Google token"        │
│                                                                 │
│ SCENARIO 5: CORS Error                                         │
│ ├─ Frontend origin: http://localhost:5173                      │
│ ├─ Backend CORS allows: http://localhost:3000                  │
│ └─ Response: CORS error (blocked by browser)                   │
│                                                                 │
│ SCENARIO 6: Google Script Not Loaded                           │
│ ├─ Frontend tries: window.google.accounts.id.initialize()      │
│ ├─ window.google: undefined                                    │
│ └─ Response: "Google is not defined" error                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Subsequent API Calls

```
After successful Google login, all API calls include JWT token:

┌──────────────────────────────────────────────────────────────────┐
│ Frontend API Call (with JWT)                                    │
│                                                                  │
│ GET /api/auth/me                                                │
│ Headers: {                                                      │
│   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."            │
│ }                                                               │
└────────┬─────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│ Backend Middleware (verify JWT)                                 │
│                                                                  │
│ 1. Extract token from Authorization header                      │
│ 2. Verify JWT signature                                         │
│ 3. Check expiration                                             │
│ 4. Extract user email from 'sub' claim                          │
│ 5. Load user from database                                      │
│ 6. ✅ Attach user to request                                    │
└────────┬─────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│ Backend Route Handler                                           │
│                                                                  │
│ @router.get("/me")                                              │
│ def get_current_user_profile(                                   │
│   current_user: User = Depends(get_current_active_user)         │
│ ):                                                              │
│   return current_user  # ← User already verified                │
└────────┬─────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│ Response                                                        │
│                                                                  │
│ HTTP 200 OK                                                     │
│ {                                                               │
│   "id": 1,                                                      │
│   "email": "user@example.com",                                  │
│   "username": "user",                                           │
│   "full_name": "User Name",                                     │
│   "profile_picture": "https://..."                              │
│ }                                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                      USERS TABLE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Column                  Type        Purpose                     │
│ ─────────────────────────────────────────────────────────────── │
│ id                      INTEGER     Primary key                 │
│ email                   VARCHAR     User email (unique)         │
│ username                VARCHAR     Username (unique)           │
│ full_name               VARCHAR     User's full name            │
│ hashed_password         VARCHAR     Password hash               │
│ google_id               VARCHAR     Google user ID (unique)     │
│ oauth_provider          VARCHAR     'google', 'github', etc.    │
│ profile_picture         VARCHAR     URL to profile picture      │
│ resume_filename         VARCHAR     Uploaded resume filename    │
│ resume_text             TEXT        Extracted resume text       │
│ resume_uploaded_at      DATETIME    When resume was uploaded    │
│ created_at              DATETIME    Account creation time       │
│ updated_at              DATETIME    Last update time            │
│                                                                 │
│ Indexes:                                                        │
│ - email (unique)                                               │
│ - username (unique)                                            │
│ - google_id (unique)                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

```
┌─────────────────────────────────────────────────────────────────┐
│                  ENVIRONMENT VARIABLES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ BACKEND (.env)                                                  │
│ ├─ GOOGLE_CLIENT_ID                                             │
│ │  └─ From: Google Cloud Console > Credentials                 │
│ │  └─ Format: YOUR_GOOGLE_CLIENT_ID_HERE                       │
│ │  └─ Used for: Verifying ID tokens                            │
│ │                                                              │
│ └─ GOOGLE_CLIENT_SECRET                                         │
│    └─ From: Google Cloud Console > Credentials                 │
│    └─ Format: YOUR_GOOGLE_CLIENT_SECRET_HERE                   │
│    └─ Used for: OAuth flow (not needed for ID token verify)    │
│                                                                 │
│ FRONTEND (.env.local)                                           │
│ └─ VITE_GOOGLE_CLIENT_ID                                        │
│    └─ From: Same as backend GOOGLE_CLIENT_ID                   │
│    └─ Format: YOUR_GOOGLE_CLIENT_ID_HERE                       │
│    └─ Used for: Initializing Google Sign-In button             │
│    └─ MUST MATCH backend GOOGLE_CLIENT_ID                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Takeaways

1. **ID Token** contains user info and is verified on backend
2. **JWT Token** is created by backend and used for app authentication
3. **Client ID** must match between frontend and backend
4. **Token Verification** happens server-side, never on frontend
5. **Logging** helps debug issues at each step
6. **Error Handling** provides specific messages for different failures

