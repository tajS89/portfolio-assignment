import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useContext } from 'react';
import { AuthProvider } from '../AuthProvider';
import { AuthContext } from '../AuthContext';
import * as authStorage from '../../services/storage/authStorage';
import * as apiService from '../../services/api/auth';

vi.mock('../../services/storage/authStorage');
vi.mock('../../services/api/auth');

const TestComponent = () => {
  const context = useContext(AuthContext);
  if (!context) return <div data-testid="no-context">No context</div>;

  const handleLogin = async () => {
    try {
      await context.login('testuser', 'testpass');
    } catch {
      // Handle login errors silently for testing
    }
  };

  return (
    <div>
      <div data-testid="auth-loading">{context.isLoading ? 'Loading' : 'Ready'}</div>
      <div data-testid="auth-status">{context.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="auth-token">{context.token || 'No Token'}</div>
      <button
        data-testid="login-button"
        onClick={handleLogin}
      >
        Login
      </button>
      <button
        data-testid="logout-button"
        onClick={() => context.logout()}
      >
        Logout
      </button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authStorage.getAuthToken).mockReturnValue(null);
    vi.mocked(authStorage.setAuthToken).mockImplementation(() => {});
    vi.mocked(authStorage.removeAuthToken).mockImplementation(() => {});
    globalThis.fetch = vi.fn();
    // Suppress console errors during tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should render children correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-loading')).toBeInTheDocument();
  });

  it('should initialize with loading state when no token', async () => {
    vi.mocked(authStorage.getAuthToken).mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should show loading initially, then become not authenticated
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
  });

  it('should initialize with token from storage', async () => {
    const mockToken = 'mock-jwt-token';
    vi.mocked(authStorage.getAuthToken).mockReturnValue(mockToken);

    // Mock the fetch validation call
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-token')).toHaveTextContent(mockToken);
    });
  });

  it('should validate token on mount if present', async () => {
    const mockToken = 'mock-jwt-token';
    vi.mocked(authStorage.getAuthToken).mockReturnValue(mockToken);

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/validate'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });
  });

  it('should authenticate user after successful login', async () => {
    vi.mocked(authStorage.getAuthToken).mockReturnValue(null);
    const mockToken = 'new-mock-token';
    vi.mocked(apiService.loginRequest).mockResolvedValue({
      success: true,
      token: mockToken,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authStorage.setAuthToken).toHaveBeenCalledWith(mockToken);
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });

  it('should handle login failure', async () => {
    vi.mocked(authStorage.getAuthToken).mockReturnValue(null);
    vi.mocked(apiService.loginRequest).mockResolvedValue({
      success: false,
      message: 'Invalid credentials',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');

    // Login will throw an error, but we don't care about catching it here
    fireEvent.click(loginButton);

    // Should remain unauthenticated after failed login
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
  });

  it('should call logout and clear token', async () => {
    const mockToken = 'mock-jwt-token';
    vi.mocked(authStorage.getAuthToken).mockReturnValue(mockToken);

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-token')).toHaveTextContent(mockToken);
    });

    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(authStorage.removeAuthToken).toHaveBeenCalled();
      expect(screen.getByTestId('auth-token')).toHaveTextContent('No Token');
    });
  });

  it('should set loading to false after initialization', async () => {
    vi.mocked(authStorage.getAuthToken).mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-loading')).toHaveTextContent('Ready');
    });
  });

  it('should handle invalid token validation', async () => {
    const mockToken = 'invalid-token';
    vi.mocked(authStorage.getAuthToken).mockReturnValue(mockToken);

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authStorage.removeAuthToken).toHaveBeenCalled();
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
  });

  it('should handle network error during token validation', async () => {
    const mockToken = 'mock-jwt-token';
    vi.mocked(authStorage.getAuthToken).mockReturnValue(mockToken);

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authStorage.removeAuthToken).toHaveBeenCalled();
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
  });

  it('should persist token to storage after login', async () => {
    vi.mocked(authStorage.getAuthToken).mockReturnValue(null);
    const mockToken = 'new-mock-token';
    vi.mocked(apiService.loginRequest).mockResolvedValue({
      success: true,
      token: mockToken,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authStorage.setAuthToken).toHaveBeenCalledWith(mockToken);
    });
  });

  it('should call login with correct credentials', async () => {
    vi.mocked(authStorage.getAuthToken).mockReturnValue(null);
    vi.mocked(apiService.loginRequest).mockResolvedValue({
      success: true,
      token: 'mock-token',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(apiService.loginRequest).toHaveBeenCalledWith('testuser', 'testpass');
    });
  });
});
