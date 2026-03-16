import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Sparkles, ArrowLeft } from 'lucide-react'

const InterviewResults = () => {
  const navigate = useNavigate()

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
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 border border-surface-border text-center">
            <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-6 professional-glow">
              <span className="text-3xl">📊</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Interview Results</h1>
            <p className="text-gray-400 mb-8 text-lg">Your interview analysis will appear here</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="glass rounded-lg p-4 border border-surface-border">
                <div className="text-3xl font-bold text-violet-400 mb-2">--</div>
                <div className="text-sm text-gray-400">Overall Score</div>
              </div>
              <div className="glass rounded-lg p-4 border border-surface-border">
                <div className="text-3xl font-bold text-blue-400 mb-2">--</div>
                <div className="text-sm text-gray-400">Questions Answered</div>
              </div>
              <div className="glass rounded-lg p-4 border border-surface-border">
                <div className="text-3xl font-bold text-green-400 mb-2">--</div>
                <div className="text-sm text-gray-400">Completion Rate</div>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-accent text-white py-3 px-8 rounded-lg hover:shadow-xl transition-all font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewResults
