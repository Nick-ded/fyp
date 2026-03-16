import React from 'react'
import { motion } from 'framer-motion'

interface AudioWaveformProps {
  waveformData: number[]
  audioLevel: number
  isRecording: boolean
  className?: string
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({
  waveformData,
  audioLevel,
  isRecording,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Live Waveform */}
      <div className="flex items-end justify-center gap-1 h-16">
        {waveformData.map((value, index) => (
          <motion.div
            key={index}
            className={`rounded-full transition-colors duration-200 ${
              isRecording 
                ? 'bg-gradient-to-t from-blue-500 to-green-400' 
                : 'bg-gray-500'
            }`}
            style={{
              width: '4px',
              minHeight: '4px'
            }}
            animate={{
              height: `${Math.max(4, value * 60)}px`,
              opacity: isRecording ? 1 : 0.5
            }}
            transition={{ 
              duration: 0.1,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Audio Level Bar */}
      <div className="w-full max-w-xs mx-auto">
        <div className="h-2 bg-surface-border rounded-full overflow-hidden">
          <motion.div
            className={`h-full transition-colors duration-200 ${
              isRecording
                ? 'bg-gradient-to-r from-green-500 to-blue-500'
                : 'bg-gray-500'
            }`}
            animate={{ width: `${audioLevel * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            {isRecording ? (
              audioLevel > 0.02 ? 'Recording...' : 'Speak louder'
            ) : (
              'Not recording'
            )}
          </p>
          <p className="text-xs text-gray-500">
            Level: {Math.round(audioLevel * 100)}%
          </p>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 text-sm text-red-400"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-3 h-3 bg-red-500 rounded-full"
          />
          <span>Recording in progress</span>
        </motion.div>
      )}

      {/* Audio Quality Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${
          audioLevel > 0.1 ? 'bg-green-500' :
          audioLevel > 0.02 ? 'bg-yellow-500' :
          'bg-red-500'
        }`} />
        <span className="text-gray-400">
          {audioLevel > 0.1 ? 'Excellent' :
           audioLevel > 0.02 ? 'Good' :
           'Poor'} audio quality
        </span>
      </div>
    </div>
  )
}

export default AudioWaveform