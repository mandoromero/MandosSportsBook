import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import sportsRoutes from "./routes/sports.routes.js";
import weeklyGameRoutes from "./routes/weeklyGames.js";
import memberPicksRoutes from "./routes/memberPicks.js";
import nflPoolResultsRoutes from "./routes/nflPoolResultsRoutes.js";

dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5001;

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.send("🔥 API is running...");
});

/* =========================
   API ROUTES
========================= */

app.use("/api/auth", authRoutes);

app.use("/api/sports", sportsRoutes);

app.use("/api/weekly-games", weeklyGameRoutes);

app.use("/api/member-picks", memberPicksRoutes);

app.use(
  "/api/nfl-pool-results",
  nflPoolResultsRoutes
);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

/* =========================
   START SERVER
========================= */

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("🔥 PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(
        `🔥 Backend running on port ${PORT}`
      );
    });
  } catch (err) {
    console.error(
      "❌ DB Connection Error:",
      err.message
    );

    process.exit(1);
  }
};

startServer();