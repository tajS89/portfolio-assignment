import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';
import type { TimePeriod } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface HistoricalDataPoint {
    asOf: string;
    positions: Array<{
        id: number;
        asset: string;
        quantity: number;
        price: number;
    }>;
}

interface Props {
    data: HistoricalDataPoint[];
    timePeriod: TimePeriod;
    onChangeTimePeriod: (p: TimePeriod) => void;
}

export function HistoricalLineChart({ data, timePeriod, onChangeTimePeriod }: Props) {
    const { theme } = useTheme();

    const chartData = useMemo(() => {
        const transformed = data.map(item => {
            const totalValue = item.positions.reduce((sum, pos) => {
                return sum + (pos.quantity * pos.price);
            }, 0);

            return {
                date: item.asOf,
                value: totalValue
            };
        });

        const now = new Date();
        const cutoffDate = new Date();

        switch (timePeriod) {
            case '7d':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case '15d':
                cutoffDate.setDate(now.getDate() - 15);
                break;
            case '30d':
                cutoffDate.setDate(now.getDate() - 30);
                break;
        }

        return transformed.filter(item => new Date(item.date) >= cutoffDate);
    }, [data, timePeriod]);

    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm" data-testid="historical-chart">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                <h2 className="text-base sm:text-lg font-semibold">Historical Performance</h2>
                <div className="flex gap-2">
                    {(['7d', '15d', '30d'] as TimePeriod[]).map((period) => (
                        <button
                            key={period}
                            data-testid={`time-period-${period}`}
                            onClick={() => onChangeTimePeriod(period)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${timePeriod === period
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-64 sm:h-72 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(date) =>
                                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            }
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            width={50}
                        />
                        <Tooltip
                            formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Value']}
                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={theme.colors.primary}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default HistoricalLineChart;