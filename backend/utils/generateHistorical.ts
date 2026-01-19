import { Portfolio } from "@shared/types/portfolio";
import { mockCurrentPositions } from "../data/position";

export function generateHistoricalData(days: number): Portfolio[] {
    const result: Portfolio[] = [];

    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {

        const date = new Date(Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate() - i
        ));

        const positions = mockCurrentPositions.map((position) => {
            const driftFactor =
                1 +
                (Math.sin(position.id * 10 + i) * 0.02);

            const historicalPrice = Math.round(position.price * driftFactor);

            return {
                ...position,
                price: Math.max(historicalPrice, 1),
            };
        });

        result.push({
            asOf: date.toISOString().split("T")[0],
            positions,
        });
    }

    return result;
}
