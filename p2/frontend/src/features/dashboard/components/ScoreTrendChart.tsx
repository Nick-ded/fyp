import React from 'react'
import { motion } from 'framer-motion'

interface ScoreTrendData {
  sessionId: string
  date: Date
  score: number
  role: string
}

interface ScoreTrendChartProps {
  data: ScoreTrendData[]
  className?: string
}

const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({ 
  data = [], 
  className = '' 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`glass rounded-2xl p-8 border border-surface-border text-center ${className}`}>
        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📈</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Score Trends</h3>
        <p className="text-gray-400">Complete more interviews to see your progress</p>
      </div>
    )
  }

  // Sort data by date
  const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime())
  
  // Calculate chart dimensions
  const chartWidth = 300
  const chartHeight = 150
  const padding = 20
  
  const maxScore = 100
  const minScore = 0
  
  // Calculate points for the line chart
  const points = sortedData.map((item, index) => {
    const x = padding + (index / Math.max(1, sortedData.length - 1)) * (chartWidth - 2 * padding)
    const y = chartHeight - padding - ((item.score - minScore) / (maxScore - minScore)) * (chartHeight - 2 * padding)
    return { x, y, ...item }
  })
  
  // Create path string for the line
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L'
    return `${path} ${command} ${point.x} ${point.y}`
  }, '')
  
  // Create area path for gradient fill
  const areaPath = points.length > 0 
    ? `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : ''

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981' // green-500
    if (score >= 60) return '#F59E0B' // yellow-500
    return '#EF4444' // red-500
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const latestScore = sortedData[sortedData.length - 1]?.score || 0
  const previousScore = sortedData.length > 1 ? sortedData[sortedData.length - 2]?.score || 0 : latestScore
  const scoreDiff = latestScore - previousScore
  const isImproving = scoreDiff > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 border border-surface-border ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Score Trends</h3>
          <p className="text-sm text-gray-400">{sortedData.length} interviews</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{latestScore}</div>
          {sortedData.length > 1 && (
            <div className={`text-sm flex items-center gap-1 ${
              isImproving ? 'text-green-400' : scoreDiff < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              <span>{isImproving ? '↗' : scoreDiff < 0 ? '↘' : '→'}</span>
              <span>{Math.abs(scoreDiff)} pts</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg 
          width={chartWidth} 
          height={chartHeight} 
          className="w-full h-auto"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Grid lines */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Horizontal grid lines */}
          {[25, 50, 75].map(score => {
            const y = chartHeight - padding - ((score - minScore) / (maxScore - minScore)) * (chartHeight - 2 * padding)
            return (
              <line
                key={score}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.3"
              />
            )
          })}
          
          {/* Area fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#scoreGradient)"
            />
          )}
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={getScoreColor(point.score)}
                stroke="#1F2937"
                strokeWidth="2"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="transparent"
                className="hover:fill-blue-500/20 cursor-pointer transition-all"
              >
                <title>{`${point.role}: ${point.score}/100 on ${formatDate(point.date)}`}</title>
              </circle>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <span>{formatDate(sortedData[0].date)}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>80+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>60-79</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>&lt;60</span>
          </div>
        </div>
        <span>{formatDate(sortedData[sortedData.length - 1].date)}</span>
      </div>
    </motion.div>
  )
}

export default ScoreTrendChart