import express from "express";
import axios from "axios";

const router = express.Router();

const BASE_URL = "https://api.the-odds-api.com/v4";

/* =========================
   GET ODDS BY SPORT
========================= */
router.get("/odds/:sport", async (req, res) => {
  try {
    if (!process.env.ODDS_API_KEY) {
      return res.status(500).json({
        message: "Missing ODDS_API_KEY in .enf",
      });
    }
    const { sport } = req.params;

    const allowedSports = [
      "americanfootball_nfl",
      "basketball_nba",
      "icehockey_nhl",
      "baseball_mlb"
    ];

    if (!allowedSports.includes(sport)) {
      return res.status(400).json({
        message: "Invalid sport",
        allowedSports
      });
    }

    const response = await axios.get(
      `${BASE_URL}/sports/${sport}/odds`,
      {
        params: {
          apiKey: process.env.ODDS_API_KEY,
          regions: "us",
          markets: "h2h",
          oddsFormat: "american",
        }
      }
    );

    return res.json(response.data);

  } catch (err) {

    console.error("Odds API error:", err.response?.data || err.message);

    return res.status(500).json({
      message: "Failed to fetch odds"
    });
  }
});

/*===========================
  Events Route
===========================*/
router.get("/events/:sport", async (req, res) => {
  try {
    const { sport } = req.params;

    const response = await axios.get(
      `${BASE_URL}/sports/${sport}/events`,
      {
        params: {
          apiKey: process.env.ODDS_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(
      "Events API error:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      message: "Failed to fetch events",
    });
  }
});

/* =========================
   GET ALL SPORTS
========================= */
router.get("/", async (req, res) => {
  try {
    if (!process.env.ODDS_API_KEY) {
      return res.status(500).json({
        message: "Missing ODDS_API_KEY in .env",
      });
    }

    const response = await axios.get(`${BASE_URL}/sports`, {
      params: {
        apiKey: process.env.ODDS_API_KEY,
      },
    });

    return res.json(response.data);
  } catch (err) {
    console.error("❌ Sports API error:", err.response?.data || err.message);

    return res.status(500).json({
      message: "Failed to fetch sports list",
    });
  }
});

export default router;