import express from "express";
import { authenticate } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Protected route to get current user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    // Use the correct field from the JWT
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Return only relevant user info (omit password)
    const { password, ...userData } = user._doc;
    res.json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
