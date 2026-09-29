import express from "express";
import axios from "axios";

const router = express.Router();

console.log("✅ sports.routes.js loaded");

/*=============================
  SPORTS LIST ROUTE
=============================*/
router.get("/", (req, res) => {
  res.json([
    { key: "americanfootball_nfl" },
    { key: "baseball_mlb" },
    { key: "basketball_nba" }
  ]);
});

/*==============================
      ODDS API (The Odds API)
==============================*/
const supportedSports = [
  "americanfootball_nfl",
  "basketball_nba",
  "baseball_mlb",
  "icehockey_nhl"
];

router.get("/odds/:sport", async (req, res) => {
  try {
    const { sport } = req.params;

    // Only allow supported sports keys
    if (!supportedSports.includes(sport)) {
      return res.status(400).json({ message: "Unsupported sport key" });
    }

    const response = await axios.get(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds`,
      {
        params: {
          apiKey: process.env.ODDS_API_KEY,
          regions: "us",
          markets: "h2h",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("🔥 ODDS API ERROR:", error.message);
    res.status(500).json({
      message: "Failed to fetch odds",
      error: error.message,
    });
  }
});

export default router;
