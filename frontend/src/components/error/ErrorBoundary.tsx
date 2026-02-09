import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" data-testid="error-boundary" role="alert" aria-live="assertive">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4" data-testid="error-icon" aria-label="Error icon">
                                <svg
                                    className="h-6 w-6 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="error-title">
                                Something went wrong
                            </h2>
                            <p className="text-gray-600 mb-6" data-testid="error-description">
                                We're sorry for the inconvenience. An unexpected error has occurred.
                            </p>

                            {this.state.error && (
                                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left" data-testid="error-message-container">
                                    <p className="text-sm font-mono text-gray-700 break-words" data-testid="error-message">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={this.handleReset}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    data-testid="error-reset-button"
                                    aria-label="Try again to recover from error"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    data-testid="error-home-button"
                                    aria-label="Go to home page"
                                >
                                    Go Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
