import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { startAIInterview, submitAnswer, completeInterview } from '../api/api'

function AIInterview() {
  const [step, setStep] = useState('upload') // upload, interview, results
  const [sessionId, setSessionId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [overallResults, setOverallResults] = useState(null)
  
  // Form state
  const [resume, setResume] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [numQuestions, setNumQuestions] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Recording refs
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  
  const navigate = useNavigate()

  const handleStartInterview = async (e) => {
    e.preventDefault()
    
    if (!resume || !jobDescription.trim()) {
      alert('Please upload a resume and provide a job description')
      return
    }
    
    setIsGenerating(true)
    
    try {
      const response = await startAIInterview(resume, jobDescription, numQuestions)
      
      if (response.success) {
        setSessionId(response.session_id)
        setQuestions(response.questions)
        setStep('interview')
      }
    } catch (error) {
      console.error('Error starting interview:', error)
      alert(error.response?.data?.detail || 'Failed to start interview')
    } finally {
      setIsGenerating(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      audioChunksRef.current = []
      mediaRecorderRef.current = new MediaRecorder(stream)
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
      startTimeRef.current = Date.now()
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    setIsRecording(false)
  }

  const handleSubmitAnswer = async () => {
    if (audioChunksRef.current.length === 0) {
      alert('Please record an answer first')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      
      const response = await submitAnswer(
        sessionId,
        currentQuestionIndex,
        audioBlob,
        null,
        recordingDuration
      )
      
      if (response.success) {
        const newAnswer = {
          question: questions[currentQuestionIndex].question,
          answer_text: response.answer_text,
          analysis: response.analysis
        }
        
        setAnswers([...answers, newAnswer])
        
        // Move to next question or finish
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setRecordingDuration(0)
          audioChunksRef.current = []
        } else {
          // Complete interview
          await handleCompleteInterview()
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert(error.response?.data?.detail || 'Failed to submit answer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompleteInterview = async () => {
    try {
      const response = await completeInterview(sessionId)
      
      if (response.success) {
        setOverallResults(response.overall_results)
        setAnswers(response.detailed_answers)
        setStep('results')
      }
    } catch (error) {
      console.error('Error completing interview:', error)
      alert('Failed to complete interview')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  return (
    <div className="glass rounded-2xl p-8 border border-surface-border">
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center professional-glow">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">AI Interview Setup</h3>
                <p className="text-sm text-gray-400">Upload your resume and get personalized questions</p>
              </div>
            </div>

            <form onSubmit={handleStartInterview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📄 Upload Resume (PDF, DOCX, or TXT)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6
                      file:rounded-xl file:border-0 file:text-sm file:font-semibold
                      file:bg-gradient-accent file:text-white hover:file:shadow-xl
                      file:transition-all file:cursor-pointer
                      bg-surface-elevated border-2 border-surface-border rounded-xl p-3
                      hover:border-blue-500/50 transition-colors cursor-pointer"
                    required
                  />
                  {resume && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-3 flex items-center gap-2 text-sm text-green-400 bg-green-500/10 
                        border border-green-500/30 rounded-lg p-3"
                    >
                      <span>✓</span>
                      <span className="font-medium">{resume.name}</span>
                      <span className="text-gray-500">({(resume.size / 1024).toFixed(1)} KB)</span>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  💼 Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-surface-elevated border-2 border-surface-border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-white placeholder-gray-500 transition-all resize-none"
                  placeholder="Paste the job description here... Include key requirements, responsibilities, and qualifications."
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  {jobDescription.length} characters • More detail = Better questions
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🎯 Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[3, 5, 7, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNumQuestions(num)}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        numQuestions === num
                          ? 'bg-gradient-accent text-white professional-glow'
                          : 'glass glass-hover text-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              
              <motion.button
                type="submit"
                disabled={isGenerating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-accent text-white py-4 px-6 rounded-xl hover:shadow-xl 
                  transition-all duration-200 font-semibold text-lg disabled:bg-gray-600 
                  disabled:cursor-not-allowed professional-glow flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Start AI Interview
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
        
        {step === 'interview' && questions.length > 0 && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Interview Progress</span>
                <span className="text-sm font-semibold text-white">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
              <div className="h-2 bg-surface-elevated rounded-full overflow-hidden border border-surface-border">
                <motion.div
                  className="h-full bg-gradient-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 border-2 border-blue-500/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center 
                  flex-shrink-0 professional-glow">
                  <span className="text-white font-bold">Q{currentQuestionIndex + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                      {questions[currentQuestionIndex].type}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-white leading-relaxed">
                    {questions[currentQuestionIndex].question}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Recording Section */}
            <div className="glass rounded-2xl p-8 text-center border border-surface-border">
              {!isRecording && audioChunksRef.current.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🎤</span>
                  </div>
                  <p className="text-gray-400 mb-6">Click the button below to record your answer</p>
                  <motion.button
                    onClick={startRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500/20 border-2 border-red-500/30 text-red-400 py-4 px-10 rounded-full 
                      hover:bg-red-500/30 transition-all duration-200 font-semibold text-lg"
                  >
                    Start Recording
                  </motion.button>
                </motion.div>
              )}
              
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-4 h-4 bg-red-500 rounded-full"
                    ></motion.div>
                    <p className="text-4xl font-mono font-bold text-white">{formatTime(recordingDuration)}</p>
                  </div>
                  <p className="text-gray-400 mb-6">Recording in progress...</p>
                  <motion.button
                    onClick={stopRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass glass-hover text-white py-4 px-10 rounded-full 
                      transition-all duration-200 font-semibold text-lg"
                  >
                    ⏹ Stop Recording
                  </motion.button>
                </motion.div>
              )}
              
              {!isRecording && audioChunksRef.current.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">✓</span>
                  </div>
                  <p className="text-green-400 mb-2 text-lg font-semibold">Answer Recorded!</p>
                  <p className="text-gray-400 mb-6">Duration: {formatTime(recordingDuration)}</p>
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      onClick={handleSubmitAnswer}
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-accent text-white py-4 px-10 rounded-xl hover:shadow-xl 
                        transition-all duration-200 font-semibold text-lg disabled:bg-gray-600 
                        professional-glow flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Submit Answer
                          <span>→</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        audioChunksRef.current = []
                        setRecordingDuration(0)
                      }}
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass glass-hover text-gray-300 py-4 px-10 rounded-xl 
                        transition-all duration-200 font-semibold text-lg disabled:opacity-50"
                    >
                      Re-record
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
            
            {answers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center gap-3"
              >
                <span className="text-2xl">✓</span>
                <div>
                  <p className="text-sm font-medium text-green-400">
                    {answers.length} answer(s) submitted
                  </p>
                  <p className="text-xs text-gray-500">
                    {questions.length - answers.length} remaining
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {step === 'results' && overallResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl"
            >
              <div className="text-center mb-6">
                <span className="text-6xl mb-4 block">🎉</span>
                <h3 className="text-3xl font-bold mb-2">Interview Complete!</h3>
                <p className="text-blue-100">Here's how you performed</p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-5xl font-bold mb-2">{overallResults.overall_score}</p>
                  <p className="text-sm opacity-90">Overall Score</p>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-5xl font-bold mb-2">{overallResults.technical_score}</p>
                  <p className="text-sm opacity-90">Technical</p>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-5xl font-bold mb-2">{overallResults.behavioral_score}</p>
                  <p className="text-sm opacity-90">Behavioral</p>
                </div>
              </div>
            </motion.div>
            
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                <span>📝</span>
                Detailed Feedback
              </h4>
              {answers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-6 border border-surface-border hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white mb-3">{answer.question}</p>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{answer.answer}</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                          answer.score >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          answer.score >= 60 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          Score: {answer.score}/100
                        </span>
                        <p className="text-sm text-gray-400 flex-1">{answer.feedback}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex gap-4 pt-4">
              <motion.button
                onClick={() => {
                  setStep('upload')
                  setSessionId(null)
                  setQuestions([])
                  setCurrentQuestionIndex(0)
                  setAnswers([])
                  setOverallResults(null)
                  setResume(null)
                  setJobDescription('')
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-accent text-white py-4 px-6 rounded-xl hover:shadow-xl 
                  transition-all duration-200 font-semibold professional-glow"
              >
                Start New Interview
              </motion.button>
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 glass glass-hover text-white py-4 px-6 rounded-xl 
                  transition-all duration-200 font-semibold"
              >
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AIInterview
