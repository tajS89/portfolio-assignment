import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorFallback } from '../ErrorFallback';

describe('ErrorFallback Component', () => {
    it('should render error fallback UI', () => {
        render(<ErrorFallback />);

        expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
        expect(screen.getByTestId('error-title')).toHaveTextContent('Something went wrong');
        expect(screen.getByTestId('error-description')).toBeInTheDocument();
        expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    });

    it('should display error message when error prop is provided', () => {
        const testError = new Error('Custom error message');
        render(<ErrorFallback error={testError} />);

        expect(screen.getByTestId('error-message-container')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent('Custom error message');
    });

    it('should not display error message when error prop is not provided', () => {
        render(<ErrorFallback />);

        expect(screen.queryByTestId('error-message-container')).not.toBeInTheDocument();
        expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    it('should render Try Again button when resetError is provided', () => {
        const mockResetError = vi.fn();
        render(<ErrorFallback resetError={mockResetError} />);

        const resetButton = screen.getByTestId('error-reset-button');
        expect(resetButton).toBeInTheDocument();
        expect(resetButton).toHaveTextContent('Try Again');
    });

    it('should not render Try Again button when resetError is not provided', () => {
        render(<ErrorFallback />);

        expect(screen.queryByTestId('error-reset-button')).not.toBeInTheDocument();
    });

    it('should always render Go Home button', () => {
        render(<ErrorFallback />);

        const homeButton = screen.getByTestId('error-home-button');
        expect(homeButton).toBeInTheDocument();
        expect(homeButton).toHaveTextContent('Go Home');
    });

    it('should call resetError when Try Again button is clicked', () => {
        const mockResetError = vi.fn();
        render(<ErrorFallback resetError={mockResetError} />);

        const resetButton = screen.getByTestId('error-reset-button');
        fireEvent.click(resetButton);

        expect(mockResetError).toHaveBeenCalledTimes(1);
    });

    it('should navigate to home when Go Home button is clicked', () => {
        // Mock window.location.href
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: '' },
        });

        render(<ErrorFallback />);

        const homeButton = screen.getByTestId('error-home-button');
        fireEvent.click(homeButton);

        expect(window.location.href).toBe('/');
    });

    it('should render complete UI with all props', () => {
        const testError = new Error('Test error');
        const mockResetError = vi.fn();

        render(<ErrorFallback error={testError} resetError={mockResetError} />);

        // Check all elements are present
        expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
        expect(screen.getByTestId('error-icon')).toBeInTheDocument();
        expect(screen.getByTestId('error-title')).toBeInTheDocument();
        expect(screen.getByTestId('error-description')).toBeInTheDocument();
        expect(screen.getByTestId('error-message-container')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent('Test error');
        expect(screen.getByTestId('error-reset-button')).toBeInTheDocument();
        expect(screen.getByTestId('error-home-button')).toBeInTheDocument();
    });

    it('should have correct styling classes', () => {
        render(<ErrorFallback />);

        const container = screen.getByTestId('error-fallback');
        expect(container).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center');
    });
});
