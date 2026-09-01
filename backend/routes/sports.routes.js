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
      FOR NFLGAMES (ODDS API)
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

/*==============================
    NFL GAMES BY WEEK
==============================*/
router.post("/nfl/import/:week", async (req, res) => {
  try {
    const { week } = req.params;

    // 1. Fetch games from API
    const response = await axios.get(
      `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/games`,
      {
        params: {
          apiKey: process.env.ODDS_API_KEY,
          regions: "us",
          markets: "h2h",
        },
      }
    );

    const games = response.data;

    // 2. Filter by week (if API includes week)
    const weekGames = games.filter(g => g.week === Number(week));

    // 3. Insert into DB
    for (const g of weekGames) {
      await pool.query(
        `
        INSERT INTO nfl_games (game_id, week, away_team, home_team, commence_time)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (game_id) DO NOTHING
        `,
        [
          g.id,            // API game_id
          week,
          g.away_team,
          g.home_team,
          g.commence_time
        ]
      );
    }

    res.json({
      success: true,
      inserted: weekGames.length,
      week,
    });

  } catch (err) {
    console.error("🔥 NFL IMPORT ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


/*==============================
      NFL POOL RESULTS (DB)
==============================*/
router.get("/nfl/results/:week", async (req, res) => {
  try {
    const { week } = req.params;

    const games = await pool.query(
      `
      SELECT game_id, away_team, home_team, commence_time
      FROM nfl_games
      WHERE week = $1
      ORDER BY commence_time
      `,
      [week]
    );

    const entries = await pool.query(
      `
      SELECT e.id AS entry_id, e.member_id, e.week, e.monday_total_points, m.username
      FROM pick_cards e
      JOIN members m ON m.id = e.member_id
      WHERE e.week = $1
      ORDER BY m.username, e.id
      `,
      [week]
    );

    const picks = await pool.query(
      `
      SELECT cp.card_id, cp.game_id, cp.picked_team
      FROM card_picks cp
      JOIN pick_cards e ON e.id = cp.card_id
      WHERE e.week = $1
      ORDER BY cp.card_id, cp.game_id
      `,
      [week]
    );

    const results = await pool.query(`SELECT * FROM nfl_results`);

    res.json({
      success: true,
      games: games.rows,
      entries: entries.rows,
      picks: picks.rows,
      results: results.rows,
    });

  } catch (err) {
    console.error("🔥 NFL RESULTS ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Unable to load NFL Pool Results.",
      error: err.message,
    });
  }
});

export default router;
