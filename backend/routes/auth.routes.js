import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import pool from "../config/db.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  checkEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

/* =========================
   EMAIL TRANSPORTER
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   CHECK EMAIL
========================= */
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM members WHERE email = $1",
      [email]
    );

    return res.json({
      exists: existingUser.rows.length > 0,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      detail: error.detail,
      code: error.code,
    });
  }
});

/* =========================
   SIGNUP
========================= */
router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      middleInitial,
      lastName,
      gender,
      username,
      email,
      phone,
      dob,
      password,
    } = req.body;

    if (!firstName || !lastName || !username || !email || !dob || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM members WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `
      INSERT INTO members (
        first_name,
        middle_initial,
        last_name,
        gender,
        username,
        email,
        phone,
        dob,
        password_hash
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8 ,$9)
      RETURNING id, first_name, last_name, gender, username, email, dob
      `,
      [
        firstName,
        middleInitial || null,
        lastName,
        gender,
        username,
        email,
        phone || null,
        dob,
        hashedPassword,
      ]
    );

    return res.status(201).json({
      message: "User created successfully",
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    return res.status(500).json({
      message: error.message,
      detail: error.detail,
      code: error.code,
    });
  }
});

/* =========================
   FORGOT PASSWORD
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await pool.query(
      "SELECT * FROM members WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "No account found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const expires = new Date(Date.now() + 3600000);

    await pool.query(
      `
      UPDATE members
      SET reset_token = $1,
          reset_token_expires = $2
      WHERE email = $3
      `,
      [resetToken, expires, email]
    );

    const resetURL =
      `http://localhost:5174/reset-password/${token}`;

    await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: normalizedEmail,
  subject: "Password Reset",
  html: `
    <p>Click below to reset your password:</p>

    resetURL}">
      Reset Password
    </a>

    <p>${resetURL}</p>
  `,
});

    return res.json({
      message: "Reset email sent",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await pool.query(
      `
      SELECT *
      FROM members
      WHERE reset_token = $1
      AND reset_token_expires > NOW()
      `,
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Password Reset",
      html: `
        <p>Click below to reset your password:</p>

        resetURL}">
          Reset Password
        </a>

        <p>${resetURL}</p>
      `,
    });

    return res.json({
      message: "Password updated",
    }); 

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({
      message: error.message,
      detail: error.detail,
      code: error.code,
    });
  }
});

export default router;