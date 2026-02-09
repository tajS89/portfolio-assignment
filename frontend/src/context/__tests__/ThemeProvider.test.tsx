import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useContext } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { ThemeContext } from '../ThemeContext';
import * as themeStorage from '../../services/storage/themeStorage';
import { THEMES, DEFAULT_THEME } from '../../constants/themes';

vi.mock('../../services/storage/themeStorage');

const TestComponent = () => {
  const context = useContext(ThemeContext);
  if (!context) return <div>No context</div>;

  return (
    <div>
      <div data-testid="current-theme">{context.currentTheme}</div>
      <div data-testid="theme-label">{context.theme.label}</div>
      <div data-testid="primary-color">{context.theme.colors.primary}</div>
      <button
        data-testid="set-theme-forest"
        onClick={() => context.setTheme('forest')}
      >
        Set Forest
      </button>
      <button
        data-testid="set-theme-ocean"
        onClick={() => context.setTheme('ocean')}
      >
        Set Ocean
      </button>
      <button
        data-testid="set-theme-royal"
        onClick={() => context.setTheme('royal')}
      >
        Set Royal
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document theme attribute
    document.documentElement.removeAttribute('data-theme');
    // Mock localStorage
    Storage.prototype.getItem = vi.fn(() => null);
    Storage.prototype.setItem = vi.fn();
    vi.mocked(themeStorage.getTheme).mockReturnValue(DEFAULT_THEME);
    vi.mocked(themeStorage.setTheme).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should render children correctly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toBeInTheDocument();
  });

  it('should provide theme context with default theme on mount', async () => {
    vi.mocked(themeStorage.getTheme).mockReturnValue('ocean');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('ocean');
      expect(screen.getByTestId('theme-label')).toHaveTextContent('Ocean Blue');
      expect(screen.getByTestId('primary-color')).toHaveTextContent('#3b82f6');
    });
  });

  it('should load theme from storage on mount', async () => {
    vi.mocked(themeStorage.getTheme).mockReturnValue('forest');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(themeStorage.getTheme).toHaveBeenCalled();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('forest');
    });
  });

  it('should set data-theme attribute on document element', async () => {
    vi.mocked(themeStorage.getTheme).mockReturnValue('royal');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('royal');
    });
  });

  it('should update theme when setTheme is called', async () => {
    vi.mocked(themeStorage.getTheme).mockReturnValue('ocean');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setForestButton = screen.getByTestId('set-theme-forest');

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('ocean');
    });

    fireEvent.click(setForestButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('forest');
      expect(screen.getByTestId('theme-label')).toHaveTextContent('Forest Green');
      expect(screen.getByTestId('primary-color')).toHaveTextContent('#10b981');
    });
  });

  it('should persist theme to storage when setTheme is called', async () => {
    vi.mocked(themeStorage.getTheme).mockReturnValue('ocean');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setRoyalButton = screen.getByTestId('set-theme-royal');

    fireEvent.click(setRoyalButton);

    await waitFor(() => {
      expect(themeStorage.setTheme).toHaveBeenCalledWith('royal');
    });
  });

  it('should update data-theme attribute when theme changes', async () => {
    vi.mocked(themeStorage.getTheme).mockReturnValue('ocean');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
    });

    const setForestButton = screen.getByTestId('set-theme-forest');
    fireEvent.click(setForestButton);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('forest');
    });
  });

  it('should provide correct theme object from THEMES constant', async () => {
    vi.mocked(themeStorage.getTheme).mockReturnValue('ocean');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-label')).toHaveTextContent(THEMES.ocean.label);
    });
  });

  it('should handle multiple theme changes sequentially', async () => {
    vi.mocked(themeStorage.getTheme).mockReturnValue('ocean');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setForestButton = screen.getByTestId('set-theme-forest');
    const setRoyalButton = screen.getByTestId('set-theme-royal');

    fireEvent.click(setForestButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('forest');
    });

    fireEvent.click(setRoyalButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('royal');
      expect(themeStorage.setTheme).toHaveBeenCalledWith('royal');
    });
  });
});
