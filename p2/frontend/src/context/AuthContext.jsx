import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { getAuthToken, setAuthToken, clearAuthToken } from '../utils/authStorage'
import { syncFirebaseUser } from '../api/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    // Only restore from localStorage if Firebase is properly configured
    if (auth) {
      const storedToken = getAuthToken()
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          console.log('User loaded from localStorage:', userData.email)
          setUser(userData)
        } catch (err) {
          console.error('Error parsing stored user:', err)
        }
      }
    }
    
    if (!auth) {
      console.warn('Firebase auth not initialized - Firebase env vars are missing. Login is disabled.')
      setLoading(false)
      return
    }

    // Listen for auth state changes (Firebase)
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // User is logged in
            console.log('User logged in:', firebaseUser.email)
            
            // Check if user is new (created in last 5 seconds)
            const createdAt = firebaseUser.metadata?.creationTime
            const now = new Date()
            const isNew = createdAt && (now - new Date(createdAt)) < 5000
            
            console.log('User metadata:', {
              createdAt,
              isNew,
              timeDiff: createdAt ? now - new Date(createdAt) : 'N/A'
            })
            
            setIsNewUser(isNew)
            
            const idToken = await firebaseUser.getIdToken()
            
            // Sync user to local DB (creates record if first login)
            await syncFirebaseUser(idToken)
            
            // Store user info
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              idToken: idToken,
              isNew: isNew,
            }
            
            setUser(userData)

            // Store token for API calls.
            setAuthToken(idToken)
            localStorage.setItem('user', JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              isNew: isNew,
            }))
            
            // Store new user flag for redirect
            if (isNew) {
              localStorage.setItem('newUserRedirect', 'true')
            }
          } else {
            // User is logged out
            console.log('User logged out')
            setUser(null)
            setIsNewUser(false)
            clearAuthToken()
            localStorage.removeItem('user')
            localStorage.removeItem('newUserRedirect')
          }
        } catch (err) {
          console.error('Error in auth state change:', err)
          setError(err.message)
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error('Auth state change error:', error)
        setError(error.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isNewUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
