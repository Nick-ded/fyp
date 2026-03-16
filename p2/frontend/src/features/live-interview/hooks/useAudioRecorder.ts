import { useState, useRef, useCallback, useEffect } from 'react'

interface AudioRecorderState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioLevel: number
  waveformData: number[]
  silenceDetected: boolean
  error: string | null
}

interface AudioRecorderConfig {
  onRecordingComplete?: (blob: Blob, duration: number) => void
  onSilenceDetected?: () => void
  silenceThreshold?: number
  silenceTimeout?: number
}

// Browser-specific MIME type detection
function getSupportedMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/wav'
  ]
  
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type
    }
  }
  
  // Fallback for older browsers
  return 'audio/webm'
}

export function useAudioRecorder(config: AudioRecorderConfig = {}) {
  const {
    onRecordingComplete,
    onSilenceDetected,
    silenceThreshold = 0.01,
    silenceTimeout = 5000
  } = config

  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0,
    waveformData: new Array(20).fill(0),
    silenceDetected: false,
    error: null
  })

  // Refs for cleanup
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastAudioTimeRef = useRef<number>(Date.now())

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
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
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }
  }, [])

  // Audio monitoring setup
  const setupAudioMonitoring = useCallback((stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      analyserRef.current.fftSize = 512
      analyserRef.current.smoothingTimeConstant = 0.8
      
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      const waveformArray = new Uint8Array(analyserRef.current.fftSize)
      
      const updateAudioVisualization = () => {
        if (!state.isRecording || !analyserRef.current) return
        
        analyserRef.current.getByteFrequencyData(dataArray)
        analyserRef.current.getByteTimeDomainData(waveformArray)
        
        // Calculate average volume
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
        const normalizedLevel = Math.min(average / 128, 1)
        
        // Update waveform data (sample every 25th point for visualization)
        const waveform = []
        for (let i = 0; i < 20; i++) {
          const index = Math.floor((i / 20) * waveformArray.length)
          const value = (waveformArray[index] - 128) / 128
          waveform.push(Math.abs(value))
        }
        
        setState(prev => ({
          ...prev,
          audioLevel: normalizedLevel,
          waveformData: waveform
        }))
        
        // Check for audio activity
        if (normalizedLevel > silenceThreshold) {
          lastAudioTimeRef.current = Date.now()
          setState(prev => ({ ...prev, silenceDetected: false }))
        }
        
        animationFrameRef.current = requestAnimationFrame(updateAudioVisualization)
      }
      
      updateAudioVisualization()
      
      // Start silence detection
      const checkSilence = () => {
        if (!state.isRecording) return
        
        const timeSinceLastAudio = Date.now() - lastAudioTimeRef.current
        if (timeSinceLastAudio > silenceTimeout) {
          setState(prev => ({ ...prev, silenceDetected: true }))
          onSilenceDetected?.()
        }
        
        silenceTimeoutRef.current = setTimeout(checkSilence, 1000)
      }
      
      setTimeout(checkSilence, 1000)
      
    } catch (error) {
      console.error('Error setting up audio monitoring:', error)
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to set up audio monitoring' 
      }))
    }
  }, [state.isRecording, silenceThreshold, silenceTimeout, onSilenceDetected])

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }))
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      })
      
      streamRef.current = stream
      audioChunksRef.current = []
      
      const mimeType = getSupportedMimeType()
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType })
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        const duration = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0
        onRecordingComplete?.(audioBlob, duration)
      }
      
      setupAudioMonitoring(stream)
      mediaRecorderRef.current.start(100) // Collect data every 100ms
      
      startTimeRef.current = Date.now()
      lastAudioTimeRef.current = Date.now()
      
      setState(prev => ({ ...prev, isRecording: true, isPaused: false }))
      
      // Start timer
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setState(prev => ({ ...prev, duration }))
        }
      }, 1000)
      
    } catch (error) {
      console.error('Error starting recording:', error)
      setState(prev => ({ 
        ...prev, 
        error: 'Could not start recording. Please check your microphone permissions.' 
      }))
    }
  }, [setupAudioMonitoring, onRecordingComplete])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    setState(prev => ({ 
      ...prev, 
      isRecording: false, 
      isPaused: false,
      silenceDetected: false 
    }))
    
    cleanup()
  }, [cleanup])

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setState(prev => ({ ...prev, isPaused: true }))
    }
  }, [])

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setState(prev => ({ ...prev, isPaused: false }))
    }
  }, [])

  // Reset state
  const reset = useCallback(() => {
    cleanup()
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioLevel: 0,
      waveformData: new Array(20).fill(0),
      silenceDetected: false,
      error: null
    })
    audioChunksRef.current = []
    startTimeRef.current = null
    lastAudioTimeRef.current = Date.now()
  }, [cleanup])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    reset,
    isSupported: typeof MediaRecorder !== 'undefined'
  }
}