import express from "express";
import { ENV } from "./config/env.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";

const app = express();
const PORT = ENV.PORT || 5000;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true });
});

// Mount routes
app.use("/api/favorites", favoritesRoutes);

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
