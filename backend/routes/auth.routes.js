import express from "express";

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  checkEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();



console.log("auth.routes loaded");

router.post("/check-email", checkEmail);
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;