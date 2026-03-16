import React from 'react'

function ScoreCard({ score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
      <h2 className="text-lg font-semibold text-gray-300 mb-6">Confidence Score</h2>
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(score)} mb-4`}>
            {score}
          </div>
          <p className="text-sm text-gray-400">{getScoreLabel(score)}</p>
        </div>
      </div>
    </div>
  )
}

export default ScoreCard
