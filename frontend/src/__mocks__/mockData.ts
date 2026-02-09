import type { LoginResponse } from '@shared/types/auth';
import type { PortfolioResponse } from '@shared/types/portfolio';

export const mockPortfolioResponse: PortfolioResponse = {
    positions: [
        { asset: "AAPL", type: "stock", quantity: 15, price: 195.50, value: 2932.50 },
        { asset: "GOOGL", type: "stock", quantity: 8, price: 147.25, value: 1178.00 },
        { asset: "BTC", type: "crypto", quantity: 2, price: 48000.00, value: 96000.00 },
        { asset: "ETH", type: "crypto", quantity: 6, price: 2500.00, value: 15000.00 },
        { asset: "BND", type: "bond", quantity: 40, price: 76.50, value: 3060.00 },
        { asset: "USD", type: "fiat", quantity: 12000, price: 1.00, value: 12000.00 }
    ],
    totalValue: 130170.50,
    historicalData: [
        {
            asOf: "2026-01-12",
            positions: [
                { id: 1, asset: "AAPL", quantity: 15, price: 191.00 },
                { id: 2, asset: "GOOGL", quantity: 8, price: 150.00 },
                { id: 3, asset: "BTC", quantity: 2, price: 47382.00 },
                { id: 4, asset: "ETH", quantity: 6, price: 2506.00 },
                { id: 5, asset: "BND", quantity: 40, price: 77.00 },
                { id: 6, asset: "USD", quantity: 12000, price: 1.00 }
            ]
        },
        {
            asOf: "2026-01-19",
            positions: [
                { id: 1, asset: "AAPL", quantity: 15, price: 195.50 },
                { id: 2, asset: "GOOGL", quantity: 8, price: 147.25 },
                { id: 3, asset: "BTC", quantity: 2, price: 48000.00 },
                { id: 4, asset: "ETH", quantity: 6, price: 2500.00 },
                { id: 5, asset: "BND", quantity: 40, price: 76.50 },
                { id: 6, asset: "USD", quantity: 12000, price: 1.00 }
            ]
        }
    ]
};

export const mockLoginResponse: LoginResponse = {
    success: true,
    token: "demo-token"
};

export const mockLoginFailedResponse: LoginResponse = {
    success: false,
    message: "failed"
};