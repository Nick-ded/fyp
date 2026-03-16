import { useState, useRef, useEffect, useCallback } from 'react'

function useInterviewTimer(questionId, allocatedTime = 120, onTimeUp) {
  const [timeRemaining, setTimeRemaining] = useState(allocatedTime)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeUsed, setTimeUsed] = useState(0)
  
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const pausedTimeRef = useRef(0)
  const lastUpdateRef = useRef(Date.now())

  // Calculate time used whenever timer updates
  const calculateTimeUsed = useCallback(() => {
    if (startTimeRef.current) {
      const totalElapsed = Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000)
      return Math.min(totalElapsed, allocatedTime)
    }
    return 0
  }, [allocatedTime])

  // Start the timer
  const startTimer = useCallback(() => {
    if (!isRunning && timeRemaining > 0) {
      setIsRunning(true)
      setIsPaused(false)
      
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now()
      } else {
        // Resuming from pause
        pausedTimeRef.current += Date.now() - lastUpdateRef.current
      }
      
      intervalRef.current = setInterval(() => {
        const used = calculateTimeUsed()
        const remaining = Math.max(0, allocatedTime - used)
        
        setTimeUsed(used)
        setTimeRemaining(remaining)
        
        if (remaining === 0) {
          setIsRunning(false)
          onTimeUp?.()
        }
      }, 100) // Update every 100ms for smooth countdown
    }
  }, [isRunning, timeRemaining, allocatedTime, calculateTimeUsed, onTimeUp])

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true)
      setIsRunning(false)
      lastUpdateRef.current = Date.now()
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, isPaused])

  // Resume the timer
  const resumeTimer = useCallback(() => {
    if (isPaused && timeRemaining > 0) {
      startTimer()
    }
  }, [isPaused, timeRemaining, startTimer])

  // Stop the timer completely
  const stopTimer = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Final time calculation
    const finalTimeUsed = calculateTimeUsed()
    setTimeUsed(finalTimeUsed)
    
    return finalTimeUsed
  }, [calculateTimeUsed])

  // Reset timer for new question
  const resetTimer = useCallback((newAllocatedTime = allocatedTime) => {
    stopTimer()
    setTimeRemaining(newAllocatedTime)
    setTimeUsed(0)
    startTimeRef.current = null
    pausedTimeRef.current = 0
    lastUpdateRef.current = Date.now()
  }, [allocatedTime, stopTimer])

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Get timer color based on remaining time
  const getTimerColor = useCallback(() => {
    if (timeRemaining >= 60) return 'text-green-400'
    if (timeRemaining >= 30) return 'text-amber-400'
    return 'text-red-400'
  }, [timeRemaining])

  // Get timer background color
  const getTimerBgColor = useCallback(() => {
    if (timeRemaining >= 60) return 'bg-green-500/10 border-green-500/30'
    if (timeRemaining >= 30) return 'bg-amber-500/10 border-amber-500/30'
    return 'bg-red-500/10 border-red-500/30'
  }, [timeRemaining])

  // Cleanup on unmount or question change
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Reset when questionId changes
  useEffect(() => {
    resetTimer()
  }, [questionId, resetTimer])

  return {
    timeRemaining,
    timeUsed,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    formatTime,
    getTimerColor,
    getTimerBgColor,
    formattedTime: formatTime(timeRemaining),
    formattedTimeUsed: formatTime(timeUsed)
  }
}

export default useInterviewTimer