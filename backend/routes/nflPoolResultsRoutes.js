import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/*==============================
      NFL POOL RESULTS
==============================*/

router.get("/:week", async (req, res) => {
  try {
    const { week } = req.params;

    /*----------------------------------
      GET THIS WEEK'S GAMES
    ----------------------------------*/
    const games = await pool.query(
      `
      SELECT
          game_id,
          away_team,
          home_team,
          commence_time
      FROM nfl_games
      WHERE week = $1
      ORDER BY commence_time
      `,
      [week]
    );

    /*----------------------------------
      GET EVERY ENTRY
    ----------------------------------*/
    const entries = await pool.query(
      `
      SELECT
          e.id AS entry_id,
          e.member_id,
          e.week,
          e.monday_total_points,
          m.username
      FROM pick_cards e
      JOIN members m ON m.id = e.member_id
      WHERE e.week = $1
      ORDER BY m.username, e.id
      `,
      [week]
    );

    /*----------------------------------
      GET PICKS FOR EACH ENTRY
    ----------------------------------*/
    const picks = await pool.query(
      `
      SELECT
          cp.card_id,
          cp.game_id,
          cp.picked_team
      FROM card_picks cp
      JOIN pick_cards e ON e.id = cp.card_id
      WHERE e.week = $1
      ORDER BY cp.card_id, cp.game_id
      `,
      [week]
    );

    /*----------------------------------
      GET FINAL RESULTS
    ----------------------------------*/
    const results = await pool.query(
      `
      SELECT *
      FROM nfl_results
      `
    );

    res.json({
      success: true,
      games: games.rows,
      entries: entries.rows,
      picks: picks.rows,
      results: results.rows,
    });

  } catch (err) {
    console.error("🔥 RESULTS ROUTE ERROR:", err.message);
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to load NFL Pool Results."
    });
  }
});

export default router;
