import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, X,
  Eye, Sparkles, Zap, Shield, Clock, ChevronRight, Star,
  TrendingUp, Award, Target, BookOpen, Briefcase
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'
import { uploadResume } from '../api/api'
import LoadingState from '../components/LoadingState'

// Circular score ring
const ScoreRing = ({ score, label, color = '#6D5BFF', size = 80 }) => {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fill="white" fontSize={size * 0.22} fontWeight="bold">
          {score}
        </text>
      </svg>
      <span className="text-xs text-gray-400 text-center">{label}</span>
    </div>
  )
}

const EnhancedResumeUpload = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()

  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState(null) // holds full response
  const [error, setError] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleDrag = useCallback((e) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0])
  }, [])

  const handleFileSelect = (selectedFile) => {
    setError(null)
    setAnalysisResult(null)
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowed.includes(selectedFile.type)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file'); return
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB'); return
    }
    setFile(selectedFile)
  }

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true); setError(null); setUploadProgress(0)
    try {
      const response = await uploadResume(file, (p) => setUploadProgress(p))
      if (response && (response.success || response.message || response.filename)) {
        setAnalysisResult(response)
      } else {
        throw new Error('Unexpected response from server')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null); setError(null); setAnalysisResult(null); setUploadProgress(0)
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes'
    const k = 1024, sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const scoreColor = (s) => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444'
  const scoreLabel = (s) => s >= 75 ? 'Strong' : s >= 50 ? 'Good' : 'Needs Work'

  const features = [
    { icon: Zap, title: 'Instant Processing', description: 'AI extracts key info from your resume in seconds' },
    { icon: Shield, title: 'Secure & Private', description: 'Encrypted and processed with enterprise-grade security' },
    { icon: Sparkles, title: 'Smart Analysis', description: 'AI generates personalized interview questions' },
    { icon: Clock, title: 'Quick Setup', description: 'Get started with interview practice in under 2 minutes' },
  ]

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gray-50'}`}>
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
            <Link to="/upload" className={`inline-flex items-center mb-6 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upload Options
            </Link>
            <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Resume Analysis
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Upload your resume to get an AI-powered score and personalized interview questions
            </p>
          </motion.div>

          {/* ── RESULTS VIEW ── */}
          <AnimatePresence>
            {analysisResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Success banner */}
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-400">Resume Analysed Successfully</p>
                    <p className="text-sm text-green-300">{file?.name} · {formatFileSize(file?.size)}</p>
                  </div>
                  <button onClick={removeFile} className="ml-auto p-1 hover:bg-white/10 rounded-lg">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Score overview */}
                {analysisResult.analysis && (
                  <>
                    <div className="glass rounded-2xl p-6 border border-surface-border">
                      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" /> Overall Resume Score
                      </h2>

                      {/* Big overall score + breakdown rings */}
                      <div className="flex flex-wrap items-center justify-around gap-6">
                        {/* Overall */}
                        <div className="flex flex-col items-center gap-2">
                          <ScoreRing
                            score={analysisResult.analysis.overall}
                            label="Overall"
                            color={scoreColor(analysisResult.analysis.overall)}
                            size={100}
                          />
                          <span className={`text-sm font-semibold`} style={{ color: scoreColor(analysisResult.analysis.overall) }}>
                            {scoreLabel(analysisResult.analysis.overall)}
                          </span>
                        </div>

                        <div className="h-16 w-px bg-white/10 hidden sm:block" />

                        {/* Breakdown */}
                        {[
                          { key: 'structure', label: 'Structure', icon: BookOpen },
                          { key: 'skills', label: 'Skills', icon: Zap },
                          { key: 'experience', label: 'Experience', icon: Briefcase },
                          { key: 'keywords', label: 'Keywords', icon: Target },
                        ].map(({ key, label }) => (
                          <ScoreRing
                            key={key}
                            score={analysisResult.analysis[key] ?? 0}
                            label={label}
                            color={scoreColor(analysisResult.analysis[key] ?? 0)}
                            size={72}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Field-specific insights */}
                    {analysisResult.analysis.field_specific && (
                      <div className="grid md:grid-cols-2 gap-6">

                        {/* Matched skills */}
                        {analysisResult.analysis.field_specific.matched_skills?.length > 0 && (
                          <div className="glass rounded-xl p-5 border border-surface-border">
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <Award className="w-4 h-4 text-green-400" />
                              Matched Skills ({analysisResult.analysis.field_specific.matched_count})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.analysis.field_specific.matched_skills.map(s => (
                                <span key={s} className="px-2 py-1 bg-green-500/15 text-green-300 text-xs rounded-full border border-green-500/20">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing critical skills */}
                        {analysisResult.analysis.field_specific.missing_critical?.length > 0 && (
                          <div className="glass rounded-xl p-5 border border-surface-border">
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              Missing Critical Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.analysis.field_specific.missing_critical.map(s => (
                                <span key={s} className="px-2 py-1 bg-red-500/15 text-red-300 text-xs rounded-full border border-red-500/20">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {analysisResult.analysis.field_specific.recommendations?.length > 0 && (
                          <div className="glass rounded-xl p-5 border border-surface-border md:col-span-2">
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-violet-400" />
                              Recommendations
                            </h3>
                            <ul className="space-y-2">
                              {analysisResult.analysis.field_specific.recommendations.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                  <span className="text-violet-400 mt-0.5">→</span> {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick stats row */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Word Count', value: analysisResult.analysis.word_count ?? '—' },
                        { label: 'Has Projects', value: analysisResult.analysis.has_projects ? '✓ Yes' : '✗ No' },
                        { label: 'Certifications', value: analysisResult.analysis.has_certifications ? '✓ Yes' : '✗ No' },
                      ].map(({ label, value }) => (
                        <div key={label} className="glass rounded-xl p-4 border border-surface-border text-center">
                          <p className="text-lg font-bold text-white">{value}</p>
                          <p className="text-xs text-gray-400 mt-1">{label}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Extracted text preview */}
                {(analysisResult.resume_text || analysisResult.extracted_text) && (
                  <div className="glass rounded-xl border border-surface-border overflow-hidden">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <Eye className="w-4 h-4" /> {showPreview ? 'Hide' : 'Show'} Extracted Text
                      </span>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showPreview ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showPreview && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <pre className="px-5 pb-5 text-xs text-gray-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {analysisResult.resume_text || analysisResult.extracted_text}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/live-interview')}
                    className="flex-1 bg-gradient-accent text-white py-4 px-6 rounded-xl font-semibold professional-glow flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" /> Start AI Interview with this Resume
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={removeFile}
                    className="sm:w-48 glass glass-hover text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Upload Another
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── UPLOAD VIEW ── */}
          {!analysisResult && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload area */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="glass rounded-2xl p-8 border border-surface-border">
                  <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    📄 Upload Resume
                  </h2>

                  {!file ? (
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                      onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    >
                      <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                          <p className={`text-lg font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Drop your resume here
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>or click to browse</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT · Max 5MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* File card */}
                      <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-400" />
                          <div>
                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{file.name}</p>
                            <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button onClick={removeFile} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                          <X className="w-5 h-5 text-red-400" />
                        </button>
                      </div>

                      {/* Progress */}
                      {uploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>Analysing...</span><span>{uploadProgress}%</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-accent" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Error */}
                      {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-400">Upload Failed</p>
                            <p className="text-sm text-red-300">{error}</p>
                          </div>
                        </div>
                      )}

                      {/* Upload button */}
                      {!uploading && (
                        <motion.button
                          onClick={handleUpload}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="w-full bg-gradient-accent text-white py-4 px-6 rounded-xl font-semibold professional-glow flex items-center justify-center gap-2"
                        >
                          <Upload className="w-5 h-5" /> Analyse Resume
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="glass rounded-2xl p-8 border border-surface-border">
                  <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ✨ What You'll Get
                  </h3>
                  <div className="space-y-5">
                    {features.map(({ icon: Icon, title, description }) => (
                      <div key={title} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-surface-border">
                  <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h4>
                  <div className="space-y-3">
                    <Link to="/live-interview" className="block w-full text-center py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors font-medium">
                      Skip & Start Interview
                    </Link>
                    <Link to="/video-upload" className="block w-full text-center py-3 px-4 glass glass-hover text-white rounded-lg transition-colors font-medium">
                      Upload Video Instead
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {uploading && (
            <LoadingState isLoading={true} operation="Analysing your resume" progress={uploadProgress} variant="progress" size="lg" className="mt-8" />
          )}
        </div>
      </div>
    </div>
  )
}

export default EnhancedResumeUpload
