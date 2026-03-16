# Firebase Authentication Setup Guide

## Overview

This guide walks you through setting up Firebase Authentication for your Intrex application. Firebase handles all OAuth complexity and provides a secure, scalable authentication solution.

## Benefits of Firebase Auth

✅ **No backend authentication needed** - Firebase handles all OAuth flows
✅ **Built-in Google Sign-In** - One-click setup
✅ **Automatic token management** - Tokens refresh automatically
✅ **User persistence** - Users stay logged in across sessions
✅ **Email/Password auth** - Built-in support
✅ **Social login** - Google, GitHub, Facebook, etc.
✅ **Security** - Industry-standard security practices

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `intrex` (or your preferred name)
4. Accept the terms and click "Create project"
5. Wait for project creation to complete

## Step 2: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get started**
3. Enable these sign-in methods:
   - **Email/Password** - Click enable, toggle on
   - **Google** - Click enable, select your Google Cloud project, toggle on

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon to create a web app
4. Enter app name: `intrex-web`
5. Click "Register app"
6. Copy the Firebase config object

Your config will look like:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "intrex-xxxxx.firebaseapp.com",
  projectId: "intrex-xxxxx",
  storageBucket: "intrex-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

## Step 4: Update Frontend Environment Variables

Create/update `p2/frontend/.env.local`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN_HERE
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET_HERE
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID_HERE
VITE_FIREBASE_APP_ID=YOUR_APP_ID_HERE

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
```

## Step 5: Install Dependencies

```bash
cd p2/frontend
npm install
```

This installs Firebase SDK and all dependencies.

## Step 6: Update Backend (Optional)

If you want to verify Firebase tokens on the backend:

### Install Python Firebase Admin SDK

```bash
cd p2/backend
pip install firebase-admin
```

### Add to requirements.txt

```
firebase-admin==6.2.0
```

### Create Firebase Service Account

1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click "Generate new private key"
3. Save the JSON file as `p2/backend/firebase-key.json`
4. Add to `.env`:

```env
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
```

### Update Backend Auth Router

Add this to `p2/backend/routers/auth.py`:

```python
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
import os

# Initialize Firebase Admin
firebase_key_path = os.path.join(os.path.dirname(__file__), '../firebase-key.json')
if os.path.exists(firebase_key_path):
    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred)

@router.post("/verify-firebase-token")
def verify_firebase_token(token: str, db: Session = Depends(get_db)):
    """Verify Firebase ID token and sync user to database"""
    try:
        # Verify token with Firebase
        decoded_token = firebase_auth.verify_id_token(token)
        
        uid = decoded_token['uid']
        email = decoded_token.get('email')
        name = decoded_token.get('name', '')
        picture = decoded_token.get('picture', '')
        
        # Check if user exists in database
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create new user
            user = User(
                email=email,
                username=email.split('@')[0],
                full_name=name,
                profile_picture=picture,
                hashed_password=get_password_hash(os.urandom(32).hex())
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Create JWT for your app
        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
```

## Step 7: Test Firebase Auth

### Test Login

1. Start frontend: `cd p2/frontend && npm run dev`
2. Go to `http://localhost:5173/firebase-login`
3. Try signing in with:
   - Email/Password
   - Google Sign-In

### Test Signup

1. Go to `http://localhost:5173/firebase-signup`
2. Create a new account
3. You should be redirected to dashboard

### Check Firebase Console

1. Go to Firebase Console > Authentication > Users
2. You should see your test users listed

## Step 8: Update Navigation Links

Update your landing page to link to Firebase auth:

```jsx
// Instead of /login, use:
<Link to="/firebase-login">Sign In</Link>

// Instead of /signup, use:
<Link to="/firebase-signup">Sign Up</Link>
```

## File Structure

```
p2/frontend/src/
├── config/
│   └── firebase.js              # Firebase initialization
├── context/
│   └── AuthContext.jsx          # Auth state management
├── pages/
│   ├── FirebaseLogin.jsx        # Login page
│   ├── FirebaseSignup.jsx       # Signup page
│   └── ...
└── App.jsx                      # Updated with AuthProvider
```

## Usage in Components

### Check if User is Logged In

```jsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, loading, isAuthenticated } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  if (!isAuthenticated) {
    return <div>Please log in</div>
  }
  
  return <div>Welcome, {user.displayName}</div>
}
```

### Get Firebase Token for API Calls

```jsx
const { user } = useAuth()

// Token is automatically stored in localStorage
const token = localStorage.getItem('token')

// Use in API calls
const response = await fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Logout

```jsx
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

async function handleLogout() {
  try {
    await signOut(auth)
    // User is automatically logged out
    // AuthContext will update
  } catch (error) {
    console.error('Logout error:', error)
  }
}
```

## Security Best Practices

✅ **Never expose Firebase config in code** - Use environment variables
✅ **Always verify tokens on backend** - Don't trust frontend tokens
✅ **Use HTTPS in production** - Firebase requires HTTPS
✅ **Enable Firebase Security Rules** - Restrict database access
✅ **Rotate service account keys** - Regularly update backend credentials
✅ **Monitor authentication logs** - Check Firebase Console for suspicious activity

## Troubleshooting

### Issue: "Firebase is not defined"
**Solution:** Make sure Firebase is installed: `npm install firebase`

### Issue: "CORS error when signing in"
**Solution:** Add your domain to Firebase Console > Authentication > Authorized domains

### Issue: "Popup blocked"
**Solution:** User's browser is blocking popups. They need to allow popups for your domain.

### Issue: "Email already in use"
**Solution:** User already has an account. Direct them to login instead.

### Issue: "Token verification failed"
**Solution:** Make sure Firebase Admin SDK is initialized with correct service account key.

## Production Deployment

### Before Deploying:

1. **Update Firebase Config**
   - Create production Firebase project
   - Update environment variables

2. **Enable Production Auth Methods**
   - Go to Firebase Console > Authentication
   - Ensure all needed methods are enabled

3. **Add Production Domain**
   - Firebase Console > Authentication > Authorized domains
   - Add your production domain

4. **Update Backend**
   - Use production Firebase service account key
   - Update environment variables

5. **Test Thoroughly**
   - Test all auth flows
   - Test token verification
   - Test user persistence

## Next Steps

1. ✅ Create Firebase project
2. ✅ Enable authentication methods
3. ✅ Get Firebase configuration
4. ✅ Update environment variables
5. ✅ Install dependencies
6. ✅ Test authentication flows
7. ✅ Update navigation links
8. ✅ Deploy to production

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

## Support

For issues or questions:
1. Check Firebase Console logs
2. Review browser console for errors
3. Check backend logs for token verification errors
4. Refer to Firebase documentation

---

**Status:** Ready for implementation

Your Firebase authentication is now set up and ready to use!
