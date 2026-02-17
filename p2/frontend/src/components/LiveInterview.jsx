import React, { useState, useRef, useEffect } from 'react'

function LiveInterview() {
  const [isRecording, setIsRecording] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const videoRef = useRef(null)
  const wsRef = useRef(null)
  const streamRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Connect to WebSocket
      wsRef.current = new WebSocket('ws://localhost:8000/api/live')
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'metrics') {
          setMetrics(data.data)
        }
      }

      setIsRecording(true)
      
      // Send frames periodically
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const sendFrame = () => {
        if (!isRecording || !videoRef.current) return
        
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0)
        
        const frameData = canvas.toDataURL('image/jpeg', 0.8)
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ frame: frameData }))
        }
      }
      
      const intervalId = setInterval(sendFrame, 200)
      return () => clearInterval(intervalId)
      
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Could not access camera. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    if (wsRef.current) {
      wsRef.current.close()
    }
    setIsRecording(false)
    setMetrics(null)
  }

  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Live Interview Mode</h2>
      
      <div className="space-y-4">
        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isRecording && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <p className="text-white text-lg">Camera preview will appear here</p>
            </div>
          )}
        </div>

        {metrics && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">Eye Contact</p>
              <p className="text-2xl font-bold text-blue-600">
                {(metrics.eye_contact * 100).toFixed(0)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Stability</p>
              <p className="text-2xl font-bold text-blue-600">
                {(metrics.head_stability * 100).toFixed(0)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Smile</p>
              <p className="text-2xl font-bold text-blue-600">
                {(metrics.smile * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md
                hover:bg-green-700 transition-colors duration-200"
            >
              Start Live Interview
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md
                hover:bg-red-700 transition-colors duration-200"
            >
              Stop Recording
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500 text-center">
          Note: Live mode provides real-time facial feedback. Audio analysis requires video upload.
        </p>
      </div>
    </div>
  )
}

export default LiveInterview
