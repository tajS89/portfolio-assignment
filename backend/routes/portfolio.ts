import { Router, Request, Response } from "express";
import { mockAssets } from "../data/assets";
import { mockCurrentPositions } from "../data/position";
import { generateHistoricalData } from "../utils/generateHistorical";
import { authMiddleware } from "../middleware/auth";
import type { PortfolioPosition, PortfolioResponse } from "@shared/types/portfolio";

const router = Router();

router.get("/portfolio", authMiddleware, (req: Request, res: Response<PortfolioResponse>) => {
    const positions: PortfolioPosition[] = mockCurrentPositions.map((pos) => {
        const asset = mockAssets.find((a) => a.id === pos.asset);
        const value = pos.quantity * pos.price;

        return {
            asset: asset?.name || "Unknown Asset",
            type: asset?.type ?? "unknown",
            quantity: pos.quantity,
            price: pos.price,
            value,
        };
    });

    const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
    const historicalData = generateHistoricalData(30);

    res.json({ positions, totalValue, historicalData });
});

export default router;
