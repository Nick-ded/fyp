import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import SimpleLanding from './pages/SimpleLanding'
import FinalLanding from './pages/FinalLanding'
import EnhancedLanding from './pages/EnhancedLanding'
import Landing from './pages/Landing'
import LiveInterview from './pages/LiveInterview'
import InterviewResults from './pages/InterviewResults'
import Upload from './pages/Upload'
import VideoUpload from './pages/VideoUpload'
import Dashboard from './pages/Dashboard'
import Results from './pages/Results'
import Login from './pages/Login'
import Signup from './pages/Signup'
import FirebaseLogin from './pages/FirebaseLogin'
import FirebaseSignup from './pages/FirebaseSignup'
import EnhancedResumeUpload from './pages/EnhancedResumeUpload'
import Profile from './pages/Profile'
import TestUpload from './pages/TestUpload'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<SimpleLanding />} />
              <Route path="/polished" element={<FinalLanding />} />
              <Route path="/enhanced" element={<EnhancedLanding />} />
              <Route path="/classic" element={<Landing />} />
              <Route path="/live-interview" element={<LiveInterview />} />
              <Route path="/interview-results" element={<InterviewResults />} />
              <Route path="/interview-results/:sessionId" element={<InterviewResults />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/video-upload" element={<VideoUpload />} />
              <Route path="/test-upload" element={<TestUpload />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/results/:id" element={<Results />} />
              <Route path="/login" element={<Navigate to="/firebase-login" replace />} />
              <Route path="/signup" element={<Navigate to="/firebase-signup" replace />} />
              <Route path="/firebase-login" element={<FirebaseLogin />} />
              <Route path="/firebase-signup" element={<FirebaseSignup />} />
              <Route path="/enhanced-resume-upload" element={<EnhancedResumeUpload />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
