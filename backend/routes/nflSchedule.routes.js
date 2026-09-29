import express from "express";
import { syncNFLSeason } from "../services/nflSchedule.service.js";

const router = express.Router();

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