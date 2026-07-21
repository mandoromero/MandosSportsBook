import jwt from "jsonwebtoken";
import pool from "../config/db.js";

/* =========================
   PROTECT ROUTES
========================= */

export const protect = async (
  req,
  res,
  next
) => {
  try {

    const authHeader =
      req.headers.authorization;

    console.log("AUTH HEADER RECEIVED:", authHeader);

    console.log(
      "AUTH HEADER RECEIVED:",
       req.headers.authorization
    );

    /* =========================
       CHECK HEADER
    ========================= */

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    /* =========================
       GET TOKEN
    ========================= */

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    /* =========================
       VERIFY TOKEN
    ========================= */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED TOKEN:", decoded);

    /* =========================
       FIND USER
    ========================= */

    const result = await pool.query(
      `
      SELECT
        id,
        first_name,
        middle_initial,
        last_name,
        gender,
        username,
        email,
        phone,
        dob
      FROM members
      WHERE id = $1
      `,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    /* =========================
       ATTACH USER TO REQUEST
    ========================= */

    req.user = result.rows[0];

    console.log("AUTH USER:", req.user);

    next();

  } catch (error) {
    console.error("JWT ERROR:", error.name);
    console.error("JWT MESSAGE:", error.message);

    return res.status(401).json({
      message: error.message,
    });
  }
};

/* =========================
   PUBLIC ROUTE
========================= */

export const publicRoute = (
  req,
  res,
  next
) => {
  next();
};