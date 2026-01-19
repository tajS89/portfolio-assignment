import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error message');
    }
    return <div data-testid="child-component">Child Component</div>;
};

describe('ErrorBoundary Component', () => {
    // Suppress console errors during tests
    const originalError = console.error;
    beforeEach(() => {
        console.error = vi.fn();
    });

    afterEach(() => {
        console.error = originalError;
    });

    it('should render children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div data-testid="child-component">Child Component</div>
            </ErrorBoundary>
        );

        expect(screen.getByTestId('child-component')).toBeInTheDocument();
        expect(screen.getByTestId('child-component')).toHaveTextContent('Child Component');
    });

    it('should render error UI when an error is thrown', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        // Check error boundary UI is rendered
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
        expect(screen.getByTestId('error-title')).toHaveTextContent('Something went wrong');
        expect(screen.getByTestId('error-description')).toBeInTheDocument();
        expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    });

    it('should display the error message', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByTestId('error-message-container')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent('Test error message');
    });

    it('should render Try Again and Go Home buttons', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByTestId('error-reset-button')).toBeInTheDocument();
        expect(screen.getByTestId('error-reset-button')).toHaveTextContent('Try Again');
        expect(screen.getByTestId('error-home-button')).toBeInTheDocument();
        expect(screen.getByTestId('error-home-button')).toHaveTextContent('Go Home');
    });

    it('should render Try Again button and verify it is clickable', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        // Error UI should be shown
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent('Test error message');

        // Verify reset button is present and clickable
        const resetButton = screen.getByTestId('error-reset-button');
        expect(resetButton).toBeInTheDocument();
        expect(resetButton).not.toBeDisabled();

        // Verify button can be clicked without throwing
        expect(() => fireEvent.click(resetButton)).not.toThrow();
    });

    it('should navigate to home when Go Home is clicked', () => {
        // Mock window.location.href
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: '' },
        });

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        const homeButton = screen.getByTestId('error-home-button');
        fireEvent.click(homeButton);

        expect(window.location.href).toBe('/');
    });

    it('should render custom fallback when provided', () => {
        const customFallback = (
            <div data-testid="custom-fallback">Custom Error UI</div>
        );

        render(
            <ErrorBoundary fallback={customFallback}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
        expect(screen.getByTestId('custom-fallback')).toHaveTextContent('Custom Error UI');
        expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
    });

    it('should call componentDidCatch when error occurs', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        // Verify console.error was called (componentDidCatch logs errors)
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});
