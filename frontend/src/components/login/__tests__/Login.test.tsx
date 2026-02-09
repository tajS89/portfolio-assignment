import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiService from '../../../services/api';
import { Login } from '../Login';
import { mockLoginResponse, mockPortfolioResponse } from '../../../__mocks__/mockData';
import App from '../../../App';
import { ThemeProvider } from '../../../context/ThemeProvider';

vi.mock('../../../services/api');

const mockLogin = vi.fn();
const mockLogout = vi.fn();
let mockIsAuthenticated = false;

vi.mock('../../../hooks/useAuth', () => ({
    useAuth: () => ({
        logout: mockLogout,
        isAuthenticated: mockIsAuthenticated,
        isLoading: false,
        token: mockIsAuthenticated ? 'mock-token' : null,
        login: mockLogin,
    }),
}));

describe('Login Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        mockIsAuthenticated = false;
        vi.spyOn(apiService, 'loginRequest').mockResolvedValue(mockLoginResponse);
        vi.spyOn(apiService, 'getDashboardData').mockResolvedValue(mockPortfolioResponse);
    });

    it('should render the header and form successfully', async () => {
        render(
            <ThemeProvider>
                <Login />
            </ThemeProvider>
        );
        await waitFor(() => {
            expect(screen.getByTestId('login')).toBeInTheDocument();
        });

        // Check Header
        expect(screen.getByTestId('login-header')).toBeInTheDocument();
        expect(screen.getByTestId('login-header-title')).toBeInTheDocument();
        expect(screen.getByTestId('login-header-name')).toBeInTheDocument();

        // // Check Form Fields
        // Verify Labels
        expect(screen.getByTestId('username-label')).toBeInTheDocument();
        expect(screen.getByTestId('password-label')).toBeInTheDocument();

        // Verify Inputs
        expect(screen.getByTestId('username-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();

        // Verify Button
        expect(screen.getByTestId('login-submit-button')).toBeInTheDocument();
        expect(screen.getByTestId('login-submit-button')).toHaveTextContent('Sign In');
    });

    it('should show validation errors if fields are not present', async () => {
        render(
            <ThemeProvider>
                <Login />
            </ThemeProvider>
        );

        const submitButton = screen.getByTestId('login-submit-button');
        fireEvent.click(submitButton);

        // Check for validation messages
        expect(await screen.findByTestId('username-error')).toHaveTextContent(/Username is required/i);
        expect(await screen.findByTestId('password-error')).toHaveTextContent(/Password is required/i);

        // Ensure login was never called
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should show error message with wrong credentials', async () => {
        // Simulate a rejected promise from the login function
        mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

        render(
            <ThemeProvider>
                <Login />
            </ThemeProvider>
        );

        const usernameInput = screen.getByTestId('username-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitButton = screen.getByTestId('login-submit-button');

        fireEvent.change(usernameInput, { target: { value: 'wrong-user' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong-pass' } });

        fireEvent.click(submitButton);

        // Check for the error message rendered from the catch block
        expect(await screen.findByTestId('login-error-message')).toHaveTextContent(/Invalid credentials/i);
    });

    it('should call login with correct credentials and render dashboard', async () => {
        // Mock login to update authentication state
        mockLogin.mockImplementation(async () => {
            mockIsAuthenticated = true;
        });

        const { rerender } = render(
            <ThemeProvider>
                <App />
            </ThemeProvider>
        );

        // Initially, Login component should be rendered
        expect(screen.getByTestId('login')).toBeInTheDocument();

        const usernameInput = screen.getByTestId('username-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitButton = screen.getByTestId('login-submit-button');

        fireEvent.change(usernameInput, { target: { value: 'demo' } });
        fireEvent.change(passwordInput, { target: { value: 'demo' } });

        fireEvent.click(submitButton);

        // Verify login was called with correct credentials
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('demo', 'demo');
        });

        // After successful login, re-render to simulate state change
        rerender(
            <ThemeProvider>
                <App />
            </ThemeProvider>
        );

        // Dashboard should now be rendered (either loading or loaded state)
        await waitFor(() => {
            expect(
                screen.queryByTestId('dashboard-loading') ||
                screen.queryByTestId('dashboard')
            ).toBeInTheDocument();
        });

        // Verify login component is no longer rendered
        expect(screen.queryByTestId('login')).not.toBeInTheDocument();
    });
});