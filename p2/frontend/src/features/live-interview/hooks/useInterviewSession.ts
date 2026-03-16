import { useState, useCallback, useEffect } from 'react'

interface QuestionSession {
  questionId: string
  questionText: string
  allocatedTime: number
  timeUsed: number
  skipped: boolean
  audioBlob: Blob | null
  transcript: string | null
  transcriptionStatus: 'pending' | 'success' | 'failed'
  analysis: any | null
  analysisStatus: 'pending' | 'success' | 'failed'
}

interface InterviewSessionState {
  sessionId: string | null
  currentQuestionIndex: number
  questions: any[]
  questionSessions: Map<string, QuestionSession>
  isComplete: boolean
  targetedRole: string
  yearsOfExperience: number
}

interface SessionConfig {
  onSessionUpdate?: (state: InterviewSessionState) => void
  onQuestionComplete?: (questionId: string, session: QuestionSession) => void
}

const SESSION_STORAGE_KEY = 'interview_session_state'

export function useInterviewSession(config: SessionConfig = {}) {
  const { onSessionUpdate, onQuestionComplete } = config

  const [state, setState] = useState<InterviewSessionState>({
    sessionId: null,
    currentQuestionIndex: 0,
    questions: [],
    questionSessions: new Map(),
    isComplete: false,
    targetedRole: 'Software Developer',
    yearsOfExperience: 3
  })

  // Save state to sessionStorage
  const saveToStorage = useCallback((newState: InterviewSessionState) => {
    try {
      const serializable = {
        ...newState,
        questionSessions: Array.from(newState.questionSessions.entries()).map(([key, value]) => [
          key,
          {
            ...value,
            audioBlob: null // Don't store blobs in sessionStorage
          }
        ])
      }
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(serializable))
    } catch (error) {
      console.error('Error saving session to storage:', error)
    }
  }, [])

  // Load state from sessionStorage
  const loadFromStorage = useCallback(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        const questionSessions = new Map(parsed.questionSessions || [])
        
        setState({
          ...parsed,
          questionSessions
        })
        return true
      }
    } catch (error) {
      console.error('Error loading session from storage:', error)
    }
    return false
  }, [])

  // Initialize session
  const initializeSession = useCallback((
    sessionId: string,
    questions: any[],
    targetedRole: string = 'Software Developer',
    yearsOfExperience: number = 3
  ) => {
    const questionSessions = new Map<string, QuestionSession>()
    
    questions.forEach((question, index) => {
      const questionId = question.id || `question_${index}`
      questionSessions.set(questionId, {
        questionId,
        questionText: question.question,
        allocatedTime: question.allocatedTime || 120,
        timeUsed: 0,
        skipped: false,
        audioBlob: null,
        transcript: null,
        transcriptionStatus: 'pending',
        analysis: null,
        analysisStatus: 'pending'
      })
    })

    const newState = {
      sessionId,
      currentQuestionIndex: 0,
      questions,
      questionSessions,
      isComplete: false,
      targetedRole,
      yearsOfExperience
    }

    setState(newState)
    saveToStorage(newState)
    onSessionUpdate?.(newState)
  }, [saveToStorage, onSessionUpdate])

  // Update question session
  const updateQuestionSession = useCallback((
    questionId: string,
    updates: Partial<QuestionSession>
  ) => {
    setState(prev => {
      const newSessions = new Map(prev.questionSessions)
      const session = newSessions.get(questionId)
      
      if (session) {
        const updatedSession = { ...session, ...updates }
        newSessions.set(questionId, updatedSession)
        
        const newState = {
          ...prev,
          questionSessions: newSessions
        }
        
        saveToStorage(newState)
        onSessionUpdate?.(newState)
        onQuestionComplete?.(questionId, updatedSession)
        
        return newState
      }
      
      return prev
    })
  }, [saveToStorage, onSessionUpdate, onQuestionComplete])

  // Move to next question
  const moveToNextQuestion = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1
      const isComplete = nextIndex >= prev.questions.length
      
      const newState = {
        ...prev,
        currentQuestionIndex: nextIndex,
        isComplete
      }
      
      saveToStorage(newState)
      onSessionUpdate?.(newState)
      
      return newState
    })
  }, [saveToStorage, onSessionUpdate])

  // Move to previous question
  const moveToPreviousQuestion = useCallback(() => {
    setState(prev => {
      const prevIndex = Math.max(0, prev.currentQuestionIndex - 1)
      
      const newState = {
        ...prev,
        currentQuestionIndex: prevIndex,
        isComplete: false
      }
      
      saveToStorage(newState)
      onSessionUpdate?.(newState)
      
      return newState
    })
  }, [saveToStorage, onSessionUpdate])

  // Skip current question
  const skipCurrentQuestion = useCallback((timeUsed: number = 0) => {
    const currentQuestion = state.questions[state.currentQuestionIndex]
    if (currentQuestion) {
      const questionId = currentQuestion.id || `question_${state.currentQuestionIndex}`
      updateQuestionSession(questionId, {
        skipped: true,
        timeUsed
      })
      moveToNextQuestion()
    }
  }, [state.questions, state.currentQuestionIndex, updateQuestionSession, moveToNextQuestion])

  // Complete current question
  const completeCurrentQuestion = useCallback((
    audioBlob: Blob,
    timeUsed: number,
    transcript?: string
  ) => {
    const currentQuestion = state.questions[state.currentQuestionIndex]
    if (currentQuestion) {
      const questionId = currentQuestion.id || `question_${state.currentQuestionIndex}`
      
      // Store audio blob separately in sessionStorage with a different key
      try {
        const reader = new FileReader()
        reader.onload = () => {
          sessionStorage.setItem(`audio_${questionId}`, reader.result as string)
        }
        reader.readAsDataURL(audioBlob)
      } catch (error) {
        console.error('Error storing audio blob:', error)
      }
      
      updateQuestionSession(questionId, {
        audioBlob,
        timeUsed,
        transcript: transcript || null,
        transcriptionStatus: transcript ? 'success' : 'pending'
      })
      
      moveToNextQuestion()
    }
  }, [state.questions, state.currentQuestionIndex, updateQuestionSession, moveToNextQuestion])

  // Get current question
  const getCurrentQuestion = useCallback(() => {
    return state.questions[state.currentQuestionIndex] || null
  }, [state.questions, state.currentQuestionIndex])

  // Get current question session
  const getCurrentQuestionSession = useCallback(() => {
    const currentQuestion = getCurrentQuestion()
    if (currentQuestion) {
      const questionId = currentQuestion.id || `question_${state.currentQuestionIndex}`
      return state.questionSessions.get(questionId) || null
    }
    return null
  }, [getCurrentQuestion, state.currentQuestionIndex, state.questionSessions])

  // Reset session
  const resetSession = useCallback(() => {
    const newState = {
      sessionId: null,
      currentQuestionIndex: 0,
      questions: [],
      questionSessions: new Map(),
      isComplete: false,
      targetedRole: 'Software Developer',
      yearsOfExperience: 3
    }
    
    setState(newState)
    
    // Clear sessionStorage
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    
    // Clear audio blobs
    state.questionSessions.forEach((_, questionId) => {
      sessionStorage.removeItem(`audio_${questionId}`)
    })
    
    onSessionUpdate?.(newState)
  }, [state.questionSessions, onSessionUpdate])

  // Get session statistics
  const getSessionStats = useCallback(() => {
    const sessions = Array.from(state.questionSessions.values())
    const totalQuestions = sessions.length
    const answeredQuestions = sessions.filter(s => !s.skipped && s.audioBlob).length
    const skippedQuestions = sessions.filter(s => s.skipped).length
    const totalTimeUsed = sessions.reduce((sum, s) => sum + s.timeUsed, 0)
    const transcriptionSuccessRate = sessions.filter(s => s.transcriptionStatus === 'success').length / Math.max(1, answeredQuestions) * 100
    const analysisSuccessRate = sessions.filter(s => s.analysisStatus === 'success').length / Math.max(1, answeredQuestions) * 100
    
    return {
      totalQuestions,
      answeredQuestions,
      skippedQuestions,
      totalTimeUsed,
      transcriptionSuccessRate,
      analysisSuccessRate,
      completionRate: (answeredQuestions / Math.max(1, totalQuestions)) * 100
    }
  }, [state.questionSessions])

  // Load from storage on mount
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  // Auto-save on state changes
  useEffect(() => {
    if (state.sessionId) {
      saveToStorage(state)
    }
  }, [state, saveToStorage])

  return {
    ...state,
    initializeSession,
    updateQuestionSession,
    moveToNextQuestion,
    moveToPreviousQuestion,
    skipCurrentQuestion,
    completeCurrentQuestion,
    getCurrentQuestion,
    getCurrentQuestionSession,
    resetSession,
    getSessionStats,
    loadFromStorage,
    hasUnsavedData: state.sessionId !== null
  }
}