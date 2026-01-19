interface Props {
    totalValue: number;
}

export function TotalValueCard({ totalValue }: Props) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl border" data-testid="total-value-card">
            <p className="text-sm text-gray-500 mb-1">Total Portfolio Value</p>
            <p className="text-2xl sm:text-3xl font-bold break-all" data-testid="total-value">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        </div>
    );
}
