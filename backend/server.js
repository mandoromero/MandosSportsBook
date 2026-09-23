import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import sportsRoutes from "./routes/sports.routes.js";
import memberPicksRoutes from "./routes/memberPicksRoutes.js"
import authRoutes from "./routes/auth.routes.js";
import nflResultsRoutes from "./routes/pool.results.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🔥 API is running...");
});

app.use("/api/member-picks", memberPicksRoutes);

app.use("/api/nfl/results", nflResultsRoutes);

// ROUTES
app.use("/sports", sportsRoutes);

// TEST DB CONNECTION
(async () => {
  try {
    await pool.connect();
    console.log("📡 Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
  }
})();

// START SERVER
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});


