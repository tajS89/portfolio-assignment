import { useEffect, useState, useMemo, useCallback } from 'react';
import type { PortfolioPosition, Portfolio } from '@shared/types/portfolio';
import type { ViewMode, TimePeriod, PieChartData } from '../../types';

import { DashboardHeader } from './DashboardHeader';
import { TotalValueCard } from './TotalValueCard';
import { PortfolioPieChart } from './PortfolioPieChart';
import { HistoricalLineChart } from './HistoricalLineChart';
import { PositionsTable } from './PositionsTable';
import { getDashboardData } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export function Dashboard() {
    const [viewMode, setViewMode] = useState<ViewMode>('asset');
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('7d');
    const [positions, setPositions] = useState<PortfolioPosition[]>([]);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [historicalData, setHistoricalData] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { logout } = useAuth();

    

    useEffect(() => {
        
      const fetchData = () => {
          try {
              setLoading(true);
              setError(null);

              const { positions, totalValue, historicalData } = await getDashboardData();

              setPositions(positions);
              setTotalValue(totalValue);
              setHistoricalData(historicalData);
          } catch (err) {
              console.error('Failed to fetch dashboard data:', err);
              setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
          } finally {
              setLoading(false);
          }
      }

      fetchData();

    }, []);

    const pieChartData = useMemo<PieChartData[]>(() => {
        if (viewMode === 'asset') {
            return positions.map(p => ({
                name: p.asset,
                value: p.value,
            }));
        } else {
            const grouped: Record<string, PieChartData> = {};

            for (const pos of positions) {
                if (!grouped[pos.type]) {
                    grouped[pos.type] = { name: pos.type, value: 0 };
                }
                grouped[pos.type].value += pos.value;
            }

            return Object.values(grouped);
        }
    }, [positions, viewMode]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50" data-testid="dashboard-loading">
                <DashboardHeader onLogout={logout} />
                <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center" role="status" aria-live="polite">
                            <div data-testid="loading-spinner"
                                className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" aria-hidden="true"></div>
                            <p className="text-gray-600">Loading dashboard...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50" data-testid="dashboard-error">
                <DashboardHeader onLogout={logout} />
                <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center max-w-md">
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4" role="alert" aria-live="assertive">
                                <h3 className="font-semibold mb-2">Error Loading Dashboard</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                            <button
                                onClick={fetchData}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                data-testid="retry-button"
                                aria-label="Retry loading dashboard data"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-testid="dashboard">
            <DashboardHeader onLogout={logout} />

            <main className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <TotalValueCard totalValue={totalValue} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <PortfolioPieChart
                        data={pieChartData}
                        viewMode={viewMode}
                        onChangeViewMode={setViewMode}
                    />

                    <HistoricalLineChart
                        data={historicalData}
                        timePeriod={timePeriod}
                        onChangeTimePeriod={setTimePeriod}
                    />
                </div>

                <PositionsTable positions={positions} />
            </main>
        </div>
    );
}