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
    const { week, picks } = req.body;

    console.log("Member:", memberId);
    console.log("Week:", week);

    // Generate a random 6-character entry code
    const entryCode = crypto
      .randomBytes(4)
      .toString("hex")
      .substring(0, 6)
      .toUpperCase();

    /*-------------------------
        CREATE ENTRY
    --------------------------*/

    const entryResult = await client.query(
      `
      INSERT INTO nfl_pool_entries
      (
        entry_code,
        member_id,
        week
      )
      VALUES ($1,$2,$3)
      RETURNING id
      `,
      [
        entryCode,
        memberId,
        week
      ]
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
        INSERT INTO nfl_pool_picks
        (
          entry_id,
          game_id,
          picked_team,
          total_points
        )
        VALUES ($1,$2,$3,$4)
        `,
        [
          entryId,
          pick.game_id,
          pick.picked_team,
          pick.total_points
        ]
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

    console.error(err);

    res.status(500).json({
      message: "Unable to submit picks."
    });

  } finally {
    client.release();
  }
});

export default router;