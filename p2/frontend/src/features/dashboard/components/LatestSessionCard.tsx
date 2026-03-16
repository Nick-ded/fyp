import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface LatestSessionCardProps {
  session?: {
    sessionId: string
    timestamp: Date
    targetedRole: string
    averageScore: number
    totalQuestions: number
    answeredQuestions: number
    completionRate: number
  }
  className?: string
}

const LatestSessionCard: React.FC<LatestSessionCardProps> = ({ 
  session, 
  className = '' 
}) => {
  const navigate = useNavigate()

  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass rounded-2xl p-8 border border-surface-border text-center ${className}`}
      >
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎯</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Recent Sessions</h3>
        <p className="text-gray-400 mb-6">Start your first AI interview to see results here</p>
        <motion.button
          onClick={() => navigate('/live-interview')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-accent text-white py-3 px-6 rounded-xl hover:shadow-xl 
            transition-all duration-200 font-semibold professional-glow"
        >
          Start Interview
        </motion.button>
      </motion.div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30'
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30'
    return 'bg-red-500/10 border-red-500/30'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 border border-surface-border hover:border-blue-500/50 
        transition-all duration-200 cursor-pointer ${className}`}
      onClick={() => navigate(`/interview-results/${session.sessionId}`)}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Latest Interview</h3>
          <p className="text-sm text-gray-400">{formatDate(session.timestamp)}</p>
        </div>
        <div className={`px-3 py-1 rounded-full border ${getScoreBgColor(session.averageScore)}`}>
          <span className={`text-sm font-semibold ${getScoreColor(session.averageScore)}`}>
            {session.averageScore}/100
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Role:</span>
          <span className="text-sm text-white font-medium">{session.targetedRole}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Progress:</span>
          <div className="flex-1 h-2 bg-surface-elevated rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-accent transition-all duration-500"
              style={{ width: `${session.completionRate}%` }}
            />
          </div>
          <span className="text-sm text-white font-medium">
            {session.answeredQuestions}/{session.totalQuestions}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">
            {session.completionRate}% Complete
          </span>
          <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default LatestSessionCard