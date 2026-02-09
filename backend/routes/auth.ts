import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { LoginRequest, LoginResponse } from "@shared/types/auth";
import { authMiddleware } from "../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "not-to-use-in-production";

const router = Router();

router.post("/login", (req: Request<object, object, LoginRequest>, res: Response<LoginResponse>): void => {
    const { username, password } = req.body;
    if (username === "test" && password === "Password1_") {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });
        res.json({ success: true, token });
        return;
    }
    res.status(401).json({ success: false, message: "Invalid credentials" });
});

router.get("/auth/validate", authMiddleware, (req: Request, res: Response) => {
    res.json({ valid: true });
});

export default router;
