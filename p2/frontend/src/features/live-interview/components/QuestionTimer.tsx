import React from 'react'
import { motion } from 'framer-motion'

interface QuestionTimerProps {
  timeRemaining: number
  timeUsed: number
  allocatedTime: number
  isRunning: boolean
  isPaused: boolean
  isExpired: boolean
  progress: number
  formattedTime: string
  formattedTimeUsed: string
  getTimerColor: () => string
  getTimerBgColor: () => string
  onPause?: () => void
  onResume?: () => void
  onSkip?: () => void
  onComplete?: () => void
  strictMode?: boolean
  className?: string
}

const QuestionTimer: React.FC<QuestionTimerProps> = ({
  timeRemaining,
  timeUsed,
  allocatedTime,
  isRunning,
  isPaused,
  isExpired,
  progress,
  formattedTime,
  formattedTimeUsed,
  getTimerColor,
  getTimerBgColor,
  onPause,
  onResume,
  onSkip,
  onComplete,
  strictMode = false,
  className = ''
}) => {
  const shouldPulse = timeRemaining < 30 && isRunning

  const handlePauseResume = () => {
    if (isRunning) {
      onPause?.()
    } else if (isPaused) {
      onResume?.()
    }
  }

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
            isPaused ? 'bg-amber-500' : 
            isExpired ? 'bg-red-500' :
            'bg-gray-500'
          }`} />
          <span className={`text-3xl font-mono font-bold ${getTimerColor()}`}>
            {formattedTime}
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-3">
          <span>Used: {formattedTimeUsed}</span>
          <span>•</span>
          <span>Total: {Math.floor(allocatedTime / 60)}:{(allocatedTime % 60).toString().padStart(2, '0')}</span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full transition-colors duration-300 ${
              timeRemaining >= 60 ? 'bg-green-500' :
              timeRemaining >= 30 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Timer Controls */}
      <div className="flex gap-3 justify-center flex-wrap">
        {/* Pause/Resume Button - only show if not in strict mode */}
        {!strictMode && !isExpired && (
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
        {!isExpired && (
          <motion.button
            onClick={onSkip}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all
              bg-gray-500/20 border border-gray-500/30 text-gray-400 hover:bg-gray-500/30"
          >
            ⏭ Skip Question
          </motion.button>
        )}

        {/* I'm Done Button */}
        {!isExpired && (
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all
              bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
          >
            ✓ I'm Done
          </motion.button>
        )}
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

      {isExpired && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-400 text-sm bg-red-500/10 border border-red-500/30 
            rounded-lg p-2 animate-pulse"
        >
          ⏰ Time's up!
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