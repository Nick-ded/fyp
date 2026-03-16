import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MicHealthCheckProps {
  isVisible: boolean
  onValidationComplete: (success: boolean) => void
  className?: string
}

interface HealthCheckState {
  status: 'checking' | 'denied' | 'no-audio' | 'ready' | 'error'
  audioLevel: number
  isRetrying: boolean
  error: string | null
}

const MicHealthCheck: React.FC<MicHealthCheckProps> = ({
  isVisible,
  onValidationComplete,
  className = ''
}) => {
  const [state, setState] = useState<HealthCheckState>({
    status: 'checking',
    audioLevel: 0,
    isRetrying: false,
    error: null
  })
  const [showHelp, setShowHelp] = useState(false)

  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAudioTimeRef = useRef<number>(Date.now())

  const getBrowserInstructions = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('chrome')) {
      return {
        browser: 'Chrome',
        steps: [
          'Click the camera/microphone icon in the address bar',
          'Select "Always allow" for microphone access',
          'Refresh the page and try again'
        ]
      }
    } else if (userAgent.includes('firefox')) {
      return {
        browser: 'Firefox',
        steps: [
          'Click the microphone icon in the address bar',
          'Select "Allow" and check "Remember this decision"',
          'Refresh the page and try again'
        ]
      }
    } else if (userAgent.includes('safari')) {
      return {
        browser: 'Safari',
        steps: [
          'Go to Safari > Settings > Websites > Microphone',
          'Set this website to "Allow"',
          'Refresh the page and try again'
        ]
      }
    }
    return {
      browser: 'Your Browser',
      steps: [
        'Look for a microphone icon in your address bar',
        'Click it and select "Allow"',
        'Refresh the page and try again'
      ]
    }
  }, [])

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  const startAudioMonitoring = useCallback((stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()

      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const checkAudioLevel = () => {
        if (!analyserRef.current) return

        analyserRef.current.getByteFrequencyData(dataArray)

        // Calculate average volume
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
        const normalizedLevel = Math.min(average / 128, 1)

        setState(prev => ({ ...prev, audioLevel: normalizedLevel }))

        // Check for audio activity (threshold of 0.01 for sensitivity)
        if (normalizedLevel > 0.01) {
          lastAudioTimeRef.current = Date.now()
        }

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel)
      }

      checkAudioLevel()

      // Start silence detection after 2 seconds
      setTimeout(() => {
        const checkSilence = () => {
          const timeSinceLastAudio = Date.now() - lastAudioTimeRef.current
          if (timeSinceLastAudio > 3000 && state.status === 'checking') {
            setState(prev => ({ ...prev, status: 'no-audio' }))
          }
          silenceTimeoutRef.current = setTimeout(checkSilence, 1000)
        }
        checkSilence()
      }, 2000)

    } catch (error) {
      console.error('Error setting up audio monitoring:', error)
      setState(prev => ({ 
        ...prev, 
        status: 'error',
        error: 'Failed to set up audio monitoring'
      }))
    }
  }, [state.status])

  const requestMicrophoneAccess = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isRetrying: true, error: null }))

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      streamRef.current = stream
      startAudioMonitoring(stream)

      // Wait 3 seconds to detect audio
      setTimeout(() => {
        const timeSinceLastAudio = Date.now() - lastAudioTimeRef.current
        if (timeSinceLastAudio <= 3000) {
          setState(prev => ({ ...prev, status: 'ready' }))
          setTimeout(() => {
            onValidationComplete(true)
          }, 1000)
        }
      }, 3000)

    } catch (error: any) {
      console.error('Microphone access error:', error)
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setState(prev => ({ 
          ...prev, 
          status: 'denied',
          error: 'Microphone access was denied'
        }))
      } else {
        setState(prev => ({ 
          ...prev, 
          status: 'error',
          error: error.message || 'Failed to access microphone'
        }))
      }
    } finally {
      setState(prev => ({ ...prev, isRetrying: false }))
    }
  }, [startAudioMonitoring, onValidationComplete])

  const retryAudioCheck = useCallback(() => {
    cleanup()
    setState(prev => ({ 
      ...prev, 
      status: 'checking', 
      audioLevel: 0,
      error: null
    }))
    lastAudioTimeRef.current = Date.now()
    requestMicrophoneAccess()
  }, [cleanup, requestMicrophoneAccess])

  useEffect(() => {
    if (isVisible && state.status === 'checking') {
      requestMicrophoneAccess()
    }

    return cleanup
  }, [isVisible, requestMicrophoneAccess, cleanup])

  if (!isVisible) return null

  const instructions = getBrowserInstructions()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-surface-elevated border border-surface-border rounded-2xl p-8 max-w-md w-full"
        >
          {state.status === 'checking' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎤</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Checking Microphone</h3>
              <p className="text-gray-400 mb-6">Please speak into your microphone...</p>

              {/* Audio Level Indicator */}
              <div className="mb-6">
                <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ width: `${state.audioLevel * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {state.audioLevel > 0.01 ? 'Audio detected!' : 'Listening...'}
                </p>
              </div>

              {state.isRetrying && (
                <div className="flex items-center justify-center gap-2 text-blue-400">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Retrying...</span>
                </div>
              )}
            </div>
          )}

          {state.status === 'denied' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚫</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Microphone Access Required</h3>
              <p className="text-gray-400 mb-6">
                We need microphone access to conduct the interview. Please enable it to continue.
              </p>

              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-blue-400 hover:text-blue-300 text-sm mb-4 underline"
              >
                How to enable microphone access?
              </button>

              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6 text-left"
                >
                  <h4 className="font-semibold text-blue-400 mb-2">For {instructions.browser}:</h4>
                  <ol className="text-sm text-gray-300 space-y-1">
                    {instructions.steps.map((step, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-blue-400">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}

              <button
                onClick={retryAudioCheck}
                disabled={state.isRetrying}
                className="w-full bg-gradient-accent text-white py-3 px-6 rounded-xl hover:shadow-xl 
                  transition-all duration-200 font-semibold disabled:bg-gray-600"
              >
                {state.isRetrying ? 'Checking...' : 'Try Again'}
              </button>
            </div>
          )}

          {state.status === 'no-audio' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Audio Detected</h3>
              <p className="text-gray-400 mb-6">
                Your microphone is connected but we're not detecting audio. Please check your device.
              </p>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-yellow-400 mb-2">Troubleshooting:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Check if your microphone is muted</li>
                  <li>• Ensure the correct microphone is selected</li>
                  <li>• Try speaking louder or closer to the mic</li>
                  <li>• Check your system audio settings</li>
                </ul>
              </div>

              <button
                onClick={retryAudioCheck}
                disabled={state.isRetrying}
                className="w-full bg-gradient-accent text-white py-3 px-6 rounded-xl hover:shadow-xl 
                  transition-all duration-200 font-semibold disabled:bg-gray-600"
              >
                {state.isRetrying ? 'Checking...' : 'Retry Audio Check'}
              </button>
            </div>
          )}

          {state.status === 'ready' && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Mic Ready!</h3>
              <p className="text-green-400 mb-6">Your microphone is working perfectly</p>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Starting interview...</span>
              </div>
            </motion.div>
          )}

          {state.status === 'error' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">❌</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Audio Setup Error</h3>
              <p className="text-gray-400 mb-6">
                {state.error || 'There was an error setting up your microphone. Please try again.'}
              </p>

              <button
                onClick={retryAudioCheck}
                disabled={state.isRetrying}
                className="w-full bg-gradient-accent text-white py-3 px-6 rounded-xl hover:shadow-xl 
                  transition-all duration-200 font-semibold disabled:bg-gray-600"
              >
                {state.isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MicHealthCheck