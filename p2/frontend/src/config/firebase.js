import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

// Your Firebase configuration
// Get this from Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// measurementId is optional (Analytics only)
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']

const missingKeys = requiredKeys.filter((key) => {
  const value = firebaseConfig[key]
  if (!value || value === 'undefined') {
    console.warn(`Missing Firebase config: ${key}`)
    return true
  }
  return false
})

const isConfigValid = missingKeys.length === 0

// Initialize Firebase
let app = null
let auth = null
let analytics = null

try {
  if (!isConfigValid) {
    console.error(
      `❌ Firebase configuration incomplete. Missing: ${missingKeys.join(', ')}. ` +
      'Authentication features are disabled until env vars are configured.'
    )
  } else {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)

    // Set persistence to LOCAL so user stays logged in
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error('Error setting persistence:', error)
      })

    console.log('✅ Firebase initialized successfully')
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
  console.error('Please ensure all Firebase environment variables are set correctly in .env.local')
}

export { auth, analytics }
export default app
