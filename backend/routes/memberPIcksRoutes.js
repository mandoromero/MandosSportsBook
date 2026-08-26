import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/*-----------------
    SAVE NFL PICKS
-----------------*/
router.post("/", protect, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const memberId = req.user.id;
    const { week, mondayTotalPoints, picks } = req.body;

    console.log("Member:", memberId);
    console.log("Week:", week);

    /*-------------------------
        CREATE ENTRY
    --------------------------*/
    const entryResult = await client.query(
      `
      INSERT INTO pick_cards
      (member_id, week, monday_total_points)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [memberId, week, mondayTotalPoints]
    );

    const entryId = entryResult.rows[0].id;
    console.log("Created Entry:", entryId);

    /*-------------------------
        CREATE ENTRY CODE
        Format: memberId-week-entryId
    --------------------------*/
    const entryCode = `${memberId}-${week}-${entryId}`;

    await client.query(
      `UPDATE pick_cards SET entry_code = $1 WHERE id = $2`,
      [entryCode, entryId]
    );

    /*-------------------------
        BUILD JSONB PICKS
        Example:
        {
          "401": "H",
          "402": "A",
          "403": "H"
        }
    --------------------------*/
    const picksJson = {};
    for (const pick of picks) {
      picksJson[pick.game_id] = pick.picked_team; // "H" or "A"
    }

    /*-------------------------
        SAVE JSONB PICKS
    --------------------------*/
    await client.query(
      `
      INSERT INTO card_picks (card_id, week, picks)
      VALUES ($1, $2, $3)
      `,
      [entryId, week, picksJson]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      entryId,
      entryCode,
      message: "Entry submitted successfully!"
    });

  } catch (err) {
    await client.query("ROLLBACK");

    console.error("🔥 BACKEND ERROR:", err.message);
    console.error("🔥 STACK:", err.stack);

    res.status(500).json({
      message: "Unable to submit picks.",
      error: err.message
    });

  } finally {
    client.release();
  }
});

export default router;
