import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { downloadHTMLReport, downloadTextReport } from '../../../utils/pdfGenerator'

// Import existing components (we'll reuse them)
import CircularScore from '../../../components/CircularScore'
import RadarChart from '../../../components/RadarChart'
import QuestionAccordion from '../../../components/QuestionAccordion'
import SessionSummary from '../../../components/SessionSummary'

interface InterviewResultsProps {
  className?: string
}

const InterviewResults: React.FC<InterviewResultsProps> = ({ className = '' }) => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get data from navigation state
  const { sessionResult, summary, insights, questionSessions } = location.state || {}

  // Redirect if no data
  React.useEffect(() => {
    if (!sessionResult) {
      navigate('/live-interview')
    }
  }, [sessionResult, navigate])

  if (!sessionResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No interview results found</p>
          <button
            onClick={() => navigate('/live-interview')}
            className="bg-gradient-accent text-white py-3 px-6 rounded-xl hover:shadow-xl transition-all"
          >
            Start New Interview
          </button>
        </div>
      </div>
    )
  }

  // Prepare data for components
  const overallResults = {
    overall_score: sessionResult.averageScore,
    technical_score: Math.round((sessionResult.questionResults.reduce((sum: number, r: any) => 
      sum + (r.scores?.technicalDepth || 0), 0) / Math.max(1, sessionResult.questionResults.length)) * 10),
    behavioral_score: Math.round((sessionResult.questionResults.reduce((sum: number, r: any) => 
      sum + (r.scores?.clarity || 0) + (r.scores?.confidence || 0), 0) / Math.max(2, sessionResult.questionResults.length * 2)) * 10),
    total_questions: sessionResult.totalQuestions,
    answered_questions: sessionResult.answeredQuestions,
    skipped_questions: sessionResult.skippedQuestions,
    analysis_success_rate: sessionResult.metadata?.analysisSuccessRate || 0,
    detailed_scores: sessionResult.questionResults.length > 0 ? {
      relevance: Math.round(sessionResult.questionResults.reduce((sum: number, r: any) => sum + (r.scores?.relevance || 0), 0) / sessionResult.questionResults.length),
      clarity: Math.round(sessionResult.questionResults.reduce((sum: number, r: any) => sum + (r.scores?.clarity || 0), 0) / sessionResult.questionResults.length),
      technicalDepth: Math.round(sessionResult.questionResults.reduce((sum: number, r: any) => sum + (r.scores?.technicalDepth || 0), 0) / sessionResult.questionResults.length),
      confidence: Math.round(sessionResult.questionResults.reduce((sum: number, r: any) => sum + (r.scores?.confidence || 0), 0) / sessionResult.questionResults.length),
      overall: sessionResult.averageScore
    } : { relevance: 0, clarity: 0, technicalDepth: 0, confidence: 0, overall: 0 }
  }

  const radarData = overallResults.detailed_scores

  // Prepare questions data for accordion
  const questionsData = questionSessions?.map((session: any, index: number) => ({
    question: session.questionText,
    answer_text: session.transcript || '[Question Skipped]',
    analysis: session.analysis || {
      scores: { relevance: 0, clarity: 0, technicalDepth: 0, confidence: 0, overall: 0 },
      strengths: [],
      improvements: session.skipped ? ['Question was skipped'] : ['No analysis available'],
      verdict: session.skipped ? 'Question was skipped by user' : 'Analysis not available'
    },
    timeUsed: session.timeUsed || 0,
    allocatedTime: session.allocatedTime || 120,
    skipped: session.skipped,
    transcriptionStatus: session.transcriptionStatus,
    analysisStatus: session.analysisStatus
  })) || []

  // Action handlers
  const handleRetryInterview = () => {
    navigate('/live-interview')
  }

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  const handleDownloadReport = () => {
    if (sessionResult) {
      const success = downloadHTMLReport(sessionResult)
      if (success) {
        alert('Report downloaded successfully!')
      } else {
        const textSuccess = downloadTextReport(sessionResult)
        if (textSuccess) {
          alert('Report downloaded as text file!')
        } else {
          alert('Failed to generate report. Please try again.')
        }
      }
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 ${className}`}>
      <div className="max-w-6xl mx-auto space-y-8">
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
        {summary && (
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
                {summary.topStrengths.slice(0, 3).map((strength: string, index: number) => (
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
                {summary.criticalImprovements.slice(0, 3).map((improvement: string, index: number) => (
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
                  {summary.recommendedFocus}
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
            onClick={handleRetryInterview}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-accent text-white py-4 px-6 rounded-xl hover:shadow-xl 
              transition-all duration-200 font-semibold professional-glow flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            Retry Interview
          </motion.button>
          
          <motion.button
            onClick={handleGoToDashboard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 glass glass-hover text-white py-4 px-6 rounded-xl 
              transition-all duration-200 font-semibold flex items-center justify-center gap-2"
          >
            <span>📊</span>
            Go to Dashboard
          </motion.button>
          
          <motion.button
            onClick={handleDownloadReport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-xl 
              transition-all duration-200 font-semibold flex items-center justify-center gap-2"
          >
            <span>📄</span>
            Download PDF Report
          </motion.button>
        </motion.div>

        {/* Detailed Session Summary */}
        {summary && insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="border-t border-surface-border pt-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Detailed Coaching Summary</h2>
            <SessionSummary 
              sessionSummary={summary}
              performanceInsights={insights}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default InterviewResults