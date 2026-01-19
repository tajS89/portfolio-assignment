// src/components/dashboard/__tests__/Dashboard.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../Dashboard';
import * as apiService from '../../../services/api';
import { mockPortfolioResponse } from '../../../__mocks__/mockData';
import { ThemeProvider } from '../../../context/ThemeProvider';

vi.mock('../../../services/api');

const mockLogout = vi.fn();
vi.mock('../../../hooks/useAuth', () => ({
    useAuth: () => ({
        logout: mockLogout,
        isAuthenticated: true,
        isLoading: false,
        token: 'mock-token',
        login: vi.fn(),
    }),
}));

describe('Dashboard - User Perspective Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(apiService, 'getDashboardData').mockResolvedValue(mockPortfolioResponse);
    });

    it('should render dashboard header items correctly', async () => {
        render(
            <ThemeProvider>
                <Dashboard />
            </ThemeProvider>
        );

        // Wait for dashboard to load
        await waitFor(() => {
            expect(screen.getByTestId('dashboard')).toBeInTheDocument();
        });

        // Verify header
        expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
        expect(screen.getByTestId('dashboard-title')).toHaveTextContent('Portfolio Dashboard');
        expect(screen.getByTestId('logout-button')).toBeInTheDocument();

        // Verify total value card
        expect(screen.getByTestId('total-value-card')).toBeInTheDocument();
        expect(screen.getByTestId('total-value')).toHaveTextContent('$130,170.50');
    });

    it('should render positions table with all data', async () => {
        render(
            <ThemeProvider>
                <Dashboard />
            </ThemeProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('positions-table')).toBeInTheDocument();
        });

        // Verify table headers
        expect(screen.getByTestId('header-asset')).toBeInTheDocument();
        expect(screen.getByTestId('header-type')).toBeInTheDocument();
        expect(screen.getByTestId('header-quantity')).toBeInTheDocument();
        expect(screen.getByTestId('header-price')).toBeInTheDocument();
        expect(screen.getByTestId('header-value')).toBeInTheDocument();

        // Verify all positions are displayed
        expect(screen.getByTestId('position-row-AAPL')).toBeInTheDocument();
        expect(screen.getByTestId('position-row-GOOGL')).toBeInTheDocument();
        expect(screen.getByTestId('position-row-BTC')).toBeInTheDocument();
        expect(screen.getByTestId('position-row-ETH')).toBeInTheDocument();
        expect(screen.getByTestId('position-row-BND')).toBeInTheDocument();
        expect(screen.getByTestId('position-row-USD')).toBeInTheDocument();
    });

    it('should render pie chart and toggle between Asset/Class views', async () => {
        const user = userEvent.setup();
        render(
            <ThemeProvider>
                <Dashboard />
            </ThemeProvider>
        );

        // Wait for pie chart to load
        await waitFor(() => {
            expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
        });

        const assetButton = screen.getByTestId('view-mode-asset');
        const classButton = screen.getByTestId('view-mode-class');

        // Verify Asset is selected by default
        expect(assetButton).toHaveClass('bg-primary');
        expect(classButton).toHaveClass('bg-gray-100');

        // Verify pie chart component is rendered
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();

        // Click on Class button
        await user.click(classButton);

        await waitFor(() => {
            expect(classButton).toHaveClass('bg-primary');
            expect(assetButton).toHaveClass('bg-gray-100');
        });

        // Verify pie chart still exists after view mode change
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();

        // Click back on Asset button
        await user.click(assetButton);

        await waitFor(() => {
            expect(assetButton).toHaveClass('bg-primary');
            expect(classButton).toHaveClass('bg-gray-100');
        });

        // Verify pie chart still exists after switching back
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('should render historical line chart and switch between time periods', async () => {
        const user = userEvent.setup();
        render(
            <ThemeProvider>
                <Dashboard />
            </ThemeProvider>
        );

        // Wait for chart to load
        await waitFor(() => {
            expect(screen.getByTestId('historical-chart')).toBeInTheDocument();
        });

        const sevenDayButton = screen.getByTestId('time-period-7d');
        const fifteenDayButton = screen.getByTestId('time-period-15d');
        const thirtyDayButton = screen.getByTestId('time-period-30d');

        // Verify 7D is selected by default
        expect(sevenDayButton).toHaveClass('bg-primary');
        expect(fifteenDayButton).toHaveClass('bg-gray-100');
        expect(thirtyDayButton).toHaveClass('bg-gray-100');

        // Verify historical chart component is rendered
        expect(screen.getByTestId('historical-chart')).toBeInTheDocument();

        // Click on 15D
        await user.click(fifteenDayButton);

        await waitFor(() => {
            expect(fifteenDayButton).toHaveClass('bg-primary');
            expect(sevenDayButton).toHaveClass('bg-gray-100');
        });

        // Verify chart still exists after period change
        expect(screen.getByTestId('historical-chart')).toBeInTheDocument();

        // Click on 30D
        await user.click(thirtyDayButton);

        await waitFor(() => {
            expect(thirtyDayButton).toHaveClass('bg-primary');
            expect(fifteenDayButton).toHaveClass('bg-gray-100');
        });

        // Verify chart still exists
        expect(screen.getByTestId('historical-chart')).toBeInTheDocument();

        // Click back on 7D
        await user.click(sevenDayButton);

        await waitFor(() => {
            expect(sevenDayButton).toHaveClass('bg-primary');
            expect(thirtyDayButton).toHaveClass('bg-gray-100');
        });

        // Verify chart still exists after switching back
        expect(screen.getByTestId('historical-chart')).toBeInTheDocument();
    });

    it('should display error when getDashboardData fails and retry successfully', async () => {
        const user = userEvent.setup();

        // Mock API to fail first, then succeed
        const getDashboardDataSpy = vi.spyOn(apiService, 'getDashboardData')
            .mockRejectedValueOnce(new Error('Failed to load dashboard data'))
            .mockResolvedValueOnce(mockPortfolioResponse);

        render(
            <ThemeProvider>
                <Dashboard />
            </ThemeProvider>
        );

        // Wait for error to be displayed
        await waitFor(() => {
            expect(screen.getByTestId('dashboard-error')).toBeInTheDocument();
        });

        // Click retry button
        const retryButton = screen.getByTestId('retry-button');
        expect(retryButton).toBeInTheDocument();
        await user.click(retryButton);

        // Wait for successful load after retry
        await waitFor(() => {
            expect(screen.queryByTestId('dashboard-error')).not.toBeInTheDocument();
            expect(screen.getByTestId('dashboard')).toBeInTheDocument();
            expect(screen.getByTestId('total-value')).toHaveTextContent('$130,170.50');
        });

        // Verify API was called twice
        expect(getDashboardDataSpy).toHaveBeenCalledTimes(2);
    });
});
