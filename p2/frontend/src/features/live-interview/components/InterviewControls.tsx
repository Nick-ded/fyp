import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InterviewControlsProps {
  isRecording: boolean
  isPaused: boolean
  hasRecording: boolean
  isSubmitting: boolean
  canRecord: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onPauseRecording: () => void
  onResumeRecording: () => void
  onSubmitAnswer: () => void
  onReRecord: () => void
  recordingDuration: number
  className?: string
}

const InterviewControls: React.FC<InterviewControlsProps> = ({
  isRecording,
  isPaused,
  hasRecording,
  isSubmitting,
  canRecord,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onSubmitAnswer,
  onReRecord,
  recordingDuration,
  className = ''
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Recording Controls */}
      <div className="glass rounded-2xl p-8 text-center border border-surface-border">
        <AnimatePresence mode="wait">
          {/* Not Recording State */}
          {!isRecording && !hasRecording && (
            <motion.div
              key="not-recording"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎤</span>
              </div>
              <p className="text-gray-400 mb-6">Click the button below to record your answer</p>
              <motion.button
                onClick={onStartRecording}
                disabled={!canRecord}
                whileHover={{ scale: canRecord ? 1.05 : 1 }}
                whileTap={{ scale: canRecord ? 0.95 : 1 }}
                className={`py-4 px-10 rounded-full font-semibold text-lg transition-all ${
                  canRecord
                    ? 'bg-red-500/20 border-2 border-red-500/30 text-red-400 hover:bg-red-500/30'
                    : 'bg-gray-500/20 border-2 border-gray-500/30 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canRecord ? 'Start Recording' : 'Microphone Not Ready'}
              </motion.button>
            </motion.div>
          )}

          {/* Recording State */}
          {isRecording && (
            <motion.div
              key="recording"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-4 h-4 bg-red-500 rounded-full"
                />
                <p className="text-4xl font-mono font-bold text-white">
                  {formatTime(recordingDuration)}
                </p>
              </div>

              <p className="text-gray-400 mb-6">
                {isPaused ? 'Recording paused' : 'Recording in progress...'}
              </p>

              <div className="flex gap-4 justify-center">
                {/* Pause/Resume Button */}
                <motion.button
                  onClick={isPaused ? onResumeRecording : onPauseRecording}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all ${
                    isPaused
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                      : 'bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30'
                  }`}
                >
                  {isPaused ? '▶ Resume' : '⏸ Pause'}
                </motion.button>

                {/* Stop Button */}
                <motion.button
                  onClick={onStopRecording}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass glass-hover text-white py-3 px-6 rounded-lg 
                    transition-all duration-200 font-semibold text-sm"
                >
                  ⏹ Stop Recording
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Recording Complete State */}
          {!isRecording && hasRecording && (
            <motion.div
              key="recording-complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✓</span>
              </div>
              <p className="text-green-400 mb-2 text-lg font-semibold">Answer Recorded!</p>
              <p className="text-gray-400 mb-6">Duration: {formatTime(recordingDuration)}</p>

              <div className="flex gap-4 justify-center flex-wrap">
                <motion.button
                  onClick={onSubmitAnswer}
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className="bg-gradient-accent text-white py-4 px-10 rounded-xl hover:shadow-xl 
                    transition-all duration-200 font-semibold text-lg disabled:bg-gray-600 
                    professional-glow flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Answer
                      <span>→</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={onReRecord}
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className="glass glass-hover text-gray-300 py-4 px-10 rounded-xl 
                    transition-all duration-200 font-semibold text-lg disabled:opacity-50"
                >
                  Re-record
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recording Tips */}
      {!isRecording && !hasRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
        >
          <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
            <span>💡</span>
            Recording Tips
          </h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Speak clearly and at a normal pace</li>
            <li>• Ensure you're in a quiet environment</li>
            <li>• Position yourself close to your microphone</li>
            <li>• Take your time to think before answering</li>
          </ul>
        </motion.div>
      )}

      {/* Processing Status */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center"
        >
          <div className="flex items-center justify-center gap-3 text-blue-400">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">Processing your answer...</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Transcribing audio and analyzing response
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default InterviewControls