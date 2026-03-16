# Firebase Auth - Quick Start (5 Minutes)

## TL;DR - Get Started Now

### 1. Create Firebase Project (2 min)
```
1. Go to https://console.firebase.google.com/
2. Click "Add project" → name it "intrex"
3. Wait for creation
```

### 2. Enable Google Sign-In (1 min)
```
1. Go to Authentication → Get started
2. Click Google → Enable → Select project → Save
```

### 3. Get Config (1 min)
```
1. Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click Web icon
4. Copy the config object
```

### 4. Update .env.local (1 min)
```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

### 5. Install & Test (1 min)
```bash
cd p2/frontend
npm install
npm run dev
# Go to http://localhost:5173/firebase-login
```

## Files Created

| File | Purpose |
|------|---------|
| `src/config/firebase.js` | Firebase initialization |
| `src/context/AuthContext.jsx` | Auth state management |
| `src/pages/FirebaseLogin.jsx` | Login page |
| `src/pages/FirebaseSignup.jsx` | Signup page |

## Usage

### Check if User is Logged In
```jsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) return <div>Please log in</div>
  return <div>Welcome, {user.email}</div>
}
```

### Logout
```jsx
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

await signOut(auth)
```

## Routes

- `/firebase-login` - Login page
- `/firebase-signup` - Signup page
- `/dashboard` - Protected (redirects to login if not authenticated)

## What's Different from Old Auth?

| Feature | Old | Firebase |
|---------|-----|----------|
| Backend needed | Yes | No |
| Token management | Manual | Automatic |
| Google OAuth | Complex | 1 click |
| User persistence | Manual | Automatic |
| Security | Manual | Built-in |

## Common Issues

**"Firebase is not defined"**
→ Run `npm install firebase`

**"Popup blocked"**
→ User needs to allow popups

**"Email already in use"**
→ User already has account, direct to login

## Next: Backend Integration (Optional)

If you want to verify tokens on backend:

```bash
pip install firebase-admin
```

Then add to `p2/backend/routers/auth.py`:

```python
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

# Initialize Firebase Admin
cred = credentials.Certificate('firebase-key.json')
firebase_admin.initialize_app(cred)

@router.post("/verify-firebase-token")
def verify_token(token: str):
    decoded = firebase_auth.verify_id_token(token)
    # Sync user to database
    return {"user": decoded}
```

## That's It!

You now have production-ready authentication with:
- ✅ Email/Password login
- ✅ Google Sign-In
- ✅ Automatic token management
- ✅ User persistence
- ✅ Secure authentication

Go to `/firebase-login` and test it out!
