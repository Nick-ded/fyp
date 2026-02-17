import React, { useState } from 'react'
import UploadForm from '../components/UploadForm'
import LiveInterview from '../components/LiveInterview'

function Home() {
  const [activeTab, setActiveTab] = useState('upload')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Analyze Your Interview Performance
        </h2>
        <p className="text-gray-600">
          Get AI-powered feedback on your facial expressions, body language, and speech patterns
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'upload'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upload Video
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'live'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Live Interview
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' ? <UploadForm /> : <LiveInterview />}

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="text-4xl mb-3">👁️</div>
          <h3 className="font-semibold mb-2">Facial Analysis</h3>
          <p className="text-sm text-gray-600">
            Eye contact, head stability, and facial expressions
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-3">🎤</div>
          <h3 className="font-semibold mb-2">Speech Analysis</h3>
          <p className="text-sm text-gray-600">
            Speech rate, filler words, and vocal energy
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-semibold mb-2">Detailed Feedback</h3>
          <p className="text-sm text-gray-600">
            Actionable insights to improve your performance
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
