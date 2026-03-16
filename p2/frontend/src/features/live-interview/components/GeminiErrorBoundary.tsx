import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  operation?: string
  onRetry?: () => void
  onSkip?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  isRetrying: boolean
}

class GeminiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, isRetrying: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isRetrying: false }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Gemini API Error:', error, errorInfo)
    
    // Log specific Gemini errors for debugging
    if (error.message?.includes('API key') || error.message?.includes('quota')) {
      console.error('Gemini API Configuration Error:', error.message)
    }
  }

  handleRetry = async () => {
    this.setState({ isRetrying: true })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Brief delay
      this.setState({ hasError: false, error: null, isRetrying: false })
      this.props.onRetry?.()
    } catch (error) {
      this.setState({ isRetrying: false })
    }
  }

  handleSkip = () => {
    this.setState({ hasError: false, error: null })
    this.props.onSkip?.()
  }

  getErrorMessage = (error: Error | null): string => {
    if (!error) return 'An unknown error occurred'
    
    const message = error.message.toLowerCase()
    
    if (message.includes('api key')) {
      return 'API key configuration error. Please check your Gemini API setup.'
    }
    if (message.includes('quota') || message.includes('rate limit')) {
      return 'API quota exceeded. Please try again in a few minutes.'
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your internet connection.'
    }
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.'
    }
    
    return 'AI service temporarily unavailable. Please try again.'
  }

  getErrorIcon = (error: Error | null): string => {
    if (!error) return '⚠️'
    
    const message = error.message.toLowerCase()
    
    if (message.includes('api key')) return '🔑'
    if (message.includes('quota') || message.includes('rate limit')) return '⏱️'
    if (message.includes('network') || message.includes('fetch')) return '🌐'
    if (message.includes('timeout')) return '⏰'
    
    return '🤖'
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.getErrorMessage(this.state.error)
      const errorIcon = this.getErrorIcon(this.state.error)
      const operation = this.props.operation || 'AI operation'

      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{errorIcon}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            {operation} Failed
          </h3>
          
          <p className="text-gray-300 text-sm mb-6">
            {errorMessage}
          </p>
          
          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={this.handleRetry}
              disabled={this.state.isRetrying}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg 
                transition-all duration-200 font-medium disabled:bg-gray-600 
                disabled:cursor-not-allowed flex items-center gap-2"
            >
              {this.state.isRetrying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Retrying...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Retry
                </>
              )}
            </motion.button>
            
            {this.props.onSkip && (
              <motion.button
                onClick={this.handleSkip}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass glass-hover text-white py-2 px-4 rounded-lg 
                  transition-all duration-200 font-medium"
              >
                Skip & Continue
              </motion.button>
            )}
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-gray-500 cursor-pointer">
                Debug Info
              </summary>
              <div className="bg-gray-800 rounded p-2 mt-2 text-xs text-gray-400 font-mono">
                {this.state.error.message}
              </div>
            </details>
          )}
        </motion.div>
      )
    }

    return this.props.children
  }
}

export default GeminiErrorBoundary