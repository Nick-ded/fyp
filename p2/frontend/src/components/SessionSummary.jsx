import { motion } from 'framer-motion'

function SessionSummary({ sessionSummary, performanceInsights, className = '' }) {
  if (!sessionSummary) return null

  const getReadinessColor = (readiness) => {
    switch (readiness) {
      case 'Ready':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'Nearly Ready':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default:
        return 'text-red-400 bg-red-500/20 border-red-500/30'
    }
  }

  const getPerformanceColor = (level) => {
    switch (level) {
      case 'Excellent':
        return 'text-green-400'
      case 'Good':
        return 'text-blue-400'
      case 'Fair':
        return 'text-yellow-400'
      default:
        return 'text-red-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
    >
      {/* Overall Feedback */}
      <div className="glass rounded-2xl p-6 border border-surface-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center professional-glow">
            <span className="text-2xl">🎯</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Interview Coach Summary</h3>
            <p className="text-sm text-gray-400">AI-powered feedback and recommendations</p>
          </div>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-white leading-relaxed">{sessionSummary.overallFeedback}</p>
        </div>
      </div>

      {/* Performance Insights */}
      {performanceInsights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 border border-surface-border">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Performance Level</h4>
            <div className={`text-2xl font-bold ${getPerformanceColor(performanceInsights.performanceLevel)}`}>
              {performanceInsights.performanceLevel}
            </div>
          </div>
          
          <div className="glass rounded-xl p-4 border border-surface-border">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Interview Readiness</h4>
            <div className={`px-4 py-2 rounded-lg border text-center font-semibold ${getReadinessColor(performanceInsights.readinessAssessment)}`}>
              {performanceInsights.readinessAssessment}
            </div>
          </div>
        </div>
      )}

      {/* Top Strengths */}
      <div className="glass rounded-xl p-6 border border-surface-border">
        <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <span>💪</span>
          Top Strengths
        </h4>
        <div className="space-y-3">
          {sessionSummary.topStrengths.map((strength, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded-lg p-3"
            >
              <span className="text-green-400 font-bold text-sm mt-0.5">{index + 1}</span>
              <p className="text-white text-sm flex-1">{strength}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Critical Improvements */}
      <div className="glass rounded-xl p-6 border border-surface-border">
        <h4 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
          <span>🎯</span>
          Areas for Improvement
        </h4>
        <div className="space-y-3">
          {sessionSummary.criticalImprovements.map((improvement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3"
            >
              <span className="text-amber-400 font-bold text-sm mt-0.5">{index + 1}</span>
              <p className="text-white text-sm flex-1">{improvement}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended Focus */}
      <div className="glass rounded-xl p-6 border border-surface-border">
        <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
          <span>🎯</span>
          Recommended Focus
        </h4>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-white leading-relaxed">{sessionSummary.recommendedFocus}</p>
        </div>
      </div>

      {/* Next Steps */}
      {performanceInsights?.nextSteps && (
        <div className="glass rounded-xl p-6 border border-surface-border">
          <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
            <span>📋</span>
            Next Steps
          </h4>
          <div className="space-y-2">
            {performanceInsights.nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-sm text-gray-300"
              >
                <span className="w-6 h-6 bg-purple-500/20 border border-purple-500/30 rounded-full 
                  flex items-center justify-center text-purple-400 font-bold text-xs">
                  {index + 1}
                </span>
                <span>{step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {performanceInsights && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-4 text-center border border-surface-border">
            <div className="text-2xl font-bold text-blue-400">{performanceInsights.consistencyScore}%</div>
            <div className="text-xs text-gray-400 mt-1">Consistency</div>
          </div>
          
          <div className="glass rounded-lg p-4 text-center border border-surface-border">
            <div className={`text-2xl font-bold ${
              performanceInsights.timeManagement === 'Good' ? 'text-green-400' :
              performanceInsights.timeManagement === 'Too Slow' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {performanceInsights.timeManagement}
            </div>
            <div className="text-xs text-gray-400 mt-1">Time Mgmt</div>
          </div>
          
          {performanceInsights.scoreDistribution && (
            <>
              <div className="glass rounded-lg p-4 text-center border border-surface-border">
                <div className="text-2xl font-bold text-green-400">{performanceInsights.scoreDistribution.highest}</div>
                <div className="text-xs text-gray-400 mt-1">Best Score</div>
              </div>
              
              <div className="glass rounded-lg p-4 text-center border border-surface-border">
                <div className="text-2xl font-bold text-red-400">{performanceInsights.scoreDistribution.lowest}</div>
                <div className="text-xs text-gray-400 mt-1">Lowest Score</div>
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default SessionSummary