import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function QuestionAccordion({ questions, className = '' }) {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score, max = 10) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'text-green-400'
    if (percentage >= 60) return 'text-yellow-400'
    if (percentage >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getOverallScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30'
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    if (score >= 40) return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
    return 'text-red-400 bg-red-500/20 border-red-500/30'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {questions.map((question, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass rounded-xl border border-surface-border overflow-hidden"
        >
          {/* Question Header */}
          <button
            onClick={() => toggleExpanded(index)}
            className="w-full p-6 text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0 professional-glow">
                <span className="text-white font-bold text-sm">Q{index + 1}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white mb-2 line-clamp-2">
                  {question.question}
                </p>
                
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Overall Score */}
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                    question.skipped 
                      ? 'text-amber-400 bg-amber-500/20 border-amber-500/30'
                      : getOverallScoreColor(question.analysis?.scores?.overall || 0)
                  }`}>
                    {question.skipped ? 'Skipped' : `${question.analysis?.scores?.overall || 0}/100`}
                  </span>
                  
                  {/* Time Used */}
                  <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                    {formatTime(question.timeUsed || 0)} / {formatTime(question.allocatedTime || 120)}
                  </span>
                  
                  {/* Status Badges */}
                  {question.transcriptionStatus && (
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      question.transcriptionStatus === 'success' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {question.transcriptionStatus === 'success' ? '✓ Transcribed' : '⚠️ Failed'}
                    </span>
                  )}
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400"
              >
                ↓
              </motion.div>
            </div>
          </button>

          {/* Expanded Content */}
          <AnimatePresence>
            {expandedIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-surface-border"
              >
                <div className="p-6 space-y-6">
                  {question.skipped ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⏭️</span>
                      </div>
                      <p className="text-amber-400 font-medium">Question was skipped</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Time used: {formatTime(question.timeUsed || 0)}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Full Transcript */}
                      {question.answer_text && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-3">Your Answer</h4>
                          <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
                            <p className="text-white leading-relaxed text-sm">
                              "{question.answer_text}"
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Score Breakdown */}
                      {question.analysis?.scores && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-3">Score Breakdown</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-surface-elevated border border-surface-border rounded-lg p-3 text-center">
                              <div className={`text-xl font-bold ${getScoreColor(question.analysis.scores.relevance)}`}>
                                {question.analysis.scores.relevance}/10
                              </div>
                              <div className="text-xs text-gray-400 mt-1">Relevance</div>
                            </div>
                            <div className="bg-surface-elevated border border-surface-border rounded-lg p-3 text-center">
                              <div className={`text-xl font-bold ${getScoreColor(question.analysis.scores.clarity)}`}>
                                {question.analysis.scores.clarity}/10
                              </div>
                              <div className="text-xs text-gray-400 mt-1">Clarity</div>
                            </div>
                            <div className="bg-surface-elevated border border-surface-border rounded-lg p-3 text-center">
                              <div className={`text-xl font-bold ${getScoreColor(question.analysis.scores.technicalDepth)}`}>
                                {question.analysis.scores.technicalDepth}/10
                              </div>
                              <div className="text-xs text-gray-400 mt-1">Technical Depth</div>
                            </div>
                            <div className="bg-surface-elevated border border-surface-border rounded-lg p-3 text-center">
                              <div className={`text-xl font-bold ${getScoreColor(question.analysis.scores.confidence)}`}>
                                {question.analysis.scores.confidence}/10
                              </div>
                              <div className="text-xs text-gray-400 mt-1">Confidence</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Verdict */}
                      {question.analysis?.verdict && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-3">Assessment</h4>
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <p className="text-white text-sm leading-relaxed">
                              {question.analysis.verdict}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Strengths and Improvements */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        {question.analysis?.strengths && question.analysis.strengths.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                              <span>✓</span>
                              Strengths
                            </h4>
                            <ul className="space-y-2">
                              {question.analysis.strengths.map((strength, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                  <span className="text-green-400 mt-1 text-xs">•</span>
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Improvements */}
                        {question.analysis?.improvements && question.analysis.improvements.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                              <span>💡</span>
                              Improvements
                            </h4>
                            <ul className="space-y-2">
                              {question.analysis.improvements.map((improvement, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                  <span className="text-amber-400 mt-1 text-xs">•</span>
                                  <span>{improvement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

export default QuestionAccordion