import { useState, useRef, useEffect, useCallback } from 'react'

interface TimerState {
  timeRemaining: number
  timeUsed: number
  isRunning: boolean
  isPaused: boolean
  isExpired: boolean
}

interface TimerConfig {
  allocatedTime: number
  onTimeUp?: (timeUsed: number) => void
  onTick?: (timeRemaining: number, timeUsed: number) => void
}

export function useInterviewTimer(questionId: string, config: TimerConfig) {
  const { allocatedTime, onTimeUp, onTick } = config
  
  const [state, setState] = useState<TimerState>({
    timeRemaining: allocatedTime,
    timeUsed: 0,
    isRunning: false,
    isPaused: false,
    isExpired: false
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedTimeRef = useRef<number>(0)
  const lastUpdateRef = useRef<number>(Date.now())

  // Cleanup function
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Calculate time used
  const calculateTimeUsed = useCallback(() => {
    if (startTimeRef.current) {
      const totalElapsed = Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000)
      return Math.min(totalElapsed, allocatedTime)
    }
    return 0
  }, [allocatedTime])

  // Start timer
  const startTimer = useCallback(() => {
    if (state.isExpired || state.timeRemaining <= 0) return

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    } else if (state.isPaused) {
      // Resuming from pause
      pausedTimeRef.current += Date.now() - lastUpdateRef.current
    }
    
    setState(prev => ({ ...prev, isRunning: true, isPaused: false }))
    
    intervalRef.current = setInterval(() => {
      const used = calculateTimeUsed()
      const remaining = Math.max(0, allocatedTime - used)
      
      setState(prev => ({
        ...prev,
        timeUsed: used,
        timeRemaining: remaining,
        isExpired: remaining === 0
      }))
      
      onTick?.(remaining, used)
      
      if (remaining === 0) {
        setState(prev => ({ ...prev, isRunning: false }))
        cleanup()
        onTimeUp?.(used)
      }
    }, 100) // Update every 100ms for smooth countdown
  }, [state.isExpired, state.timeRemaining, state.isPaused, allocatedTime, calculateTimeUsed, onTick, onTimeUp, cleanup])

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (state.isRunning && !state.isPaused) {
      setState(prev => ({ ...prev, isPaused: true, isRunning: false }))
      lastUpdateRef.current = Date.now()
      cleanup()
    }
  }, [state.isRunning, state.isPaused, cleanup])

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (state.isPaused && !state.isExpired) {
      startTimer()
    }
  }, [state.isPaused, state.isExpired, startTimer])

  // Stop timer
  const stopTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false, isPaused: false }))
    cleanup()
    
    const finalTimeUsed = calculateTimeUsed()
    setState(prev => ({ ...prev, timeUsed: finalTimeUsed }))
    
    return finalTimeUsed
  }, [cleanup, calculateTimeUsed])

  // Reset timer
  const resetTimer = useCallback((newAllocatedTime = allocatedTime) => {
    cleanup()
    setState({
      timeRemaining: newAllocatedTime,
      timeUsed: 0,
      isRunning: false,
      isPaused: false,
      isExpired: false
    })
    startTimeRef.current = null
    pausedTimeRef.current = 0
    lastUpdateRef.current = Date.now()
  }, [allocatedTime, cleanup])

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Get timer color based on remaining time
  const getTimerColor = useCallback(() => {
    if (state.timeRemaining >= 60) return 'text-green-400'
    if (state.timeRemaining >= 30) return 'text-amber-400'
    return 'text-red-400'
  }, [state.timeRemaining])

  // Get timer background color
  const getTimerBgColor = useCallback(() => {
    if (state.timeRemaining >= 60) return 'bg-green-500/10 border-green-500/30'
    if (state.timeRemaining >= 30) return 'bg-amber-500/10 border-amber-500/30'
    return 'bg-red-500/10 border-red-500/30'
  }, [state.timeRemaining])

  // Reset when questionId changes
  useEffect(() => {
    resetTimer()
  }, [questionId, resetTimer])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  // Save state to sessionStorage
  useEffect(() => {
    const timerData = {
      questionId,
      timeUsed: state.timeUsed,
      timeRemaining: state.timeRemaining,
      isExpired: state.isExpired,
      timestamp: Date.now()
    }
    sessionStorage.setItem(`timer_${questionId}`, JSON.stringify(timerData))
  }, [questionId, state.timeUsed, state.timeRemaining, state.isExpired])

  // Restore state from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem(`timer_${questionId}`)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        // Only restore if data is recent (within 1 hour)
        if (Date.now() - parsed.timestamp < 3600000) {
          setState(prev => ({
            ...prev,
            timeUsed: parsed.timeUsed || 0,
            timeRemaining: parsed.timeRemaining || allocatedTime,
            isExpired: parsed.isExpired || false
          }))
        }
      } catch (error) {
        console.error('Error restoring timer state:', error)
      }
    }
  }, [questionId, allocatedTime])

  return {
    ...state,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    formatTime,
    getTimerColor,
    getTimerBgColor,
    formattedTime: formatTime(state.timeRemaining),
    formattedTimeUsed: formatTime(state.timeUsed),
    progress: allocatedTime > 0 ? (state.timeUsed / allocatedTime) * 100 : 0
  }
}