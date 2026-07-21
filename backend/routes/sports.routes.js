import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/:sport/games", async (req, res) => {
  try {
    const { sport } = req.params;

    let baseURL;

    if (sport === "baseball") {
      baseURL = process.env.SPORTS_BASEBALL_URL;
    } else if (sport === "basketball") {
      baseURL = process.env.SPORTS_BASKETBALL_URL;
    } else if (sport === "hockey") {
      baseURL = process.env.SPORTS_HOCKEY_URL;
    } else {
      return res.status(400).json({
        message: "Invalid sport",
      });
    }

    const response = await axios.get(
      `${baseURL}/games`,
      {
        headers: {
          "x-apisports-key": process.env.SPORTS_API_KEY,
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch games",
    });
  }
});

export default router;