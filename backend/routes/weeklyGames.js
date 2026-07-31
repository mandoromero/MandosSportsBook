import express from "express";
import axios from "axios";
import pool from "../config/db.js";

const router = express.Router();

/* =========================
   TEST ROUTE
========================= */
router.get("/test", (req, res) => {
  res.json({
    message: "Weekly games route is working"
  });
});

/* =========================
   IMPORT WEEKLY NFL GAMES
========================= */

router.post("/import", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds",
      {
        params: {
          apiKey: process.env.ODDS_API_KEY,
          regions: "us",
          markets: "h2h",
        },
      }
    );

    const games = response.data;

    if (!games || games.length === 0) {
      return res.status(400).json({
        message: "No games returned from Odds API"
      });
    }

    console.log("Games received:", games.length);
    console.log("Sample game:", games[0]);

    // TODO: Replace with dynamic week logic later
    const week = 1;

    for (const game of games) {
      const gameDate = new Date(game.commence_time);

      const weekday = gameDate.toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "UTC",
      });

      // Monday Night Football flag
      const isMondayNight = weekday === "Monday";

      await pool.query(
        `
        INSERT INTO weekly_games (
          week,
          game_id,
          away_team,
          home_team,
          commence_time,
          is_monday_night
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (game_id)
        DO NOTHING
        `,
        [
          week,
          game.id,
          game.away_team,
          game.home_team,
          game.commence_time,
          isMondayNight,
        ]
      );
    }

    res.json({
      message: "Games imported successfully.",
      imported: games.length,
    });

  } catch (err) {
    console.error("🔥 IMPORT ERROR:", err.message);

    res.status(500).json({
      error: "Unable to import games.",
      details: err.message,
    });
  }
});

export default router;
