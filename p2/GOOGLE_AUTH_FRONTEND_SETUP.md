# Google Authentication Frontend Setup - Complete Guide

## Overview
This guide shows how to properly integrate Google Sign-In with your React frontend to send the correct ID token to your backend.

## Step 1: Install Google Identity Services Library

Add to your `index.html` in the `<head>` section:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

## Step 2: Create Google Sign-In Component

Create a new file: `p2/frontend/src/components/GoogleSignIn.jsx`

```jsx
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { googleLogin } from '../api/api'

export default function GoogleSignIn() {
  const navigate = useNavigate()
  const googleButtonRef = useRef(null)

  useEffect(() => {
    // Initialize Google Sign-In button
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false, // Don't auto-select
        itp_support: true, // Support for Intelligent Tracking Prevention
      })

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
      })
    }
  }, [])

  const handleCredentialResponse = async (response) => {
    try {
      console.log('📝 Google credential received')
      console.log('Token (first 50 chars):', response.credential.substring(0, 50) + '...')

      // IMPORTANT: response.credential is the ID token
      // This is what we send to the backend
      const result = await googleLogin(response.credential)

      console.log('✅ Google login successful')
      console.log('User:', result.user)

      // Store token
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

## Step 3: Update Environment Variables

Create/update `p2/frontend/.env.local`:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
VITE_API_BASE_URL=http://localhost:8000/api
```

**IMPORTANT**: The `VITE_GOOGLE_CLIENT_ID` must match the one in your backend `.env` file.

## Step 4: Update Login Page

Update your login page to include the Google Sign-In component:

```jsx
import GoogleSignIn from '../components/GoogleSignIn'

export default function Login() {
  return (
    <div className="login-container">
      <h1>Login</h1>
      
      {/* Email/Password Login */}
      <form>
        {/* ... existing form fields ... */}
      </form>

      <div className="divider">OR</div>

      {/* Google Sign-In */}
      <GoogleSignIn />
    </div>
  )
}
```

## Step 5: Verify Token Type

To verify you're sending the correct token type, add this debugging code:

```javascript
// In your handleCredentialResponse function
const decodeToken = (token) => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid token format')
      return null
    }
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

const handleCredentialResponse = async (response) => {
  const decoded = decodeToken(response.credential)
  console.log('Token payload:', decoded)
  
  // Verify it's an ID token (should have 'email' and 'sub' fields)
  if (decoded && decoded.email && decoded.sub) {
    console.log('✅ This is a valid ID token')
    console.log('  - Email:', decoded.email)
    console.log('  - Google ID (sub):', decoded.sub)
    console.log('  - Expires at:', new Date(decoded.exp * 1000))
  } else {
    console.error('❌ This does not look like an ID token')
  }
}
```

## Step 6: Handle Token Expiration

ID tokens expire in 1 hour. Implement token refresh:

```javascript
// In your API interceptor (api.js)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ... existing error handling ...

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Clear stored token
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirect to login
      window.location.href = '/login'
      
      throw new Error('Session expired. Please login again.')
    }

    // ... rest of error handling ...
  }
)
```

## Common Frontend Issues & Solutions

### Issue 1: "Google is not defined"
**Solution**: Make sure the Google script is loaded in `index.html`:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Issue 2: Button doesn't render
**Solution**: Check that:
- `window.google` is available (wait for script to load)
- `googleButtonRef.current` is not null
- `VITE_GOOGLE_CLIENT_ID` is set correctly

### Issue 3: "Invalid client" error from Google
**Solution**: 
- Verify `VITE_GOOGLE_CLIENT_ID` matches backend `GOOGLE_CLIENT_ID`
- Check that the origin is authorized in Google Cloud Console
- Authorized origins should include `http://localhost:5173` (or your dev port)

### Issue 4: Token verification fails on backend
**Solution**:
- Verify you're sending `response.credential` (the ID token)
- Check that the token hasn't expired
- Verify the client ID matches exactly

## Testing Checklist

- [ ] Google Sign-In button appears on login page
- [ ] Clicking button opens Google login dialog
- [ ] After login, token is sent to backend
- [ ] Backend returns 200 with access token
- [ ] User is redirected to dashboard
- [ ] Token is stored in localStorage
- [ ] Subsequent API calls include the token
- [ ] Token refresh works after 1 hour

## Debugging Steps

1. **Check browser console** for JavaScript errors
2. **Check Network tab** to see the request/response:
   - POST to `/api/auth/google-login`
   - Request body should have `{"token": "eyJ..."}`
   - Response should have `{"access_token": "...", "user": {...}}`
3. **Check backend logs** for detailed error messages
4. **Decode the token** to verify it contains correct fields
5. **Verify environment variables** in both frontend and backend

## Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Never log the full token in production
3. ✅ Validate token expiration on backend
4. ✅ Use secure HTTP-only cookies for tokens (optional)
5. ✅ Implement CSRF protection
6. ✅ Validate email verification status
7. ✅ Rate limit login attempts

