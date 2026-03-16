import { useState } from 'react'
import { motion } from 'framer-motion'

function SessionHistoryTable({ 
  sessions = [], 
  onViewSession, 
  onSortChange,
  pagination,
  onPageChange,
  className = '' 
}) {
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc'
    setSortBy(field)
    setSortOrder(newOrder)
    onSortChange?.(field, newOrder)
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-400'
    if (score >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  if (sessions.length === 0) {
    return (
      <div className={`glass rounded-2xl p-8 border border-surface-border text-center ${className}`}>
        <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Session History</h3>
        <p className="text-gray-400">Your completed interviews will appear here</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl border border-surface-border overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-surface-border">
        <h3 className="text-xl font-semibold text-white mb-1">Session History</h3>
        <p className="text-sm text-gray-400">
          {pagination?.totalItems || sessions.length} total sessions
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-elevated">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-300">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  Date
                  <span className="text-xs">{getSortIcon('date')}</span>
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Role</th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">
                <button
                  onClick={() => handleSort('score')}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  Score
                  <span className="text-xs">{getSortIcon('score')}</span>
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Answered</th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Skipped</th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Time Used</th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <motion.tr
                key={session.sessionId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-surface-border hover:bg-white/5 transition-colors"
              >
                <td className="p-4 text-sm text-white">
                  {formatDate(session.timestamp)}
                </td>
                <td className="p-4 text-sm text-gray-300">
                  <div className="max-w-32 truncate" title={session.targetedRole}>
                    {session.targetedRole}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-sm font-bold ${getScoreColor(session.averageScore)}`}>
                    {session.averageScore}/100
                  </span>
                </td>
                <td className="p-4 text-sm text-green-400 font-medium">
                  {session.answeredQuestions}
                </td>
                <td className="p-4 text-sm text-amber-400 font-medium">
                  {session.skippedQuestions}
                </td>
                <td className="p-4 text-sm text-gray-300">
                  {formatTime(session.totalTimeUsed)}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onViewSession(session)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium 
                      hover:underline transition-colors"
                  >
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 border-t border-surface-border flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of{' '}
            {pagination.totalItems} sessions
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-1 text-sm bg-surface-elevated border border-surface-border 
                rounded hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed
                text-gray-300 hover:text-white transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, index) => {
                const page = index + 1
                const isCurrentPage = page === pagination.currentPage
                
                // Show first page, last page, current page, and pages around current
                const showPage = page === 1 || 
                                page === pagination.totalPages || 
                                Math.abs(page - pagination.currentPage) <= 1
                
                if (!showPage) {
                  // Show ellipsis for gaps
                  if (page === 2 && pagination.currentPage > 4) {
                    return <span key={page} className="px-2 text-gray-500">...</span>
                  }
                  if (page === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 3) {
                    return <span key={page} className="px-2 text-gray-500">...</span>
                  }
                  return null
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      isCurrentPage
                        ? 'bg-blue-500 text-white'
                        : 'bg-surface-elevated border border-surface-border text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 text-sm bg-surface-elevated border border-surface-border 
                rounded hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed
                text-gray-300 hover:text-white transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default SessionHistoryTable