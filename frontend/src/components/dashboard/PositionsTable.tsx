import type { PortfolioPosition } from '@shared/types/portfolio';
import { CHART_COLORS } from '../../constants/charts';

interface Props {
    positions: PortfolioPosition[];
}

export function PositionsTable({ positions }: Props) {
    return (
        <div className="bg-white rounded-xl border overflow-hidden" data-testid="positions-table">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <caption className="sr-only">Portfolio Positions</caption>
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-sm font-medium" data-testid="header-asset">Asset</th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-sm font-medium" data-testid="header-type">Type</th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-right text-sm font-medium" data-testid="header-quantity">Quantity</th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-right text-sm font-medium" data-testid="header-price">Price</th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-right text-sm font-medium" data-testid="header-value">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((p, i) => (
                            <tr key={`${p.asset}-${i}`} className="border-t" data-testid={`position-row-${p.asset}`}>
                                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                                    <span
                                        className="inline-block w-2 h-2 rounded-full mr-2"
                                        style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                                        aria-hidden="true"
                                        role="presentation"
                                    />
                                    {p.asset}
                                </td>
                                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{p.type}</td>
                                <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">{p.quantity}</td>
                                <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">
                                    ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 sm:px-6 py-3 text-right font-medium whitespace-nowrap">
                                    ${p.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
