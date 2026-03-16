import { motion } from 'framer-motion'
import CircularScore from './CircularScore'
import RadarChart from './RadarChart'
import QuestionAccordion from './QuestionAccordion'
import SessionSummary from './SessionSummary'

function ResultsPage({ 
  overallResults, 
  answers, 
  sessionSummary, 
  performanceInsights,
  onRetryInterview,
  onGoToDashboard,
  onDownloadReport,
  className = '' 
}) {
  if (!overallResults || !answers) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No results available</p>
      </div>
    )
  }

  // Calculate radar chart data from detailed scores
  const radarData = overallResults.detailed_scores ? {
    relevance: overallResults.detailed_scores.relevance,
    clarity: overallResults.detailed_scores.clarity,
    technicalDepth: overallResults.detailed_scores.technicalDepth,
    confidence: overallResults.detailed_scores.confidence
  } : {
    relevance: 5,
    clarity: 5,
    technicalDepth: 5,
    confidence: 5
  }

  // Prepare questions data for accordion
  const questionsData = answers.map((answer, index) => ({
    question: answer.question,
    answer_text: answer.answer_text,
    analysis: answer.analysis,
    timeUsed: answer.timeUsed || 0,
    allocatedTime: 120, // Default allocation
    skipped: answer.skipped,
    transcriptionStatus: answer.transcriptionStatus,
    analysisStatus: answer.analysisStatus
  }))

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Interview Results</h1>
        <p className="text-gray-400">Comprehensive analysis of your performance</p>
      </motion.div>

      {/* Overall Score and Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Circular Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 border border-surface-border text-center"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Overall Score</h2>
          <div className="flex justify-center mb-6">
            <CircularScore score={overallResults.overall_score} size={200} />
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{overallResults.answered_questions}</div>
              <div className="text-xs text-gray-400">Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{overallResults.analysis_success_rate}%</div>
              <div className="text-xs text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{overallResults.total_questions}</div>
              <div className="text-xs text-gray-400">Total Questions</div>
            </div>
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-8 border border-surface-border text-center"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Performance Dimensions</h2>
          <div className="flex justify-center">
            <RadarChart data={radarData} size={280} />
          </div>
        </motion.div>
      </div>

      {/* Summary Highlights */}
      {sessionSummary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Top Strengths */}
          <div className="glass rounded-xl p-6 border border-surface-border">
            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span>💪</span>
              Top Strengths
            </h3>
            <div className="space-y-3">
              {sessionSummary.topStrengths.slice(0, 3).map((strength, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-500/20 border border-green-500/30 rounded-full 
                    flex items-center justify-center text-green-400 font-bold text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-300">{strength}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Improvements */}
          <div className="glass rounded-xl p-6 border border-surface-border">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>🎯</span>
              Critical Improvements
            </h3>
            <div className="space-y-3">
              {sessionSummary.criticalImprovements.slice(0, 3).map((improvement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-amber-500/20 border border-amber-500/30 rounded-full 
                    flex items-center justify-center text-amber-400 font-bold text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-300">{improvement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Focus */}
          <div className="glass rounded-xl p-6 border border-surface-border">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <span>🎯</span>
              Recommended Focus
            </h3>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-white leading-relaxed">
                {sessionSummary.recommendedFocus}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Per-Question Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Question-by-Question Analysis</h2>
        <QuestionAccordion questions={questionsData} />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex flex-col sm:flex-row gap-4 pt-8"
      >
        <motion.button
          onClick={onRetryInterview}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-gradient-accent text-white py-4 px-6 rounded-xl hover:shadow-xl 
            transition-all duration-200 font-semibold professional-glow flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          Retry Interview
        </motion.button>
        
        <motion.button
          onClick={onGoToDashboard}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 glass glass-hover text-white py-4 px-6 rounded-xl 
            transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          <span>📊</span>
          Go to Dashboard
        </motion.button>
        
        <motion.button
          onClick={onDownloadReport}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-xl 
            transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          <span>📄</span>
          Download PDF Report
        </motion.button>
      </motion.div>

      {/* Additional Session Summary (if needed for more details) */}
      {sessionSummary && performanceInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="border-t border-surface-border pt-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Detailed Coaching Summary</h2>
          <SessionSummary 
            sessionSummary={sessionSummary}
            performanceInsights={performanceInsights}
          />
        </motion.div>
      )}
    </div>
  )
}

export default ResultsPage