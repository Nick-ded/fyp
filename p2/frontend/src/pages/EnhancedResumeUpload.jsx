import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Eye,
  Download,
  Sparkles,
  Zap,
  Shield,
  Clock
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'
import { uploadResume } from '../api/api'
import LoadingState from '../components/LoadingState'

const EnhancedResumeUpload = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (selectedFile) => {
    setError(null)
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file')
      return
    }
    
    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }
    
    setFile(selectedFile)
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    setError(null)
    setUploadProgress(0)
    
    try {
      const response = await uploadResume(file, (progress) => {
        setUploadProgress(progress)
      })
      
      if (response.success) {
        setExtractedText(response.extracted_text || '')
        setUploadComplete(true)
        
        // Auto-navigate to live interview after 3 seconds
        setTimeout(() => {
          navigate('/live-interview')
        }, 3000)
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setError(null)
    setUploadComplete(false)
    setExtractedText('')
    setUploadProgress(0)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const features = [
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Advanced AI extracts key information from your resume in seconds'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your resume data is encrypted and processed with enterprise-grade security'
    },
    {
      icon: Sparkles,
      title: 'Smart Analysis',
      description: 'AI analyzes your experience to generate personalized interview questions'
    },
    {
      icon: Clock,
      title: 'Quick Setup',
      description: 'Get started with your interview practice in under 2 minutes'
    }
  ]

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <Link 
              to="/upload" 
              className={`inline-flex items-center mb-6 transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload Options
            </Link>
            <h1 className={`text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Upload Your Resume
            </h1>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Upload your resume to get personalized interview questions tailored to your experience and skills
            </p>
          </motion.div>

          {/* Upload Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass rounded-2xl p-8 border border-surface-border">
                <h2 className={`text-2xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  📄 Resume Upload
                </h2>

                {!file ? (
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-blue-400" />
                      </div>
                      
                      <div>
                        <p className={`text-lg font-semibold mb-2 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Drop your resume here
                        </p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          or click to browse files
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Supported formats: PDF, DOC, DOCX, TXT</p>
                        <p>Maximum file size: 5MB</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* File Preview */}
                    <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-400" />
                        <div>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={removeFile}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-red-400" />
                      </button>
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            Uploading...
                          </span>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Success State */}
                    {uploadComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          <div>
                            <p className="font-medium text-green-400">Upload Complete!</p>
                            <p className="text-sm text-green-300">
                              Redirecting to live interview in 3 seconds...
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Error State */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="w-6 h-6 text-red-400" />
                          <div>
                            <p className="font-medium text-red-400">Upload Failed</p>
                            <p className="text-sm text-red-300">{error}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Upload Button */}
                    {!uploading && !uploadComplete && (
                      <motion.button
                        onClick={handleUpload}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-accent text-white py-4 px-6 rounded-xl hover:shadow-xl 
                          transition-all duration-200 font-semibold professional-glow flex items-center justify-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        Upload Resume
                      </motion.button>
                    )}

                    {/* Preview Button */}
                    {extractedText && (
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="w-full glass glass-hover text-white py-3 px-6 rounded-xl transition-all 
                          duration-200 font-medium flex items-center justify-center gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        {showPreview ? 'Hide' : 'Show'} Extracted Text
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Extracted Text Preview */}
              <AnimatePresence>
                {showPreview && extractedText && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass rounded-xl p-6 border border-surface-border"
                  >
                    <h3 className={`text-lg font-semibold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Extracted Text Preview
                    </h3>
                    <div className="max-h-64 overflow-y-auto">
                      <pre className={`text-sm whitespace-pre-wrap ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {extractedText}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass rounded-2xl p-8 border border-surface-border">
                <h3 className={`text-2xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  ✨ What Happens Next?
                </h3>
                
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {feature.title}
                        </h4>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass rounded-xl p-6 border border-surface-border">
                <h4 className={`font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Actions
                </h4>
                <div className="space-y-3">
                  <Link
                    to="/live-interview"
                    className="block w-full text-center py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 
                      text-blue-400 rounded-lg transition-colors font-medium"
                  >
                    Skip & Start Interview
                  </Link>
                  <Link
                    to="/video-upload"
                    className="block w-full text-center py-3 px-4 glass glass-hover text-white 
                      rounded-lg transition-colors font-medium"
                  >
                    Upload Video Instead
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Loading State */}
          {uploading && (
            <LoadingState
              isLoading={true}
              operation="Processing your resume"
              progress={uploadProgress}
              variant="progress"
              size="lg"
              className="mb-8"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default EnhancedResumeUpload