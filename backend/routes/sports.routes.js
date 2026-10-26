
import express from "express";
import axios from "axios";

const router = express.Router();

console.log("✅ sports.routes.js loaded");

const supportedSports = [
  "americanfootball_nfl",
  "basketball_nba",
  "baseball_mlb",
  "icehockey_nhl",
];

/* =============================
   SPORTS LIST ROUTE
============================= */
router.get("/", (req, res) => {
  res.json([
    { 
      "key": "americanfootball_nfl", 
      "title": "NFL", 
      "group": "American Football" 
    },
    { 
      "key": "basketball_nba", 
      "title": "NBA", 
      "group": "Basketball" 
    },
    { 
      "key": "baseball_mlb", 
      "title": "MLB", 
      "group": "Baseball" 
    },
    { 
      "key": "icehockey_nhl", 
      "title": "NHL", 
      "group": "Ice Hockey" 
    },
  ]);
});

/* =============================
   ODDS API ROUTE
============================= */
router.get("/odds/:sport", async (req, res) => {
  const { sport } = req.params;

  if (!supportedSports.includes(sport)) {
    return res.status(400).json({
      message: "Unsupported sport key",
    });
  }

  if (!process.env.ODDS_API_KEY) {
    return res.status(500).json({
      message: "Odds API key is not configured",
    });
  }

  try {
    const response = await axios.get(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds`,
      {
        params: {
          apiKey: process.env.ODDS_API_KEY,
          regions: "us",
          markets: "h2h",
          oddsFormat: "american",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "🔥 ODDS API ERROR:",
      error.response?.data || error.message
    );

    res.status(502).json({
      message: `Failed to fetch odds for ${sport}`,
    });
  }
});

export default router;
