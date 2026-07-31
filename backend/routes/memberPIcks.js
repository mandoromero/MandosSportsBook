import express from "express";
import crypto from "crypto";
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

    // Generate entry code (optional)
    const entryCode = crypto.randomBytes(4).toString("hex").substring(0, 6).toUpperCase();

    /*-------------------------
        CREATE ENTRY
    --------------------------*/
    const entryResult = await client.query(
      `
      INSERT INTO pick_cards
      (
        member_id,
        week,
        monday_total_points
      )
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [memberId, week, mondayTotalPoints]
    );

    const entryId = entryResult.rows[0].id;

    console.log("Created Entry:", entryId);

    /*-------------------------
        SAVE PICKS
    --------------------------*/
    for (const pick of picks) {
      console.log("Saving:", pick);

      await client.query(
        `
        INSERT INTO card_picks
        (
          card_id,
          game_id,
          picked_team
        )
        VALUES ($1, $2, $3)
        `,
        [entryId, pick.game_id, pick.picked_team]
      );
    }

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
