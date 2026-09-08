import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/*==============================
      NFL POOL RESULTS
==============================*/

router.get("/:week", async (req, res) => {
  try {
    const week = Number(req.params.week);

    /*----------------------------------
      1. GET THIS WEEK'S GAMES
    ----------------------------------*/
    const gamesResult = await pool.query(
      `
      SELECT
        game_id,
        week,
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
      2. GET ALL ENTRIES FOR THIS WEEK
         (pick_cards + members)
    ----------------------------------*/
    const entriesResult = await pool.query(
      `
      SELECT
        pc.id AS card_id,
        pc.entry_code,
        pc.member_id,
        pc.week,
        pc.monday_total_points,
        m.username,
        m.first_name,
        m.last_name
      FROM pick_cards pc
      JOIN members m ON m.id = pc.member_id
      WHERE pc.week = $1
      ORDER BY m.username, pc.id
      `,
      [week]
    );

    /*----------------------------------
      3. GET PICKS JSON FOR EACH CARD
         card_picks.picks (jsonb)
    ----------------------------------*/
    const picksResult = await pool.query(
      `
      SELECT
        cp.card_id,
        cp.picks
      FROM card_picks cp
      WHERE cp.week = $1
      ORDER BY cp.card_id
      `,
      [week]
    );

    /*----------------------------------
      4. MERGE PICKS INTO ENTRIES
    ----------------------------------*/
    const entries = entriesResult.rows.map((entry) => {
      const pickRecord = picksResult.rows.find(
        (p) => p.card_id === entry.card_id
      );

      return {
        ...entry,
        picks: pickRecord ? pickRecord.picks : {}
      };
    });

    /*----------------------------------
      5. SEND FINAL RESPONSE
    ----------------------------------*/
    res.json({
      success: true,
      games: gamesResult.rows,
      entries
    });

  } catch (err) {
    console.error("🔥 NFL RESULTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load NFL Pool Results."
    });
  }
});

export default router;
