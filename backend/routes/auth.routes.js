import express from "express";

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  checkEmail,
  getProfile,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();



console.log("auth.routes loaded");

router.post("/check-email", checkEmail);
router.post("/signup", signup);
router.post("/login", login);

console.log("✅ Profile route registered");

router.get("/profile", protect, getProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;