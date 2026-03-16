import { motion } from 'framer-motion'

function AnalysisDisplay({ analysis, className = '' }) {
  if (!analysis) return null

  const getScoreColor = (score, max = 10) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30'
    if (percentage >= 60) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    if (percentage >= 40) return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
    return 'text-red-400 bg-red-500/20 border-red-500/30'
  }

  const getOverallScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  if (analysis.status === 'analysis_failed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-red-500/10 border border-red-500/30 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <span>⚠️</span>
          <span className="font-semibold">Analysis Failed</span>
        </div>
        <p className="text-sm text-gray-400">{analysis.error || 'Unable to analyze this response'}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-lg p-6 border border-surface-border ${className}`}
    >
      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-2 ${getOverallScoreColor(analysis.scores.overall)}`}>
          {analysis.scores.overall}/100
        </div>
        <p className="text-gray-400 text-sm">Overall Score</p>
      </div>

      {/* Individual Scores */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-3 rounded-lg border text-center ${getScoreColor(analysis.scores.relevance)}`}>
          <div className="text-2xl font-bold">{analysis.scores.relevance}/10</div>
          <div className="text-xs opacity-80">Relevance</div>
        </div>
        <div className={`p-3 rounded-lg border text-center ${getScoreColor(analysis.scores.clarity)}`}>
          <div className="text-2xl font-bold">{analysis.scores.clarity}/10</div>
          <div className="text-xs opacity-80">Clarity</div>
        </div>
        <div className={`p-3 rounded-lg border text-center ${getScoreColor(analysis.scores.technicalDepth)}`}>
          <div className="text-2xl font-bold">{analysis.scores.technicalDepth}/10</div>
          <div className="text-xs opacity-80">Technical Depth</div>
        </div>
        <div className={`p-3 rounded-lg border text-center ${getScoreColor(analysis.scores.confidence)}`}>
          <div className="text-2xl font-bold">{analysis.scores.confidence}/10</div>
          <div className="text-xs opacity-80">Confidence</div>
        </div>
      </div>

      {/* Verdict */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Assessment</h4>
        <p className="text-white bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm">
          {analysis.verdict}
        </p>
      </div>

      {/* Strengths */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
            <span>✓</span>
            Strengths
          </h4>
          <ul className="space-y-1">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {analysis.improvements && analysis.improvements.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
            <span>💡</span>
            Areas for Improvement
          </h4>
          <ul className="space-y-1">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

export default AnalysisDisplay