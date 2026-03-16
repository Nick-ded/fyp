import { motion } from 'framer-motion'

function LatestSessionCard({ session, onViewReport, className = '' }) {
  if (!session) {
    return (
      <div className={`glass rounded-2xl p-8 border border-surface-border text-center ${className}`}>
        <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📊</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Sessions Yet</h3>
        <p className="text-gray-400 mb-6">Complete your first interview to see results here</p>
        <button className="bg-gradient-accent text-white py-3 px-6 rounded-xl hover:shadow-xl 
          transition-all duration-200 font-semibold">
          Start Interview
        </button>
      </div>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-400 bg-green-500/20 border-green-500/30'
    if (score >= 50) return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    return 'text-red-400 bg-red-500/20 border-red-500/30'
  }

  const getScoreIcon = (score) => {
    if (score >= 75) return '🎉'
    if (score >= 50) return '👍'
    return '💪'
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const { date, time } = formatDate(session.timestamp)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 border border-surface-border hover:border-blue-500/50 
        transition-all duration-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Latest Session</h3>
          <p className="text-sm text-gray-400">{date} at {time}</p>
        </div>
        <div className="text-2xl">{getScoreIcon(session.averageScore)}</div>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-2 mb-3 ${getScoreColor(session.averageScore)}`}>
          <span className="text-2xl font-bold">{session.averageScore}</span>
        </div>
        <p className="text-sm text-gray-400">Overall Score</p>
      </div>

      {/* Session Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Targeted Role:</span>
          <span className="text-sm text-white font-medium">{session.targetedRole}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Questions:</span>
          <span className="text-sm text-white">
            <span className="text-green-400 font-medium">{session.answeredQuestions}</span>
            <span className="text-gray-500"> answered, </span>
            <span className="text-amber-400 font-medium">{session.skippedQuestions}</span>
            <span className="text-gray-500"> skipped</span>
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Time Used:</span>
          <span className="text-sm text-white font-medium">{formatTime(session.totalTimeUsed)}</span>
        </div>
      </div>

      {/* Verdict */}
      {session.overallFeedback && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-white leading-relaxed line-clamp-3">
            {session.overallFeedback}
          </p>
        </div>
      )}

      {/* Action Button */}
      <motion.button
        onClick={() => onViewReport(session)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-accent text-white py-3 px-6 rounded-xl hover:shadow-xl 
          transition-all duration-200 font-semibold flex items-center justify-center gap-2"
      >
        <span>📄</span>
        View Full Report
      </motion.button>
    </motion.div>
  )
}

export default LatestSessionCard