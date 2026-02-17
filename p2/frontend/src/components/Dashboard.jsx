import React from 'react'
import ScoreCard from './ScoreCard'
import Charts from './Charts'

function Dashboard({ data }) {
  return (
    <div className="space-y-6">
      {/* Score Card */}
      <ScoreCard score={data.confidence_score} />

      {/* Charts */}
      <Charts 
        facialMetrics={data.facial_metrics}
        speechMetrics={data.speech_metrics}
      />

      {/* Feedback Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {data.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {data.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transcript Section */}
      {data.speech_metrics.transcript && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Transcript</h3>
          <div className="bg-gray-50 rounded p-4 max-h-64 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">
              {data.speech_metrics.transcript}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
