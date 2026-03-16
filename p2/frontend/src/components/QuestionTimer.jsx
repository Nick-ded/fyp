import React from 'react'
import { motion } from 'framer-motion'
import useInterviewTimer from '../hooks/useInterviewTimer'

function QuestionTimer({ 
  questionId, 
  allocatedTime = 120, 
  onTimeUp, 
  onSkip, 
  onDone, 
  strictMode = false,
  isRecording = false,
  className = '' 
}) {
  const {
    timeRemaining,
    timeUsed,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    formattedTime,
    getTimerColor,
    getTimerBgColor
  } = useInterviewTimer(questionId, allocatedTime, onTimeUp)

  const handlePauseResume = () => {
    if (isRunning) {
      pauseTimer()
    } else if (isPaused) {
      resumeTimer()
    } else {
      startTimer()
    }
  }

  const handleSkip = () => {
    const finalTimeUsed = stopTimer()
    onSkip?.(finalTimeUsed, true) // true indicates skipped
  }

  const handleDone = () => {
    const finalTimeUsed = stopTimer()
    onDone?.(finalTimeUsed, false) // false indicates completed
  }

  // Auto-start timer when recording begins
  React.useEffect(() => {
    if (isRecording && !isRunning && !isPaused) {
      startTimer()
    } else if (!isRecording && isRunning) {
      pauseTimer()
    }
  }, [isRecording, isRunning, isPaused, startTimer, pauseTimer])

  const shouldPulse = timeRemaining < 30 && isRunning

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Timer Display */}
      <motion.div
        animate={shouldPulse ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 1, repeat: shouldPulse ? Infinity : 0 }}
        className={`${getTimerBgColor()} border rounded-xl p-4 text-center backdrop-blur-sm`}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            isRunning ? 'bg-green-500 animate-pulse' : 
            isPaused ? 'bg-amber-500' : 'bg-gray-500'
          }`} />
          <span className={`text-3xl font-mono font-bold ${getTimerColor()}`}>
            {formattedTime}
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <span>Used: {Math.floor(timeUsed / 60)}:{(timeUsed % 60).toString().padStart(2, '0')}</span>
          <span>•</span>
          <span>Total: {Math.floor(allocatedTime / 60)}:{(allocatedTime % 60).toString().padStart(2, '0')}</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full transition-colors duration-300 ${
              timeRemaining >= 60 ? 'bg-green-500' :
              timeRemaining >= 30 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeRemaining / allocatedTime) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>

      {/* Timer Controls */}
      <div className="flex gap-3 justify-center">
        {/* Pause/Resume Button - only show if not in strict mode */}
        {!strictMode && (
          <motion.button
            onClick={handlePauseResume}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              isRunning 
                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30'
                : isPaused
                ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                : 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
            }`}
          >
            {isRunning ? '⏸ Pause' : isPaused ? '▶ Resume' : '▶ Start'}
          </motion.button>
        )}

        {/* Skip Question Button */}
        <motion.button
          onClick={handleSkip}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg font-semibold text-sm transition-all
            bg-gray-500/20 border border-gray-500/30 text-gray-400 hover:bg-gray-500/30"
        >
          ⏭ Skip Question
        </motion.button>

        {/* I'm Done Button */}
        <motion.button
          onClick={handleDone}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg font-semibold text-sm transition-all
            bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
        >
          ✓ I'm Done
        </motion.button>
      </div>

      {/* Status Messages */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-amber-400 text-sm bg-amber-500/10 border border-amber-500/30 
            rounded-lg p-2"
        >
          ⏸ Timer paused
        </motion.div>
      )}

      {timeRemaining <= 10 && timeRemaining > 0 && isRunning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-400 text-sm bg-red-500/10 border border-red-500/30 
            rounded-lg p-2 animate-pulse"
        >
          ⚠️ Time almost up!
        </motion.div>
      )}
    </div>
  )
}

export default QuestionTimer