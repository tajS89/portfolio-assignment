import type { Position } from "@shared/types/portfolio";

export const mockCurrentPositions: readonly Position[] = [
    {
        id: 1,
        asset: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        quantity: 15,
        price: 195
    },
    {
        id: 2,
        asset: "b2c3d4e5-f6g7-8910-bcde-f23456789012",
        quantity: 8,
        price: 147
    },
    {
        id: 3,
        asset: "c3d4e5f6-g7h8-9123-cdef-345678901234",
        quantity: 2,
        price: 48000
    },
    {
        id: 4,
        asset: "d4e5f6g7-h8i9-1234-def0-456789012345",
        quantity: 6,
        price: 2500
    },
    {
        id: 5,
        asset: "e5f6g7h8-i9j0-2345-ef01-567890123456",
        quantity: 40,
        price: 76
    },
    {
        id: 6,
        asset: "b3f4c1a9-7e2d-4d91-9f8a-123456789abc",
        quantity: 12000,
        price: 1
    }
];
