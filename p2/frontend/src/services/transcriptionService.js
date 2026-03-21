import { geminiModel, safetySettings } from '../lib/gemini'

/**
 * Convert Blob to base64 string
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Get appropriate MIME type for audio blob
 */
function getAudioMimeType(blob) {
  // Check blob type first
  if (blob.type) {
    return blob.type
  }
  
  // Fallback to common audio types
  return 'audio/webm'
}

/**
 * Transcribe audio using Gemini's multimodal capability
 * @param {Blob} audioBlob - The audio blob to transcribe
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<string>} - The transcribed text
 */
export async function transcribeAudio(audioBlob, maxRetries = 3) {
  if (!audioBlob || audioBlob.size === 0) {
    throw new Error('Invalid audio blob provided')
  }

  let lastError = null
  
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
    console.warn('Gemini API key missing; skipping client-side transcription. Backend will transcribe on submit.')
    return '[Transcription temporarily unavailable: key not configured]'
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Transcription attempt ${attempt}/${maxRetries}`)
      
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob)
      const mimeType = getAudioMimeType(audioBlob)
      
      // Prepare the request
      const request = [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Audio,
          },
        },
        {
          text: "Transcribe this audio exactly as spoken. Return only the transcript text, nothing else. No labels, no formatting, no explanations. Just the spoken words.",
        },
      ]

      // Make the API call with safety settings
      const result = await geminiModel.generateContent(request, {
        safetySettings
      })
      
      const response = await result.response
      const transcript = response.text().trim()
      
      if (!transcript || transcript.length === 0) {
        throw new Error('Empty transcription received')
      }
      
      console.log(`Transcription successful on attempt ${attempt}`)
      return transcript
      
    } catch (error) {
      lastError = error
      console.error(`Transcription attempt ${attempt} failed:`, error?.message || error)
      
      // Non-retryable conditions
      if (error?.message?.includes('API key') || 
          error?.message?.includes('quota') ||
          error?.message?.includes('permission')) {
        console.error('Non-retryable error encountered:', error.message)
        break
      }
      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('Network Error')) {
        console.warn('Gemini network error detected; using fallback (backend transcription)')
        return '[Transcription temporarily unavailable: network issue]'
      }
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000 // Exponential backoff: 1s, 2s, 4s
        console.log(`Waiting ${delay}ms before retry...`)
        await sleep(delay)
      }
    }
  }
  
  // All retries failed
  return '[Transcription temporarily unavailable after retries]'

}

/**
 * Batch transcribe multiple audio blobs with error handling
 * @param {Array<{questionId: string, audioBlob: Blob}>} audioItems - Array of audio items to transcribe
 * @returns {Promise<Array<{questionId: string, transcript: string | null, error: string | null}>>}
 */
export async function batchTranscribeAudio(audioItems) {
  const results = []
  
  for (const item of audioItems) {
    try {
      console.log(`Starting transcription for question: ${item.questionId}`)
      const transcript = await transcribeAudio(item.audioBlob)
      
      results.push({
        questionId: item.questionId,
        transcript: transcript,
        error: null,
        status: 'success'
      })
      
      console.log(`Transcription completed for question: ${item.questionId}`)
      
    } catch (error) {
      console.error(`Transcription failed for question ${item.questionId}:`, error.message)
      
      results.push({
        questionId: item.questionId,
        transcript: null,
        error: error.message,
        status: 'transcription_failed'
      })
    }
    
    // Small delay between requests to avoid rate limiting
    await sleep(500)
  }
  
  return results
}

/**
 * Validate audio blob before transcription
 * @param {Blob} audioBlob - The audio blob to validate
 * @returns {boolean} - Whether the blob is valid for transcription
 */
export function validateAudioBlob(audioBlob) {
  if (!audioBlob) {
    return false
  }
  
  if (audioBlob.size === 0) {
    return false
  }
  
  // Check if it's a reasonable size (not too small, not too large)
  const minSize = 1024 // 1KB minimum
  const maxSize = 25 * 1024 * 1024 // 25MB maximum (Gemini limit)
  
  if (audioBlob.size < minSize || audioBlob.size > maxSize) {
    return false
  }
  
  return true
}

/**
 * Get transcription status summary
 * @param {Array} transcriptionResults - Results from batch transcription
 * @returns {Object} - Summary of transcription results
 */
export function getTranscriptionSummary(transcriptionResults) {
  const total = transcriptionResults.length
  const successful = transcriptionResults.filter(r => r.status === 'success').length
  const failed = transcriptionResults.filter(r => r.status === 'transcription_failed').length
  
  return {
    total,
    successful,
    failed,
    successRate: total > 0 ? (successful / total * 100).toFixed(1) : 0
  }
}