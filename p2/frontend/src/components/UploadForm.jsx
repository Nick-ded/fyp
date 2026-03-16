import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadVideo } from '../api/api'

function UploadForm() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024
      if (selectedFile.size > maxSize) {
        setError(`File size exceeds 100MB limit (${(selectedFile.size / 1024 / 1024).toFixed(2)}MB)`)
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Please select a valid video file (MP4, WebM, MOV, AVI)')
      setFile(null)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    handleFileSelect(selectedFile)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a video file')
      return
    }

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const result = await uploadVideo(file, setProgress)
      navigate(`/results/${result.id}`)
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
      setUploading(false)
      setProgress(0)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="glass rounded-2xl p-8 border border-surface-border">
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drag and Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-violet-400 ${
            dragActive
              ? 'border-accent-500 bg-accent-500/5'
              : 'border-dark-400 bg-dark-100 hover:border-accent-400'
          } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />

          <div className="space-y-3">
            <div className="text-5xl">
              {dragActive ? '📥' : '🎥'}
            </div>
            
            <div>
              <p className="text-lg font-semibold text-dark-900">
                Drag & drop your video here
              </p>
              <p className="text-sm text-dark-400 mt-1">or click to browse</p>
            </div>

            <div className="text-xs text-dark-400">
              <p>Supported: MP4, WebM, MOV, AVI</p>
              <p>Maximum size: 100MB</p>
            </div>
          </div>
        </div>

        {/* Selected File Info */}
        {file && (
          <div className="p-4 bg-accent-500/5 border border-accent-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎬</span>
                <div>
                  <p className="font-semibold text-dark-900">{file.name}</p>
                  <p className="text-sm text-dark-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              {!uploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setError(null)
                  }}
                  className="text-semantic-error hover:text-semantic-error/80 font-semibold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-semantic-error/5 border border-semantic-error/30 text-semantic-error px-4 py-3 rounded flex items-start space-x-2">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-dark-900">
                {progress < 100 ? 'Uploading...' : 'Processing video...'}
              </span>
              <span className="text-sm font-semibold text-accent-500">{progress}%</span>
            </div>
            <div className="w-full bg-dark-300 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-accent h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full w-full bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || uploading}
          className={`w-full py-3 px-4 rounded-md font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
            !file || uploading
              ? 'bg-dark-400 text-dark-200 cursor-not-allowed opacity-60'
              : 'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/30 active:scale-95'
          }`}
          aria-busy={uploading}
        >
          {uploading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing...</span>
            </span>
          ) : (
            '🚀 Analyze Interview'
          )}
        </button>
      </form>
    </div>
  )
}

export default UploadForm
