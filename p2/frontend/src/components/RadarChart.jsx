import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function RadarChart({ data, size = 300, className = '' }) {
  const [animatedData, setAnimatedData] = useState([0, 0, 0, 0])
  
  const center = size / 2
  const maxRadius = size / 2 - 40
  const levels = 5
  
  const dimensions = [
    { key: 'relevance', label: 'Relevance', angle: 0 },
    { key: 'clarity', label: 'Clarity', angle: 90 },
    { key: 'technicalDepth', label: 'Technical Depth', angle: 180 },
    { key: 'confidence', label: 'Confidence', angle: 270 }
  ]

  const getPointPosition = (value, angle) => {
    const radian = (angle - 90) * (Math.PI / 180)
    const radius = (value / 10) * maxRadius
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian)
    }
  }

  const getGridPosition = (level, angle) => {
    const radian = (angle - 90) * (Math.PI / 180)
    const radius = (level / levels) * maxRadius
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian)
    }
  }

  const getLabelPosition = (angle) => {
    const radian = (angle - 90) * (Math.PI / 180)
    const radius = maxRadius + 25
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData([
        data.relevance || 0,
        data.clarity || 0,
        data.technicalDepth || 0,
        data.confidence || 0
      ])
    }, 500)
    return () => clearTimeout(timer)
  }, [data])

  // Create path for the data polygon
  const pathData = dimensions.map((dim, index) => {
    const point = getPointPosition(animatedData[index], dim.angle)
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  }).join(' ') + ' Z'

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {[...Array(levels)].map((_, level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level + 1) / levels * maxRadius}
            fill="none"
            stroke="rgba(75, 85, 99, 0.2)"
            strokeWidth="1"
          />
        ))}
        
        {/* Grid lines */}
        {dimensions.map((dim) => {
          const endPoint = getGridPosition(levels, dim.angle)
          return (
            <line
              key={dim.key}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="rgba(75, 85, 99, 0.3)"
              strokeWidth="1"
            />
          )
        })}
        
        {/* Data area */}
        <motion.path
          d={pathData}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        
        {/* Data points */}
        {dimensions.map((dim, index) => {
          const point = getPointPosition(animatedData[index], dim.angle)
          return (
            <motion.circle
              key={dim.key}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
            />
          )
        })}
        
        {/* Labels */}
        {dimensions.map((dim, index) => {
          const labelPos = getLabelPosition(dim.angle)
          const value = animatedData[index]
          return (
            <g key={dim.key}>
              <text
                x={labelPos.x}
                y={labelPos.y - 8}
                textAnchor="middle"
                className="text-xs font-medium fill-white"
              >
                {dim.label}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 8}
                textAnchor="middle"
                className="text-xs fill-blue-400 font-bold"
              >
                {value.toFixed(1)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default RadarChart