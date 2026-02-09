// Shared portfolio types (API contracts and data models between frontend and backend)

// Data models
export interface Asset {
    id: string;
    name: string;
    type: 'crypto' | 'stock' | 'fiat' | 'bond';
}

export interface Position {
    id: number;
    asset: string;
    quantity: number;
    price: number;
}

export interface Portfolio {
    asOf: string;
    positions: Position[];
}

// API response types
export interface PortfolioPosition {
    asset: string;
    type: string;
    quantity: number;
    price: number;
    value: number;
}

export interface PortfolioResponse {
    positions: PortfolioPosition[];
    totalValue: number;
    historicalData: Portfolio[];
}
