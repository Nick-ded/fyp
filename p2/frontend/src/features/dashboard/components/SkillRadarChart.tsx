import React from 'react'
import { motion } from 'framer-motion'

interface SkillData {
  relevance: number
  clarity: number
  technicalDepth: number
  confidence: number
}

interface SkillRadarChartProps {
  data: SkillData
  size?: number
  className?: string
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ 
  data, 
  size = 200, 
  className = '' 
}) => {
  const center = size / 2
  const maxRadius = (size - 40) / 2
  const levels = 5
  
  const skills = [
    { key: 'relevance', label: 'Relevance', value: data.relevance, color: '#3B82F6' },
    { key: 'clarity', label: 'Clarity', value: data.clarity, color: '#10B981' },
    { key: 'technicalDepth', label: 'Technical', value: data.technicalDepth, color: '#F59E0B' },
    { key: 'confidence', label: 'Confidence', value: data.confidence, color: '#8B5CF6' }
  ]

  // Calculate points for each skill
  const skillPoints = skills.map((skill, index) => {
    const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2
    const radius = (skill.value / 10) * maxRadius
    const x = center + Math.cos(angle) * radius
    const y = center + Math.sin(angle) * radius
    const labelX = center + Math.cos(angle) * (maxRadius + 25)
    const labelY = center + Math.sin(angle) * (maxRadius + 25)
    
    return {
      ...skill,
      x,
      y,
      labelX,
      labelY,
      angle
    }
  })

  // Create path for the skill polygon
  const skillPath = skillPoints.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L'
    return `${path} ${command} ${point.x} ${point.y}`
  }, '') + ' Z'

  // Create grid lines
  const gridLines = []
  for (let i = 0; i < skills.length; i++) {
    const angle = (i * 2 * Math.PI) / skills.length - Math.PI / 2
    const x = center + Math.cos(angle) * maxRadius
    const y = center + Math.sin(angle) * maxRadius
    gridLines.push({ x, y })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass rounded-2xl p-6 border border-surface-border ${className}`}
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Skill Breakdown</h3>
        <p className="text-sm text-gray-400">Performance across key dimensions</p>
      </div>

      <div className="flex justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background circles */}
          {Array.from({ length: levels }, (_, i) => {
            const radius = ((i + 1) / levels) * maxRadius
            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
              />
            )
          })}

          {/* Grid lines */}
          {gridLines.map((point, index) => (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Skill area */}
          <path
            d={skillPath}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Skill points */}
          {skillPoints.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={point.color}
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
                <title>{`${point.label}: ${point.value}/10`}</title>
              </circle>
            </g>
          ))}

          {/* Labels */}
          {skillPoints.map((point, index) => (
            <g key={index}>
              <text
                x={point.labelX}
                y={point.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-gray-300 font-medium"
              >
                {point.label}
              </text>
              <text
                x={point.labelX}
                y={point.labelY + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-gray-400"
              >
                {point.value}/10
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: skill.color }}
            />
            <span className="text-xs text-gray-300">{skill.label}</span>
            <span className="text-xs text-white font-semibold ml-auto">
              {skill.value}/10
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default SkillRadarChart