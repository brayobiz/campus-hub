import React from "react";

interface State {
  hasError: boolean;
  error?: Error | null;
  info?: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console (visible in Vite terminal and browser console)
    // Keep this minimal and synchronous to avoid further errors
    // eslint-disable-next-line no-console
    console.error("Unhandled render error:", error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
          <div className="max-w-xl text-center">
            <h1 className="text-2xl font-black text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-sm text-gray-700 mb-4">An unexpected error occurred while rendering the app.</p>
            <details className="text-left text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">
              {this.state.error?.message}
              {this.state.info?.componentStack}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
