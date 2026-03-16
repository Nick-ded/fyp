import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface SessionHistoryItem {
  sessionId: string
  timestamp: Date
  targetedRole: string
  averageScore: number
  totalQuestions: number
  answeredQuestions: number
  completionRate: number
  status: 'completed' | 'incomplete' | 'failed'
}

interface SessionHistoryTableProps {
  sessions: SessionHistoryItem[]
  className?: string
}

const SessionHistoryTable: React.FC<SessionHistoryTableProps> = ({ 
  sessions = [], 
  className = '' 
}) => {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'role'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterRole, setFilterRole] = useState<string>('all')

  if (!sessions || sessions.length === 0) {
    return (
      <div className={`glass rounded-2xl p-8 border border-surface-border text-center ${className}`}>
        <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Interview History</h3>
        <p className="text-gray-400 mb-6">Your completed interviews will appear here</p>
        <motion.button
          onClick={() => navigate('/live-interview')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-accent text-white py-3 px-6 rounded-xl hover:shadow-xl 
            transition-all duration-200 font-semibold professional-glow"
        >
          Start First Interview
        </motion.button>
      </div>
    )
  }

  // Get unique roles for filter
  const uniqueRoles = [...new Set(sessions.map(s => s.targetedRole))]

  // Filter and sort sessions
  const filteredSessions = sessions
    .filter(session => filterRole === 'all' || session.targetedRole === filterRole)
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = a.timestamp.getTime() - b.timestamp.getTime()
          break
        case 'score':
          comparison = a.averageScore - b.averageScore
          break
        case 'role':
          comparison = a.targetedRole.localeCompare(b.targetedRole)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleSort = (column: 'date' | 'score' | 'role') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/10 border-green-500/30'
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
    return 'text-red-400 bg-red-500/10 border-red-500/30'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'incomplete':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const SortIcon = ({ column }: { column: 'date' | 'score' | 'role' }) => {
    if (sortBy !== column) {
      return <span className="text-gray-500">↕</span>
    }
    return <span className="text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl border border-surface-border overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-surface-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Interview History</h3>
            <p className="text-sm text-gray-400">{filteredSessions.length} sessions</p>
          </div>
          
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Filter:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-surface-elevated border border-surface-border rounded-lg px-3 py-1 
                text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border">
              <th 
                className="text-left p-4 text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  Date
                  <SortIcon column="date" />
                </div>
              </th>
              <th 
                className="text-left p-4 text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center gap-2">
                  Role
                  <SortIcon column="role" />
                </div>
              </th>
              <th 
                className="text-left p-4 text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center gap-2">
                  Score
                  <SortIcon column="score" />
                </div>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">
                Progress
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">
                Status
              </th>
              <th className="text-right p-4 text-sm font-medium text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredSessions.map((session, index) => (
                <motion.tr
                  key={session.sessionId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-surface-border hover:bg-surface-elevated/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="text-sm text-white">
                      {formatDate(session.timestamp)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-white font-medium">
                      {session.targetedRole}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full border text-xs font-semibold ${getScoreColor(session.averageScore)}`}>
                      {session.averageScore}/100
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-surface-elevated rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-accent transition-all duration-500"
                          style={{ width: `${session.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {session.answeredQuestions}/{session.totalQuestions}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusColor(session.status)}`}>
                      {session.status}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <motion.button
                      onClick={() => navigate(`/interview-results/${session.sessionId}`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      View Details
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filteredSessions.length > 5 && (
        <div className="p-4 border-t border-surface-border text-center">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            Load More Sessions
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default SessionHistoryTable