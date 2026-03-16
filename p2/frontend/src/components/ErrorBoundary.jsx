import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-red-400 mb-2">Oops! Something went wrong</h1>
              <p className="text-gray-300 mb-4">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                  Error details
                </summary>
                <pre className="mt-2 text-xs bg-slate-900 p-2 rounded overflow-auto text-red-300">
                  {this.state.error?.toString()}
                </pre>
              </details>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
