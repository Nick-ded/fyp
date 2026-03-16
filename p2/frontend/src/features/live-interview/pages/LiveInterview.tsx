import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// Hooks
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { useInterviewTimer } from '../hooks/useInterviewTimer'
import { useInterviewSession } from '../hooks/useInterviewSession'

// Components
import MicHealthCheck from '../components/MicHealthCheck'
import AudioWaveform from '../components/AudioWaveform'
import QuestionTimer from '../components/QuestionTimer'
import InterviewControls from '../components/InterviewControls'
import GeminiErrorBoundary from '../components/GeminiErrorBoundary'

// Services
import { transcribeAudio } from '../services/transcriptionService'
import { batchAnalyzeAnswers } from '../services/analysisService'
import { generateSessionSummary, createInterviewSessionResult, generatePerformanceInsights } from '../services/summaryService'

// API
import { startAIInterview } from '../../../api/api'

interface LiveInterviewProps {
  className?: string
}

type InterviewStep = 'setup' | 'mic-check' | 'interview' | 'processing' | 'complete'

const LiveInterview: React.FC<LiveInterviewProps> = ({ className = '' }) => {
  const navigate = useNavigate()
  
  // State
  const [step, setStep] = useState<InterviewStep>('setup')
  const [showMicCheck, setShowMicCheck] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const [strictMode, setStrictMode] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    resume: null as File | null,
    jobDescription: '',
    targetedRole: 'Software Developer',
    yearsOfExperience: 3,
    numQuestions: 5
  })
  const [isGenerating, setIsGenerating] = useState(false)

  // Session management
  const session = useInterviewSession({
    onSessionUpdate: (state) => {
      // Save to sessionStorage is handled automatically
    },
    onQuestionComplete: (questionId, questionSession) => {
      console.log(`Question ${questionId} completed:`, questionSession)
    }
  })

  // Current question data
  const currentQuestion = session.getCurrentQuestion()
  const currentQuestionSession = session.getCurrentQuestionSession()
  const questionId = currentQuestion?.id || `question_${session.currentQuestionIndex}`

  // Audio recorder
  const audioRecorder = useAudioRecorder({
    onRecordingComplete: async (blob, duration) => {
      setProcessingStatus('Transcribing audio...')
      
      try {
        // Transcribe audio with progress tracking
        const transcriptionResult = await transcribeAudio(
          blob,
          (loadingState) => {
            if (loadingState.isLoading) {
              setProcessingStatus(`Transcribing audio... ${Math.round(loadingState.progress || 0)}%`)
            }
          }
        )
        
        // Complete the question with audio and transcript
        session.completeCurrentQuestion(
          blob,
          duration,
          transcriptionResult.transcript
        )
        
        // Update session with transcription status
        session.updateQuestionSession(questionId, {
          transcriptionStatus: transcriptionResult.status
        })
        
      } catch (error) {
        console.error('Error processing recording:', error)
        session.updateQuestionSession(questionId, {
          transcriptionStatus: 'failed'
        })
      }
      
      setProcessingStatus('')
    },
    onSilenceDetected: () => {
      // Show silence warning (handled by AudioWaveform component)
    }
  })

  // Timer
  const timer = useInterviewTimer(questionId, {
    allocatedTime: currentQuestion?.allocatedTime || 120,
    onTimeUp: (timeUsed) => {
      // Auto-stop recording and submit
      if (audioRecorder.isRecording) {
        audioRecorder.stopRecording()
      }
      handleTimerComplete(timeUsed, false)
    }
  })

  // Handle form submission
  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.resume || !formData.jobDescription.trim()) {
      alert('Please upload a resume and provide a job description')
      return
    }
    
    setIsGenerating(true)
    
    try {
      const response = await startAIInterview(
        formData.resume,
        formData.jobDescription,
        formData.numQuestions
      )
      
      if (response.success) {
        // Initialize session
        session.initializeSession(
          response.session_id,
          response.questions,
          formData.targetedRole,
          formData.yearsOfExperience
        )
        
        // Show microphone check
        setShowMicCheck(true)
      }
    } catch (error) {
      console.error('Error starting interview:', error)
      alert('Failed to start interview. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle microphone validation
  const handleMicValidationComplete = (success: boolean) => {
    setShowMicCheck(false)
    if (success) {
      setStep('interview')
      // Start timer when interview begins
      timer.startTimer()
    }
  }

  // Handle timer completion
  const handleTimerComplete = (timeUsed: number, skipped: boolean) => {
    session.updateQuestionSession(questionId, { timeUsed })
    
    if (skipped) {
      session.skipCurrentQuestion(timeUsed)
    } else {
      // Move to next question or complete interview
      if (session.currentQuestionIndex >= session.questions.length - 1) {
        handleCompleteInterview()
      }
    }
  }

  // Handle question skip
  const handleSkipQuestion = () => {
    const timeUsed = timer.stopTimer()
    handleTimerComplete(timeUsed, true)
  }

  // Handle question completion
  const handleQuestionDone = () => {
    if (audioRecorder.isRecording) {
      audioRecorder.stopRecording()
    }
    const timeUsed = timer.stopTimer()
    handleTimerComplete(timeUsed, false)
  }

  // Handle recording submission
  const handleSubmitAnswer = async () => {
    if (!currentQuestionSession?.audioBlob) {
      alert('Please record an answer first')
      return
    }

    setIsSubmitting(true)
    
    try {
      // The transcription and session update is handled in onRecordingComplete
      // Just move to next question or complete interview
      if (session.currentQuestionIndex >= session.questions.length - 1) {
        await handleCompleteInterview()
      } else {
        session.moveToNextQuestion()
        timer.resetTimer()
        audioRecorder.reset()
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle interview completion
  const handleCompleteInterview = async () => {
    setStep('processing')
    setProcessingStatus('Analyzing your responses...')
    
    try {
      // Prepare analysis requests
      const analysisRequests = Array.from(session.questionSessions.values())
        .filter(s => s.transcript && !s.skipped)
        .map(s => ({
          questionId: s.questionId,
          questionText: s.questionText,
          transcript: s.transcript!,
          targetedRole: session.targetedRole,
          yearsOfExperience: session.yearsOfExperience
        }))

      // Batch analyze answers with progress tracking
      const analysisResults = await batchAnalyzeAnswers(
        analysisRequests,
        (questionId, loadingState) => {
          if (loadingState.isLoading) {
            setProcessingStatus(`Analyzing question ${questionId}... ${Math.round(loadingState.progress || 0)}%`)
          }
        }
      )
      
      // Update sessions with analysis results
      analysisResults.forEach(result => {
        session.updateQuestionSession(result.questionId, {
          analysis: result,
          analysisStatus: result.status
        })
      })

      setProcessingStatus('Generating coaching summary...')
      
      // Generate session summary with progress tracking
      const summary = await generateSessionSummary(
        analysisResults, 
        session.targetedRole,
        (loadingState) => {
          if (loadingState.isLoading) {
            setProcessingStatus(`Generating summary... ${Math.round(loadingState.progress || 0)}%`)
          }
        }
      )
      
      // Create final session result
      const sessionResult = createInterviewSessionResult(
        session.sessionId!,
        'current-user', // TODO: Get from auth context
        session.targetedRole,
        analysisResults,
        summary,
        session.questionSessions
      )
      
      // Generate performance insights
      const insights = generatePerformanceInsights(sessionResult)
      
      // Navigate to results page with data
      navigate('/interview-results', {
        state: {
          sessionResult,
          summary,
          insights,
          questionSessions: Array.from(session.questionSessions.values())
        }
      })
      
    } catch (error) {
      console.error('Error completing interview:', error)
      alert('Failed to complete interview analysis. Please try again.')
      setStep('interview')
    }
  }

  // Handle re-recording
  const handleReRecord = () => {
    audioRecorder.reset()
    session.updateQuestionSession(questionId, {
      audioBlob: null,
      transcript: null,
      transcriptionStatus: 'pending'
    })
  }

  // Load saved session on mount
  useEffect(() => {
    if (session.hasUnsavedData) {
      const shouldRestore = window.confirm(
        'You have an unfinished interview session. Would you like to continue where you left off?'
      )
      
      if (shouldRestore) {
        setStep('interview')
      } else {
        session.resetSession()
      }
    }
  }, [])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Microphone Health Check Modal */}
        <MicHealthCheck
          isVisible={showMicCheck}
          onValidationComplete={handleMicValidationComplete}
        />

        <AnimatePresence mode="wait">
          {/* Setup Step */}
          {step === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-8 border border-surface-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center professional-glow">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white">AI Interview Setup</h1>
                  <p className="text-sm text-gray-400">Upload your resume and get personalized questions</p>
                </div>
              </div>

              <form onSubmit={handleStartInterview} className="space-y-6">
                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    📄 Upload Resume (PDF, DOCX, or TXT)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => setFormData(prev => ({ ...prev, resume: e.target.files?.[0] || null }))}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6
                      file:rounded-xl file:border-0 file:text-sm file:font-semibold
                      file:bg-gradient-accent file:text-white hover:file:shadow-xl
                      file:transition-all file:cursor-pointer
                      bg-surface-elevated border-2 border-surface-border rounded-xl p-3
                      hover:border-blue-500/50 transition-colors cursor-pointer"
                    required
                  />
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    💼 Job Description
                  </label>
                  <textarea
                    value={formData.jobDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 bg-surface-elevated border-2 border-surface-border rounded-xl 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-white placeholder-gray-500 transition-all resize-none"
                    placeholder="Paste the job description here..."
                    required
                  />
                </div>

                {/* Role and Experience */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      🎯 Targeted Role
                    </label>
                    <input
                      type="text"
                      value={formData.targetedRole}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetedRole: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-elevated border-2 border-surface-border rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        text-white placeholder-gray-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      📅 Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 bg-surface-elevated border-2 border-surface-border rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        text-white placeholder-gray-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🎯 Number of Questions
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[3, 5, 7, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, numQuestions: num }))}
                        className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                          formData.numQuestions === num
                            ? 'bg-gradient-accent text-white professional-glow'
                            : 'glass glass-hover text-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strict Mode Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="strictMode"
                    checked={strictMode}
                    onChange={(e) => setStrictMode(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="strictMode" className="text-sm text-gray-300">
                    Strict Mode (No pause/resume during questions)
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-accent text-white py-4 px-6 rounded-xl hover:shadow-xl 
                    transition-all duration-200 font-semibold text-lg disabled:bg-gray-600 
                    disabled:cursor-not-allowed professional-glow flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Start AI Interview
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Interview Step */}
          {step === 'interview' && currentQuestion && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="glass rounded-xl p-4 border border-surface-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Interview Progress</span>
                  <span className="text-sm font-semibold text-white">
                    {session.currentQuestionIndex + 1} / {session.questions.length}
                  </span>
                </div>
                <div className="h-2 bg-surface-elevated rounded-full overflow-hidden border border-surface-border">
                  <motion.div
                    className="h-full bg-gradient-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${((session.currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question Timer */}
              <QuestionTimer
                {...timer}
                onPause={timer.pauseTimer}
                onResume={timer.resumeTimer}
                onSkip={handleSkipQuestion}
                onComplete={handleQuestionDone}
                strictMode={strictMode}
              />

              {/* Question Card */}
              <motion.div
                key={session.currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 border-2 border-blue-500/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center 
                    flex-shrink-0 professional-glow">
                    <span className="text-white font-bold">Q{session.currentQuestionIndex + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                        {currentQuestion.type}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-white leading-relaxed">
                      {currentQuestion.question}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Audio Waveform */}
              <AudioWaveform
                waveformData={audioRecorder.waveformData}
                audioLevel={audioRecorder.audioLevel}
                isRecording={audioRecorder.isRecording}
              />

              {/* Interview Controls */}
              <InterviewControls
                isRecording={audioRecorder.isRecording}
                isPaused={audioRecorder.isPaused}
                hasRecording={!!currentQuestionSession?.audioBlob}
                isSubmitting={isSubmitting}
                canRecord={audioRecorder.isSupported && !audioRecorder.error}
                onStartRecording={audioRecorder.startRecording}
                onStopRecording={audioRecorder.stopRecording}
                onPauseRecording={audioRecorder.pauseRecording}
                onResumeRecording={audioRecorder.resumeRecording}
                onSubmitAnswer={handleSubmitAnswer}
                onReRecord={handleReRecord}
                recordingDuration={audioRecorder.duration}
              />

              {/* Processing Status */}
              {processingStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-3 text-blue-400">
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium">{processingStatus}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <GeminiErrorBoundary
                operation="Interview Analysis"
                onRetry={() => handleCompleteInterview()}
                onSkip={() => {
                  // Navigate to results with partial data
                  navigate('/interview-results', {
                    state: {
                      sessionResult: null,
                      summary: null,
                      insights: null,
                      questionSessions: Array.from(session.questionSessions.values())
                    }
                  })
                }}
              >
                <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Processing Your Interview</h3>
                  <p className="text-gray-400 mb-6">{processingStatus}</p>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <span>🤖</span>
                    <span>Powered by Gemini AI for comprehensive analysis</span>
                  </div>
                </div>
              </GeminiErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default LiveInterview