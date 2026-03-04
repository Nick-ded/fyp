import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
      throw new Error('Network error. Please check your connection.')
    }

    // Handle 401 Unauthorized - token expired
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      localStorage.removeItem('token')
      window.location.href = '/login'
      throw new Error('Session expired. Please login again.')
    }

    // Handle 403 Forbidden
    if (error.response.status === 403) {
      throw new Error('Access denied. You do not have permission.')
    }

    // Handle 404 Not Found
    if (error.response.status === 404) {
      throw new Error('Resource not found.')
    }

    // Handle 413 Payload Too Large
    if (error.response.status === 413) {
      throw new Error('File too large. Please upload a smaller file.')
    }

    // Handle 500 Server Error
    if (error.response.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }

    // Return specific error message from backend
    const errorMessage = error.response?.data?.detail || error.message
    throw new Error(errorMessage)
  }
)

// Retry logic wrapper
const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1
      const isRetryableError = 
        !error.response || 
        error.response.status >= 500 || 
        error.code === 'ECONNABORTED'

      if (isLastAttempt || !isRetryableError) {
        throw error
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, i)
      console.log(`Retry attempt ${i + 1}/${maxRetries} after ${waitTime}ms`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
}

// File validation utilities
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [],
    allowedExtensions = []
  } = options

  const errors = []

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`)
  }

  // Check MIME type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`)
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop().toLowerCase()
    if (!allowedExtensions.includes(extension)) {
      errors.push(`File extension .${extension} is not allowed`)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Upload video with retry logic
export const uploadVideo = async (file, onProgress) => {
  // Validate file
  const validation = validateFile(file, {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
  })

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '))
  }

  const formData = new FormData()
  formData.append('file', file)
  
  return retryRequest(async () => {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        if (onProgress) onProgress(percentCompleted)
      },
    })
    return response.data
  })
}

// Upload resume with validation and progress tracking
export const uploadResume = async (file, onProgress) => {
  // Validate file
  const validation = validateFile(file, {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    allowedExtensions: ['pdf', 'doc', 'docx', 'txt']
  })

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '))
  }

  const formData = new FormData()
  formData.append('file', file)
  
  return retryRequest(async () => {
    const response = await api.post('/auth/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          if (onProgress) onProgress(percentCompleted)
        }
      },
    })
    return response.data
  })
}

export const getResults = async (id) => {
  return retryRequest(async () => {
    const response = await api.get(`/results/${id}`)
    return response.data
  })
}

export const getHistory = async (limit = 10) => {
  return retryRequest(async () => {
    const response = await api.get(`/history?limit=${limit}`)
    return response.data
  })
}

export const deleteInterview = async (id) => {
  const response = await api.delete(`/results/${id}`)
  return response.data
}

// Authentication APIs
export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData)
  return response.data
}

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const googleLogin = async (token) => {
  const response = await api.post('/auth/google-login', { token })
  return response.data
}

export const getCurrentUser = async () => {
  return retryRequest(async () => {
    const response = await api.get('/auth/me')
    return response.data
  })
}

export default api
