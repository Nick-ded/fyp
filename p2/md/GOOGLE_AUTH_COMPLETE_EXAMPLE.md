# Google Authentication - Complete Working Example

This is a complete, production-ready implementation you can copy and use.

## Part 1: Backend Setup

### 1.1 Update requirements.txt

Ensure these packages are installed:
```
google-auth==2.26.2
google-auth-oauthlib==1.2.0
google-auth-httplib2==0.2.0
```

### 1.2 Update .env

```env
# Database
DATABASE_URL=sqlite:///./interview_analyzer.db

# Server
HOST=0.0.0.0
PORT=8000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
```

### 1.3 Update models.py

Add these fields to the User model:

```python
from sqlalchemy import Column, String, DateTime
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    
    # Google OAuth fields
    google_id = Column(String, unique=True, index=True, nullable=True)
    oauth_provider = Column(String, nullable=True)  # 'google', 'github', etc.
    profile_picture = Column(String, nullable=True)
    
    # Resume fields
    resume_filename = Column(String, nullable=True)
    resume_text = Column(String, nullable=True)
    resume_uploaded_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### 1.4 Complete auth.py Router

```python
"""
Authentication router for user registration, login, and Google OAuth
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
from pydantic import BaseModel
from google.auth.transport import requests
from google.oauth2 import id_token

from database import get_db
from models import User
from schemas import UserCreate, UserLogin, UserResponse, Token
from utils.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["authentication"])


class GoogleLoginRequest(BaseModel):
    token: str


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with email and password"""
    # Check if email already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }


@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user with email and password"""
    # Find user by email
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/google-login", response_model=Token)
def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Login/signup with Google OAuth ID token.
    
    This endpoint:
    1. Verifies the Google ID token using Google's public keys
    2. Extracts user information (email, name, picture)
    3. Creates or updates user in database
    4. Returns JWT token for the application
    
    The token parameter must be an ID token (not an access token).
    ID tokens are obtained from Google Sign-In and contain user information.
    """
    try:
        # Step 1: Validate environment configuration
        google_client_id = os.getenv("GOOGLE_CLIENT_ID")
        if not google_client_id:
            print("❌ ERROR: GOOGLE_CLIENT_ID environment variable not set")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server configuration error: Google OAuth not configured"
            )
        
        # Step 2: Validate token format
        if not request.token or not isinstance(request.token, str):
            print("❌ ERROR: Invalid token format")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token format"
            )
        
        print(f"📝 Token received (first 50 chars): {request.token[:50]}...")
        print(f"🔑 Using Google Client ID: {google_client_id}")
        
        # Step 3: Verify Google ID token
        # This validates:
        # - Token signature (signed by Google)
        # - Token expiration
        # - Client ID matches
        # - Token is not tampered with
        try:
            idinfo = id_token.verify_oauth2_token(
                request.token,
                requests.Request(),
                google_client_id
            )
            print(f"✅ Token verified successfully")
            print(f"   - Subject (google_id): {idinfo.get('sub')}")
            print(f"   - Email: {idinfo.get('email')}")
            print(f"   - Email verified: {idinfo.get('email_verified')}")
            
        except ValueError as token_error:
            # ValueError is raised for invalid tokens
            print(f"❌ Token verification failed: {str(token_error)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Google token"
            )
        except Exception as token_error:
            # Other exceptions (network, etc.)
            print(f"❌ Token verification error: {str(token_error)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token verification failed: {str(token_error)}"
            )
        
        # Step 4: Extract user information from verified token
        google_id = idinfo.get('sub')
        email = idinfo.get('email')
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')
        email_verified = idinfo.get('email_verified', False)
        
        # Validate required fields
        if not google_id or not email:
            print(f"❌ ERROR: Missing required fields in token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing required user information"
            )
        
        print(f"👤 User info extracted:")
        print(f"   - Google ID: {google_id}")
        print(f"   - Email: {email}")
        print(f"   - Name: {name}")
        
        # Step 5: Check if user exists by google_id
        user = db.query(User).filter(User.google_id == google_id).first()
        
        if user:
            print(f"✅ Existing user found by google_id: {email}")
            # Update profile picture if available
            if picture and user.profile_picture != picture:
                user.profile_picture = picture
                print(f"   - Updated profile picture")
        else:
            # Step 6: Check if email already exists (from previous email/password signup)
            user = db.query(User).filter(User.email == email).first()
            
            if user:
                # Link Google account to existing user
                print(f"✅ Linking Google account to existing user: {email}")
                user.google_id = google_id
                user.oauth_provider = 'google'
                if picture:
                    user.profile_picture = picture
            else:
                # Step 7: Create new user
                print(f"✨ Creating new user: {email}")
                
                # Generate unique username from email
                username = email.split('@')[0]
                base_username = username
                counter = 1
                
                # Ensure username is unique
                while db.query(User).filter(User.username == username).first():
                    username = f"{base_username}{counter}"
                    counter += 1
                
                # Create user with random password (won't be used for Google OAuth)
                user = User(
                    email=email,
                    username=username,
                    full_name=name,
                    google_id=google_id,
                    oauth_provider='google',
                    profile_picture=picture,
                    hashed_password=get_password_hash(os.urandom(32).hex())
                )
                db.add(user)
                print(f"   - New user created with username: {username}")
        
        # Step 8: Commit database changes
        try:
            db.commit()
            db.refresh(user)
            print(f"✅ Database committed successfully")
        except Exception as db_error:
            db.rollback()
            print(f"❌ Database error: {str(db_error)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error during user creation/update"
            )
        
        # Step 9: Create JWT access token for the application
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        print(f"🔐 JWT access token created for: {user.email}")
        
        # Step 10: Return success response
        print(f"✅ Google login successful for: {email}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Unexpected error in google_login: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during Google login"
        )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user
```

---

## Part 2: Frontend Setup

### 2.1 Update index.html

Add this to the `<head>` section:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Intrex - AI Interview Analysis</title>
    
    <!-- Google Identity Services -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 2.2 Update .env.local

```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2.3 Create GoogleSignIn Component

Create `p2/frontend/src/components/GoogleSignIn.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { googleLogin } from '../api/api'

export default function GoogleSignIn() {
  const navigate = useNavigate()
  const googleButtonRef = useRef(null)

  useEffect(() => {
    // Wait for Google script to load
    const initializeGoogle = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          itp_support: true,
        })

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
        })
      } else {
        // Retry if Google not loaded yet
        setTimeout(initializeGoogle, 100)
      }
    }

    initializeGoogle()
  }, [])

  const handleCredentialResponse = async (response) => {
    try {
      console.log('📝 Google credential received')
      console.log('Token (first 50 chars):', response.credential.substring(0, 50) + '...')

      // Send ID token to backend
      const result = await googleLogin(response.credential)

      console.log('✅ Google login successful')
      console.log('User:', result.user)

      // Store tokens and user info
      localStorage.setItem('token', result.access_token)
      localStorage.setItem('user', JSON.stringify(result.user))

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('❌ Google login failed:', error.message)
      alert(`Login failed: ${error.message}`)
    }
  }

  return (
    <div className="google-signin-container">
      <div ref={googleButtonRef}></div>
    </div>
  )
}
```

### 2.4 Update Login Page

Update `p2/frontend/src/pages/Login.jsx` to include GoogleSignIn:

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GoogleSignIn from '../components/GoogleSignIn'
import { login } from '../api/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email, password)
      localStorage.setItem('token', result.access_token)
      localStorage.setItem('user', JSON.stringify(result.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h1>Login to Intrex</h1>

      {error && <div className="error-message">{error}</div>}

      {/* Email/Password Login */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="divider">OR</div>

      {/* Google Sign-In */}
      <GoogleSignIn />

      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  )
}
```

---

## Part 3: Database Migration

If you have existing users, run this to add the new columns:

```python
# In your backend, run this once:
from database import engine, Base
from models import User

# Create tables (will add new columns)
Base.metadata.create_all(bind=engine)

# Or manually with SQL:
# ALTER TABLE users ADD COLUMN google_id VARCHAR UNIQUE;
# ALTER TABLE users ADD COLUMN oauth_provider VARCHAR;
# ALTER TABLE users ADD COLUMN profile_picture VARCHAR;
```

---

## Part 4: Testing

### Test 1: Verify Environment Variables
```bash
# Backend
grep GOOGLE_CLIENT_ID p2/backend/.env

# Frontend
grep VITE_GOOGLE_CLIENT_ID p2/frontend/.env.local
```

### Test 2: Start Backend
```bash
cd p2/backend
python main.py
```

### Test 3: Start Frontend
```bash
cd p2/frontend
npm run dev
```

### Test 4: Test Google Login
1. Go to http://localhost:5173/login
2. Click "Sign in with Google"
3. Complete Google authentication
4. Check backend logs for success messages
5. Should redirect to dashboard

### Test 5: Check Network Request
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Sign in with Google"
4. Look for POST to `/api/auth/google-login`
5. Request body should be: `{"token": "eyJ..."}`
6. Response should be: `{"access_token": "...", "user": {...}}`

---

## Troubleshooting

If you get errors, check:

1. **500 "Google OAuth not configured"**
   - Add `GOOGLE_CLIENT_ID` to `.env`

2. **401 "Invalid or expired token"**
   - Token expired (older than 1 hour)
   - Client ID mismatch
   - Wrong token type (access token instead of ID token)

3. **"Google is not defined"**
   - Add script to `index.html`
   - Wait for script to load

4. **CORS error**
   - Add frontend origin to Google Cloud Console
   - Check CORS config in backend

5. **"Invalid client"**
   - Verify client ID matches
   - Add origin to Google Cloud Console

See `GOOGLE_AUTH_TROUBLESHOOTING.md` for more details.

