import express from "express";
import axios from "axios";
import pool from "../config/db.js";

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
router.get("/odds/:sport", async (req, res) => {
  try {
    const { sport } = req.params;

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

/*==============================
      SPORTS API (External)
==============================*/
router.get("/:sport/games", async (req, res) => {
  try {
    const { sport } = req.params;

    let baseURL;

    switch (sport) {
      case "baseball":
        baseURL = process.env.SPORTS_BASEBALL_URL;
        break;
      case "basketball":
        baseURL = process.env.SPORTS_BASKETBALL_URL;
        break;
      case "hockey":
        baseURL = process.env.SPORTS_HOCKEY_URL;
        break;
      case "football":
        baseURL = process.env.SPORTS_FOOTBALL_URL;
        break;
      default:
        return res.status(400).json({ message: "Invalid sport" });
    }

    const response = await axios.get(`${baseURL}/games`, {
      headers: {
        "x-apisports-key": process.env.SPORTS_API_KEY,
      },
    });

    res.json(response.data);

  } catch (error) {
    console.error("🔥 SPORTS API ERROR:", error.message);

    res.status(500).json({
      message: "Failed to fetch games",
      error: error.message,
    });
  }
});

export default router;
