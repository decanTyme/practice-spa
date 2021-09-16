import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught in error boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card text-center">
          <div className="card-body">
            <div className="card-title">Sorry!</div>
            <div className="card-text">Something went wrong.</div>
            <button
              to="#"
              className="btn btn-primary"
              onClick={() => window.history.go(0)}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
