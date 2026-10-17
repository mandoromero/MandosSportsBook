import express from "express";
import pool from "../config/db.js";
import { syncNFLSeason } from "../services/nflSchedule.service.js";

const router = express.Router();

router.get("/season/:season", async (req, res) => {
  try {
    const season = Number(req.params.season);

    if (!Number.isInteger(season)) {
      return res.status(400).json({
        success: false,
        message: "Invalid NFL season.",
      });
    }

    const result = await pool.query(
      `SELECT
         game_id,
         season,
         week,
         away_team,
         home_team,
         commence_time
       FROM public.nfl_games
       WHERE season = $1
       ORDER BY commence_time`,
      [season]
    );

    res.json({
      success: true,
      season,
      games: result.rows,
    });
  } catch (error) {
    console.error("NFL SCHEDULE ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load NFL schedule.",
    });
  }
});

router.get("/season/:season", async (req, res) => {
  try {
    const season = Number(req.params.season);

    if (!Number.isInteger(season)) {
      return res.status(400).json({
        success: false,
        message: "Invalid NFL season.",
      });
    }

    const result = await pool.query(
      `SELECT
         game_id,
         season,
         week,
         away_team,
         home_team,
         commence_time
       FROM public.nfl_games
       WHERE season = $1
       ORDER BY commence_time`,
      [season]
    );

    res.json({
      success: true,
      season,
      games: result.rows,
    });
  } catch (error) {
    console.error("NFL SCHEDULE ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load NFL schedule.",
    });
  }
});

/*================================
      SYNC NFL SEASON
================================*/

router.post("/sync/:season", async (req, res) => {
  try {
    const season = Number(req.params.season);

    if (!Number.isInteger(season)) {
      return res.status(400).json({
        success: false,
        message: "Invalid NFL season."
      });
    }

    console.log(`🏈 Starting NFL ${season} schedule sync...`);

    const result = await syncNFLSeason(season);

    console.log(
      "✅ NFL schedule sync complete:",
      result
    );

    res.json({
      success: true,
      message: `NFL ${season} schedule synchronized.`,
      ...result
    });

  } catch (error) {
    console.error(
      "🔥 NFL SCHEDULE SYNC ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to synchronize NFL schedule.",
      error:
        error.response?.data ||
        error.message
    });
  }
});

export default router;