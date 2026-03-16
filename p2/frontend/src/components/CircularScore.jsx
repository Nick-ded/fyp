import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function CircularScore({ score, size = 200, strokeWidth = 8, className = '' }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981' // green-500
    if (score >= 70) return '#3b82f6' // blue-500
    if (score >= 55) return '#f59e0b' // amber-500
    if (score >= 40) return '#f97316' // orange-500
    return '#ef4444' // red-500
  }

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 55) return 'Fair'
    if (score >= 40) return 'Needs Work'
    return 'Poor'
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 500)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <div 
            className="text-4xl font-bold mb-1"
            style={{ color: getScoreColor(score) }}
          >
            {Math.round(animatedScore)}
          </div>
          <div className="text-sm text-gray-400">
            {getScoreLabel(score)}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CircularScore