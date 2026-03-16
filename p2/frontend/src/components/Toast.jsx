import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Toast({ message, type = 'info', isVisible, onClose, duration = 5000 }) {
  const getToastStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-400'
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-400'
      default:
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      case 'success':
        return '✅'
      default:
        return 'ℹ️'
    }
  }

  // Auto-close after duration
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-4 right-4 z-50 border rounded-lg p-4 flex items-center gap-3 
            backdrop-blur-sm shadow-lg max-w-sm ${getToastStyles()}`}
        >
          <span className="text-xl">{getIcon()}</span>
          <p className="text-sm font-medium flex-1">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast