import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

function ScoreTrendChart({ 
  scoreHistory = [], 
  trendDirection = 'neutral', 
  improvementRate = 0,
  chartType = 'line',
  className = '' 
}) {
  if (scoreHistory.length === 0) {
    return (
      <div className={`glass rounded-2xl p-8 border border-surface-border text-center ${className}`}>
        <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📈</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Score Trends</h3>
        <p className="text-gray-400">Complete more interviews to see your progress</p>
      </div>
    )
  }

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'improving':
        return { icon: '↗️', color: 'text-green-400', label: 'Improving' }
      case 'declining':
        return { icon: '↘️', color: 'text-red-400', label: 'Declining' }
      default:
        return { icon: '➡️', color: 'text-gray-400', label: 'Stable' }
    }
  }

  const trend = getTrendIcon()

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`Date: ${label}`}</p>
          <p className="text-blue-400">
            {`Score: ${payload[0].value}/100`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 border border-surface-border ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Score Trends</h3>
          <p className="text-sm text-gray-400">{scoreHistory.length} sessions tracked</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-surface-border`}>
            <span className="text-lg">{trend.icon}</span>
            <span className={`text-sm font-medium ${trend.color}`}>{trend.label}</span>
          </div>
          
          {improvementRate !== 0 && (
            <div className="text-right">
              <div className={`text-sm font-bold ${improvementRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {improvementRate > 0 ? '+' : ''}{improvementRate}
              </div>
              <div className="text-xs text-gray-400">avg change</div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={scoreHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 85, 99, 0.2)" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#1E40AF' }}
              />
            </LineChart>
          ) : (
            <BarChart data={scoreHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 85, 99, 0.2)" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Type Toggle */}
      <div className="flex justify-center mt-4">
        <div className="flex bg-surface-elevated border border-surface-border rounded-lg p-1">
          <button
            onClick={() => {}} // This would be passed as a prop in real implementation
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              chartType === 'line' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => {}} // This would be passed as a prop in real implementation
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              chartType === 'bar' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-surface-border">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {Math.max(...scoreHistory.map(s => s.score))}
          </div>
          <div className="text-xs text-gray-400">Best Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">
            {Math.round(scoreHistory.reduce((sum, s) => sum + s.score, 0) / scoreHistory.length)}
          </div>
          <div className="text-xs text-gray-400">Average</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">
            {scoreHistory[scoreHistory.length - 1]?.score || 0}
          </div>
          <div className="text-xs text-gray-400">Latest</div>
        </div>
      </div>
    </motion.div>
  )
}

export default ScoreTrendChart