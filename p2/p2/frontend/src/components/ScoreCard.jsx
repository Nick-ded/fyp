import React from 'react'

function ScoreCard({ score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
      <h2 className="text-xl font-semibold mb-4">Confidence Score</h2>
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(score)} bg-white rounded-full w-32 h-32 flex items-center justify-center`}>
            {score}
          </div>
          <p className="mt-4 text-lg font-medium">{getScoreLabel(score)}</p>
        </div>
      </div>
    </div>
  )
}

export default ScoreCard
