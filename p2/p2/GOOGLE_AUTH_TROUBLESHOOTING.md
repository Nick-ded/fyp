# Google Authentication Troubleshooting Guide

## Error Scenarios & Solutions

### 1. Backend Returns 500 "Google OAuth not configured"

**Error Message:**
```
HTTP 500: Server configuration error: Google OAuth not configured
```

**Cause:** `GOOGLE_CLIENT_ID` environment variable is missing or empty

**Solution:**
```bash
# Check .env file
cat p2/backend/.env | grep GOOGLE_CLIENT_ID

# Should output:
# GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE

# If missing, add it:
echo "GOOGLE_CLIENT_ID=your_client_id_here" >> p2/backend/.env
```

**Verification:**
```python
# In Python shell
import os
from dotenv import load_dotenv
load_dotenv()
print(os.getenv("GOOGLE_CLIENT_ID"))  # Should print your client ID
```

---

### 2. Backend Returns 401 "Invalid or expired Google token"

**Error Message:**
```
HTTP 401: Invalid or expired Google token
```

**Possible Causes:**

#### A. Token is Expired
ID tokens expire in 1 hour. Check the token's expiration:

```javascript
// In browser console
const token = 'your_token_here'
const parts = token.split('.')
const payload = JSON.parse(atob(parts[1]))
console.log('Expires at:', new Date(payload.exp * 1000))
console.log('Is expired:', Date.now() > payload.exp * 1000)
```

**Solution:** Get a fresh token by logging in again

#### B. Wrong Token Type (Access Token Instead of ID Token)
Check what type of token you're sending:

```javascript
// Decode and check
const token = 'your_token_here'
const parts = token.split('.')
const payload = JSON.parse(atob(parts[1]))

// ID token should have these fields:
console.log('Has email:', !!payload.email)
console.log('Has sub:', !!payload.sub)
console.log('Has aud:', !!payload.aud)

// Access token would have different fields:
console.log('Has scope:', !!payload.scope)
console.log('Has client_id:', !!payload.client_id)
```

**Solution:** Make sure you're using `response.credential` from Google Sign-In callback, not an access token

#### C. Client ID Mismatch
The token was issued for a different client ID than what you're verifying with.

```python
# In backend logs, check:
# 🔑 Using Google Client ID: YOUR_GOOGLE_CLIENT_ID_HERE

# Decode the token to see which client it was issued for:
import json
import base64

token = 'your_token_here'
parts = token.split('.')
payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
print('Token issued for client:', payload.get('aud'))
```

**Solution:** Ensure frontend and backend use the same `GOOGLE_CLIENT_ID`

---

### 3. Backend Returns 400 "Invalid token format"

**Error Message:**
```
HTTP 400: Invalid token format
```

**Cause:** Token is None, empty, or not a string

**Solution:**
```javascript
// Check what's being sent
console.log('Token type:', typeof response.credential)
console.log('Token length:', response.credential?.length)
console.log('Token is empty:', !response.credential)

// Make sure you're sending the credential
const handleCredentialResponse = (response) => {
  console.log('Credential:', response.credential) // Should be a long string
  // NOT response.accessToken or response.idToken
}
```

---

### 4. Frontend: "Google is not defined"

**Error Message:**
```
Uncaught ReferenceError: google is not defined
```

**Cause:** Google Identity Services script not loaded

**Solution:**
1. Check `index.html` has the script tag:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

2. Wait for script to load before using:
```javascript
useEffect(() => {
  // Wait for google to be available
  const checkGoogle = setInterval(() => {
    if (window.google) {
      clearInterval(checkGoogle)
      // Initialize here
      window.google.accounts.id.initialize({...})
    }
  }, 100)
}, [])
```

---

### 5. Frontend: "Invalid client" Error from Google

**Error Message:**
```
Error: Invalid client
```

**Cause:** Client ID is wrong or origin is not authorized

**Solution:**

1. Verify client ID in `.env.local`:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

2. Check Google Cloud Console:
   - Go to https://console.cloud.google.com/
   - Select your project
   - Go to "Credentials"
   - Click on your OAuth 2.0 Client ID
   - Check "Authorized JavaScript origins"
   - Should include `http://localhost:5173` (or your dev port)

3. Add authorized origin if missing:
   - Click "Edit"
   - Add `http://localhost:5173`
   - Click "Save"

---

### 6. Backend: "Missing required fields in token"

**Error Message:**
```
HTTP 401: Invalid token: missing required user information
```

**Cause:** Token doesn't contain `sub` (Google ID) or `email`

**Solution:**
```python
# Decode token to check what's in it
import json
import base64

token = 'your_token_here'
parts = token.split('.')
payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))

print('Token contents:')
for key, value in payload.items():
    print(f'  {key}: {value}')

# Should have at least:
# - sub: Google user ID
# - email: User email
# - email_verified: true/false
```

This usually means the token is not a valid Google ID token.

---

### 7. Database Error: "User already exists"

**Error Message:**
```
HTTP 400: Email already registered
```

**Cause:** User with this email already exists in database

**Solution:**
```python
# Check if user exists
from models import User
from database import SessionLocal

db = SessionLocal()
user = db.query(User).filter(User.email == 'user@example.com').first()
print('User exists:', user is not None)

# If you want to delete and retry:
if user:
    db.delete(user)
    db.commit()
    print('User deleted')
```

---

### 8. CORS Error: "Access to XMLHttpRequest blocked"

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:8000/api/auth/google-login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Cause:** Backend CORS configuration doesn't allow frontend origin

**Solution:**
Check `p2/backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Your frontend port
        "http://localhost:5174",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

If your frontend runs on a different port, add it to `allow_origins`.

---

## Complete Debugging Workflow

### Step 1: Verify Environment Setup
```bash
# Check backend .env
grep GOOGLE_CLIENT_ID p2/backend/.env

# Check frontend .env.local
grep VITE_GOOGLE_CLIENT_ID p2/frontend/.env.local

# They should match (except VITE_ prefix)
```

### Step 2: Check Backend Logs
```bash
# Run backend with verbose output
cd p2/backend
python main.py

# Look for these log lines:
# 📝 Token received (first 50 chars): ...
# 🔑 Using Google Client ID: ...
# ✅ Token verified successfully
# 👤 User info extracted:
```

### Step 3: Check Frontend Network Tab
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Click "Sign in with Google"
4. Look for POST request to `/api/auth/google-login`
5. Check:
   - Request body: `{"token": "eyJ..."}`
   - Response status: Should be 200
   - Response body: Should have `access_token` and `user`

### Step 4: Decode Token in Browser Console
```javascript
const token = 'paste_your_token_here'
const parts = token.split('.')
const payload = JSON.parse(atob(parts[1]))
console.table(payload)
```

### Step 5: Test Backend Directly
```bash
# Get a valid token first, then:
curl -X POST http://localhost:8000/api/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN_HERE"}'

# Should return:
# {"access_token": "...", "token_type": "bearer", "user": {...}}
```

---

## Common Mistakes Checklist

- [ ] Using access token instead of ID token
- [ ] Client ID mismatch between frontend and backend
- [ ] Token expired (older than 1 hour)
- [ ] Missing `GOOGLE_CLIENT_ID` environment variable
- [ ] Frontend origin not authorized in Google Cloud Console
- [ ] CORS not configured for frontend origin
- [ ] Sending token in wrong request format
- [ ] Not waiting for Google script to load
- [ ] Using wrong environment variable name (VITE_ prefix)

---

## Getting Help

If you're still stuck, collect this information:

1. **Backend logs** (full output when attempting login)
2. **Network request/response** (from browser DevTools)
3. **Decoded token payload** (from browser console)
4. **Environment variables** (GOOGLE_CLIENT_ID values)
5. **Error message** (exact error from backend or frontend)

Then check the specific error scenario above that matches your situation.

