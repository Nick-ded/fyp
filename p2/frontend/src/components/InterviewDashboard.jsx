import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  getSessionHistory, 
  calculateDashboardAnalytics, 
  getPaginatedSessions 
} from '../services/sessionStorage'
import LatestSessionCard from './LatestSessionCard'
import ScoreTrendChart from './ScoreTrendChart'
import RadarChart from './RadarChart'
import SessionHistoryTable from './SessionHistoryTable'

function InterviewDashboard({ className = '' }) {
  const [sessions, setSessions] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [paginatedData, setPaginatedData] = useState({ items: [], pagination: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [chartType, setChartType] = useState('line')
  
  const navigate = useNavigate()

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [currentPage, sortBy, sortOrder])

  const loadDashboardData = () => {
    const sessionHistory = getSessionHistory()
    const dashboardAnalytics = calculateDashboardAnalytics(sessionHistory)
    const paginated = getPaginatedSessions(currentPage, 10, sortBy, sortOrder)
    
    setSessions(sessionHistory)
    setAnalytics(dashboardAnalytics)
    setPaginatedData(paginated)
  }

  const handleViewReport = (session) => {
    // Navigate to results page with session data
    navigate('/results', { state: { sessionResult: session } })
  }

  const handleSortChange = (field, order) => {
    setSortBy(field)
    setSortOrder(order)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleStartNewInterview = () => {
    navigate('/interview')
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Interview Dashboard</h1>
          <p className="text-gray-400">Track your progress and improve your skills</p>
        </div>
        
        <motion.button
          onClick={handleStartNewInterview}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-accent text-white py-3 px-6 rounded-xl hover:shadow-xl 
            transition-all duration-200 font-semibold flex items-center gap-2"
        >
          <span>🚀</span>
          Start New Interview
        </motion.button>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 border border-surface-border text-center"
        >
          <div className="text-3xl font-bold text-blue-400 mb-2">{analytics.totalSessions}</div>
          <div className="text-sm text-gray-400">Total Sessions</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 border border-surface-border text-center"
        >
          <div className="text-3xl font-bold text-green-400 mb-2">{analytics.averageScore}</div>
          <div className="text-sm text-gray-400">Average Score</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 border border-surface-border text-center"
        >
          <div className="text-3xl font-bold text-purple-400 mb-2">{analytics.totalQuestionsAnswered}</div>
          <div className="text-sm text-gray-400">Questions Answered</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 border border-surface-border text-center"
        >
          <div className="text-3xl font-bold text-amber-400 mb-2">
            {Math.floor(analytics.totalTimeSpent / 60)}m
          </div>
          <div className="text-sm text-gray-400">Total Practice Time</div>
        </motion.div>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Session Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LatestSessionCard 
            session={sessions[0] || null}
            onViewReport={handleViewReport}
          />
        </motion.div>

        {/* Score Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <ScoreTrendChart
            scoreHistory={analytics.scoreHistory}
            trendDirection={analytics.trendDirection}
            improvementRate={analytics.improvementRate}
            chartType={chartType}
          />
        </motion.div>
      </div>

      {/* Skills Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6 border border-surface-border"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">Skill Analysis (Aggregate)</h3>
            <p className="text-sm text-gray-400">
              Average performance across all {analytics.totalSessions} sessions
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <RadarChart data={analytics.skillAverages} size={400} />
        </div>
        
        {/* Skill Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-surface-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {analytics.skillAverages.relevance}
            </div>
            <div className="text-xs text-gray-400">Relevance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {analytics.skillAverages.clarity}
            </div>
            <div className="text-xs text-gray-400">Clarity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {analytics.skillAverages.technicalDepth}
            </div>
            <div className="text-xs text-gray-400">Technical Depth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400 mb-1">
              {analytics.skillAverages.confidence}
            </div>
            <div className="text-xs text-gray-400">Confidence</div>
          </div>
        </div>
      </motion.div>

      {/* Session History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <SessionHistoryTable
          sessions={paginatedData.items}
          onViewSession={handleViewReport}
          onSortChange={handleSortChange}
          pagination={paginatedData.pagination}
          onPageChange={handlePageChange}
        />
      </motion.div>
    </div>
  )
}

export default InterviewDashboard