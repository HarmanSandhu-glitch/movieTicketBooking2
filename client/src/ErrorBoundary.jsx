import React, { Component } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // You can also send error to logging service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
            <FaExclamationTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">
              Something went wrong!
            </h1>
            <p className="text-gray-300 mb-6">
              We're sorry, but something unexpected happened. Don't worry, your data is safe.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-primary-light hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 border border-gray-600"
              >
                Go Back
              </button>
            </div>
            {import.meta.env.DEV && (
              <details className="mt-6 text-left">
                <summary className="text-red-400 cursor-pointer hover:text-red-300">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-gray-400 overflow-auto bg-gray-900 p-2 rounded">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
