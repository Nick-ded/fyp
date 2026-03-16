import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Sparkles } from 'lucide-react'

const LiveInterview = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    resume: null,
    jobDescription: '',
    targetedRole: 'Software Developer',
    yearsOfExperience: 3,
    numQuestions: 5
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.resume || !formData.jobDescription.trim()) {
      alert('Please upload a resume and provide a job description')
      return
    }
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      navigate('/interview-results')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-purple-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Intrex</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 border border-surface-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center professional-glow">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">AI Interview Setup</h1>
                <p className="text-sm text-gray-400">Upload your resume and get personalized questions</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📄 Upload Resume (PDF, DOCX, or TXT)
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={(e) => setFormData(prev => ({ ...prev, resume: e.target.files?.[0] || null }))}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6
                    file:rounded-xl file:border-0 file:text-sm file:font-semibold
                    file:bg-gradient-accent file:text-white hover:file:shadow-xl
                    file:transition-all file:cursor-pointer
                    bg-surface-elevated border-2 border-surface-border rounded-xl p-3
                    hover:border-blue-500/50 transition-colors cursor-pointer"
                  required
                />
                {formData.resume && (
                  <p className="text-sm text-green-400 mt-2">✓ {formData.resume.name}</p>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  💼 Job Description
                </label>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 bg-surface-elevated border-2 border-surface-border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-white placeholder-gray-500 transition-all resize-none"
                  placeholder="Paste the job description here..."
                  required
                />
              </div>

              {/* Role and Experience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🎯 Targeted Role
                  </label>
                  <input
                    type="text"
                    value={formData.targetedRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetedRole: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-elevated border-2 border-surface-border rounded-xl 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-white placeholder-gray-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    📅 Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-surface-elevated border-2 border-surface-border rounded-xl 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-white placeholder-gray-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🎯 Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[3, 5, 7, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, numQuestions: num }))}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        formData.numQuestions === num
                          ? 'bg-gradient-accent text-white professional-glow'
                          : 'glass glass-hover text-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-accent text-white py-4 px-6 rounded-xl hover:shadow-xl 
                  transition-all duration-200 font-semibold text-lg disabled:bg-gray-600 
                  disabled:cursor-not-allowed professional-glow flex items-center justify-center gap-3"
              >
                {isLoading ? (
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
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveInterview
