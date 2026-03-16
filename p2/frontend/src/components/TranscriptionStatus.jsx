import { motion } from 'framer-motion'

function TranscriptionStatus({ session, className = '' }) {
  if (!session) return null

  const getStatusDisplay = () => {
    switch (session.transcriptionStatus) {
      case 'success':
        return {
          icon: '✓',
          text: 'Transcribed',
          color: 'text-green-400',
          bg: 'bg-green-500/10 border-green-500/30'
        }
      case 'transcription_failed':
        return {
          icon: '⚠️',
          text: 'Transcription Failed',
          color: 'text-red-400',
          bg: 'bg-red-500/10 border-red-500/30'
        }
      case 'pending':
      default:
        return {
          icon: '⏳',
          text: 'Transcription Pending',
          color: 'text-gray-400',
          bg: 'bg-gray-500/10 border-gray-500/30'
        }
    }
  }

  const status = getStatusDisplay()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${status.bg} border rounded-lg p-3 ${className}`}
    >
      <div className={`flex items-center gap-2 text-sm ${status.color}`}>
        <span>{status.icon}</span>
        <span className="font-medium">{status.text}</span>
      </div>
      
      {session.transcript && (
        <div className="mt-2 text-xs text-gray-300 bg-black/20 rounded p-2 max-h-20 overflow-y-auto">
          <div className="font-medium mb-1">Transcript:</div>
          <div className="italic">"{session.transcript}"</div>
        </div>
      )}
    </motion.div>
  )
}

export default TranscriptionStatus