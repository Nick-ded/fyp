import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'

// Your Firebase configuration
// Get this from Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Validate Firebase config
const isConfigValid = Object.entries(firebaseConfig).every(([key, value]) => {
  if (!value || value === 'undefined') {
    console.warn(`Missing Firebase config: ${key}`)
    return false
  }
  return true
})

if (!isConfigValid) {
  console.error('Firebase configuration is incomplete. Please check your .env.local file.')
  console.warn('Firebase Config:', firebaseConfig)
}

// Initialize Firebase
let app = null
let auth = null

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  
  // Set persistence to LOCAL so user stays logged in
  setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
      console.error('Error setting persistence:', error)
    })
  
  console.log('✅ Firebase initialized successfully')
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
  console.error('Please ensure all Firebase environment variables are set correctly in .env.local')
}

export { auth }
export default app
