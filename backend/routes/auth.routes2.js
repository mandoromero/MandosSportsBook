import express from "express";

import {
  checkEmail,
  signup,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  deleteAccount,
  updateProfile,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */

router.post("/check-email", checkEmail);

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post(
  "/reset-password/:token",
  resetPassword
);

router.get(
  "/profile",
  protect,
  getProfile
);

router.delete(
  "/profile",
  protect,
  deleteAccount
);

/*===========================
    Edit Profile
===========================*/
router.put(
  "/profile",
  protect,
  updateProfile
)

export default router;