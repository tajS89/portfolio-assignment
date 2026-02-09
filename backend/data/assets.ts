
import type { Asset } from "@shared/types/portfolio";

export const mockAssets: readonly Asset[] = [
    { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "AAPL", type: "stock" },
    { id: "b2c3d4e5-f6g7-8910-bcde-f23456789012", name: "GOOGL", type: "stock" },
    { id: "c3d4e5f6-g7h8-9123-cdef-345678901234", name: "BTC", type: "crypto" },
    { id: "d4e5f6g7-h8i9-1234-def0-456789012345", name: "ETH", type: "crypto" },
    { id: "e5f6g7h8-i9j0-2345-ef01-567890123456", name: "BND", type: "bond" },
    { id: "b3f4c1a9-7e2d-4d91-9f8a-123456789abc", name: "USD", type: "fiat" }
];
