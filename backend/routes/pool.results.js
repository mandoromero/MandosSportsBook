import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/*==============================
      NFL POOL RESULTS
==============================*/

router.get("/:week", async (req, res) => {
  try {
    const week = Number(req.params.week);
    const season = Number(req.query.season ?? 2026);

    if (
      !Number.isInteger(week) ||
      week < 1 ||
      week > 18 ||
      !Number.isInteger(season)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid NFL week or season.",
      });
    }

  /*====================================
    1. Get games for the requested 
    season and week.
  =====================================*/
    const gamesResult = await pool.query(
      `
      SELECT
        game_id,
        season,
        week,
        away_team,
        home_team,
        commence_time
      FROM public.nfl_games
      WHERE season = $1 AND week = $2
      ORDER BY commence_time
      `,
      [season, week]
    );

  /*=========================================
    2. Get pool entries for this week.
  =========================================*/
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
      FROM public.pick_cards pc
      JOIN public.members m ON m.id = pc.member_id
      WHERE pc.week = $1
      ORDER BY m.username, pc.id
      `,
      [week]
    );

    /*=========================================
      3. Get saved picks for the entries.
    =========================================*/
    const picksResult = await pool.query(
      `
      SELECT
        cp.card_id,
        cp.picks
      FROM public.card_picks cp
      WHERE cp.week = $1
      `,
      [week]
    );

    /*=========================================
      4. Match picks to their cards.
    =========================================*/
    const picksByCard = new Map(
      picksResult.rows.map((record) => [
        record.card_id,
        record.picks ?? {},
      ])
    );

    const entries = entriesResult.rows.map((entry) => ({
      ...entry,
      picks: picksByCard.get(entry.card_id) ?? {},
    }));

    /*=========================================
      5. Send the results to the frontend.
    =========================================*/
    res.json({
      success: true,
      season,
      week,
      games: gamesResult.rows,
      entries,
    });
  } catch (err) {
    console.error("NFL RESULTS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Unable to load NFL Pool Results.",
    });
  }
});

export default router;
