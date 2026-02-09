import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import portfolioRoutes from "./routes/portfolio";

const app = express();
app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(portfolioRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
