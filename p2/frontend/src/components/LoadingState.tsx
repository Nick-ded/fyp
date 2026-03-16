import React from 'react'
import { motion } from 'framer-motion'

interface LoadingStateProps {
  isLoading: boolean
  operation: string
  progress?: number
  error?: string | null
  onRetry?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse' | 'progress'
}

const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  operation,
  progress,
  error,
  onRetry,
  className = '',
  size = 'md',
  variant = 'spinner'
}) => {
  if (!isLoading && !error) return null

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const containerSizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-red-500/10 border border-red-500/30 rounded-lg ${containerSizeClasses[size]} text-center ${className}`}
      >
        <div className="flex items-center justify-center gap-2 text-red-400 mb-2">
          <span className="text-lg">⚠️</span>
          <span className={`font-medium ${textSizeClasses[size]}`}>Operation Failed</span>
        </div>
        <p className={`text-gray-300 mb-3 ${textSizeClasses[size]}`}>{error}</p>
        {onRetry && (
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg 
              transition-all duration-200 font-medium ${textSizeClasses[size]}`}
          >
            Retry
          </motion.button>
        )}
      </motion.div>
    )
  }

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`bg-blue-400 rounded-full ${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'}`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <motion.div
            className={`bg-blue-400 rounded-full ${sizeClasses[size]}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
          />
        )

      case 'progress':
        return (
          <div className="w-full">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress || 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {typeof progress === 'number' && (
              <div className={`text-center text-blue-400 font-medium ${textSizeClasses[size]}`}>
                {Math.round(progress)}%
              </div>
            )}
          </div>
        )

      default: // spinner
        return (
          <div className={`border-2 border-blue-400 border-t-transparent rounded-full animate-spin ${sizeClasses[size]}`} />
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center ${containerSizeClasses[size]} ${className}`}
    >
      <div className="mb-3">
        {renderLoadingIndicator()}
      </div>
      
      <div className={`text-center text-blue-400 font-medium ${textSizeClasses[size]} mb-1`}>
        {operation}
      </div>
      
      {typeof progress === 'number' && variant !== 'progress' && (
        <div className={`text-center text-gray-400 ${textSizeClasses[size]}`}>
          {Math.round(progress)}%
        </div>
      )}
    </motion.div>
  )
}

// Inline loading component for buttons
export const ButtonLoading: React.FC<{ isLoading: boolean; children: React.ReactNode }> = ({
  isLoading,
  children
}) => {
  if (!isLoading) return <>{children}</>

  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      {children}
    </div>
  )
}

// Overlay loading component
export const OverlayLoading: React.FC<{
  isLoading: boolean
  operation: string
  progress?: number
}> = ({ isLoading, operation, progress }) => {
  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-surface-elevated border border-surface-border rounded-2xl p-8 max-w-sm w-full mx-4">
        <LoadingState
          isLoading={true}
          operation={operation}
          progress={progress}
          size="lg"
          variant={typeof progress === 'number' ? 'progress' : 'spinner'}
        />
      </div>
    </motion.div>
  )
}

export default LoadingState