# Google Authentication - Quick Reference

## What You Need to Know

### Token Types
- **ID Token** ✅ Contains user info (email, name, picture) - USE THIS
- **Access Token** ❌ For API calls - DON'T USE THIS

### The Flow
```
1. User clicks "Sign in with Google"
2. Google shows login dialog
3. User authenticates
4. Google returns ID token to frontend
5. Frontend sends ID token to backend
6. Backend verifies token with Google's public key
7. Backend creates JWT token for app
8. Frontend stores JWT and uses it for API calls
```

### Key Points
- ID tokens expire in **1 hour**
- Backend must verify token using **GOOGLE_CLIENT_ID**
- Frontend and backend must use **same GOOGLE_CLIENT_ID**
- Token verification happens **server-side** (backend)
- Never trust token verification on frontend

---

## Backend Implementation (Python/FastAPI)

### Required Imports
```python
from google.auth.transport import requests
from google.oauth2 import id_token
import os
from dotenv import load_dotenv
```

### Required Environment Variables
```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### Token Verification
```python
@router.post("/google-login")
def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        # 1. Get client ID from environment
        google_client_id = os.getenv("GOOGLE_CLIENT_ID")
        if not google_client_id:
            raise HTTPException(status_code=500, detail="Google OAuth not configured")
        
        # 2. Verify token
        idinfo = id_token.verify_oauth2_token(
            request.token,
            requests.Request(),
            google_client_id
        )
        
        # 3. Extract user info
        google_id = idinfo.get('sub')
        email = idinfo.get('email')
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')
        
        # 4. Check/create user in database
        user = db.query(User).filter(User.google_id == google_id).first()
        if not user:
            user = User(
                email=email,
                username=email.split('@')[0],
                full_name=name,
                google_id=google_id,
                profile_picture=picture
            )
            db.add(user)
        
        db.commit()
        
        # 5. Create JWT token for app
        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    except ValueError:
        # Token verification failed
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## Frontend Implementation (React)

### 1. Add Script to index.html
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### 2. Create Component
```jsx
import { useEffect, useRef } from 'react'
import { googleLogin } from '../api/api'

export default function GoogleSignIn() {
  const googleButtonRef = useRef(null)

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      })

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
      })
    }
  }, [])

  const handleCredentialResponse = async (response) => {
    try {
      // response.credential is the ID token
      const result = await googleLogin(response.credential)
      
      localStorage.setItem('token', result.access_token)
      localStorage.setItem('user', JSON.stringify(result.user))
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return <div ref={googleButtonRef}></div>
}
```

### 3. API Function
```javascript
export const googleLogin = async (token) => {
  const response = await api.post('/auth/google-login', { token })
  return response.data
}
```

### 4. Environment Variables (.env.local)
```env
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

---

## Setup Checklist

### Google Cloud Console
- [ ] Create OAuth 2.0 Client ID (Web application)
- [ ] Add authorized JavaScript origins: `http://localhost:5173`
- [ ] Copy Client ID to both frontend and backend

### Backend (.env)
- [ ] Set `GOOGLE_CLIENT_ID=...`
- [ ] Install: `pip install google-auth google-auth-oauthlib`
- [ ] Implement token verification endpoint

### Frontend (.env.local)
- [ ] Set `VITE_GOOGLE_CLIENT_ID=...` (same as backend)
- [ ] Add Google script to `index.html`
- [ ] Create GoogleSignIn component
- [ ] Add to login page

### Database
- [ ] Add `google_id` column to User table
- [ ] Add `oauth_provider` column to User table
- [ ] Add `profile_picture` column to User table

---

## Testing

### 1. Check Environment Variables
```bash
# Backend
grep GOOGLE_CLIENT_ID p2/backend/.env

# Frontend
grep VITE_GOOGLE_CLIENT_ID p2/frontend/.env.local
```

### 2. Test Backend Directly
```bash
# Get a token from Google, then:
curl -X POST http://localhost:8000/api/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN"}'
```

### 3. Check Browser Console
```javascript
// Verify token is ID token
const token = 'paste_token_here'
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Email:', payload.email)
console.log('Google ID:', payload.sub)
console.log('Expires:', new Date(payload.exp * 1000))
```

### 4. Check Network Tab
- POST to `/api/auth/google-login`
- Request: `{"token": "eyJ..."}`
- Response: `{"access_token": "...", "user": {...}}`

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 500 "Google OAuth not configured" | Missing GOOGLE_CLIENT_ID | Add to .env |
| 401 "Invalid or expired token" | Token expired or wrong type | Get fresh token |
| 400 "Invalid token format" | Token is None/empty | Check response.credential |
| "Invalid client" | Client ID mismatch | Verify IDs match |
| "Google is not defined" | Script not loaded | Add script to index.html |
| CORS error | Origin not authorized | Add to Google Cloud Console |

---

## Security Notes

✅ **Do:**
- Verify token on backend (never trust frontend)
- Use HTTPS in production
- Validate email verification status
- Store JWT in secure HTTP-only cookies
- Implement rate limiting on login endpoint

❌ **Don't:**
- Log full tokens in production
- Verify tokens on frontend
- Use access token for user info
- Store tokens in localStorage (use cookies)
- Skip email verification

---

## Files to Update

1. **Backend**
   - `p2/backend/.env` - Add GOOGLE_CLIENT_ID
   - `p2/backend/routers/auth.py` - Implement google_login endpoint
   - `p2/backend/models.py` - Add google_id, oauth_provider, profile_picture columns

2. **Frontend**
   - `p2/frontend/.env.local` - Add VITE_GOOGLE_CLIENT_ID
   - `p2/frontend/index.html` - Add Google script
   - `p2/frontend/src/components/GoogleSignIn.jsx` - Create component
   - `p2/frontend/src/pages/Login.jsx` - Add GoogleSignIn component

---

## Next Steps

1. Verify environment variables are set correctly
2. Check backend logs for detailed error messages
3. Use browser DevTools Network tab to inspect requests
4. Decode tokens to verify they contain correct fields
5. Test with curl before testing in browser
6. Check Google Cloud Console for authorized origins

