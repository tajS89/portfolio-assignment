import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PieChartData, ViewMode } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface Props {
    data: PieChartData[];
    viewMode: ViewMode;
    onChangeViewMode: (mode: ViewMode) => void;
}

export function PortfolioPieChart({ data, viewMode, onChangeViewMode }: Props) {
    const { theme } = useTheme();

    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm" data-testid="pie-chart">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                <h2 className="text-base sm:text-lg font-semibold">Portfolio Allocation</h2>
                <div className="flex gap-2">
                    <button
                        type="button"
                        data-testid="view-mode-asset"
                        aria-pressed={viewMode === 'asset'}
                        onClick={() => onChangeViewMode('asset')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${viewMode === 'asset'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Asset
                    </button>
                    <button
                        type="button"
                        data-testid="view-mode-class"
                        aria-pressed={viewMode === 'class'}
                        onClick={() => onChangeViewMode('class')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${viewMode === 'class'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Class
                    </button>
                </div>
            </div>

            <div className="w-full h-64 sm:h-72 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius="70%"
                            strokeWidth={0}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={theme.colors.chartColors[index % theme.colors.chartColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}