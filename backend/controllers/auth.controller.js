import bcrypt from "bcrypt";
import pool from "../config/db.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


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
   HELPERS
========================= */

const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const safeUser = (user) => ({
  id: user.id,
  firstName: user.first_name,
  middleInitial: user.middle_initial,
  lastName: user.last_name,
  gender: user.gender,
  username: user.username,
  email: user.email,
  phone: user.phone,
  dob: user.dob,
});

/* =========================
   CHECK EMAIL
========================= */

export const checkEmail = async (
  req,
  res
) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const result = await pool.query(
      `
      SELECT id
      FROM members
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    return res.json({
      exists:
        result.rows.length > 0,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   SIGNUP
========================= */
export const signup = async (req, res) => {
  try {
    const {
      firstName,
      middleInitial,
      lastName,
      gender,
      username,
      email,
      password,
      phone,
      dob
    } = req.body;

    const errors = [];

    /* =========================
       VALIDATION
    ========================= */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      errors.push("Invalid email format");
    }

    if (!username || username.includes(" ")) {
      errors.push("Username cannot contain spaces");
    }

    if (!password || password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    
    if (gender !== "Male" && gender !== "Female") {
      errors.push("Please chose either 'Male' or 'Female'.")
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    /* =========================
       NORMALIZE
    ========================= */

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    /* =========================
       CHECK EXISTING USER
    ========================= */

    const existingUser = await pool.query(
      `
      SELECT id
      FROM members
      WHERE email = $1 OR username = $2
      `,
      [normalizedEmail, normalizedUsername]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email or username already exists",
      });
    }

    /* =========================
       HASH PASSWORD
    ========================= */

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("HASHED PASSWORD:", hashedPassword);

    /* =========================
       INSERT USER
    ========================= */

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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, first_name, middle_initial, last_name, username, gender, email, phone, dob
      `,
      [
        firstName,
        middleInitial || null,
        lastName,
        gender,
        normalizedUsername,
        normalizedEmail,
        phone || null,
        dob || null,
        hashedPassword,
      ]
    );

    const token = createToken(newUser.rows[0].id);

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: safeUser(newUser.rows[0]),
    });

  } catch (error) {
    console.error("❌ SIGNUP ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await pool.query(
      `SELECT * FROM members WHERE email = $1`,
      [normalizedEmail]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const dbUser = user.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      dbUser.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = createToken(dbUser.id);

    return res.json({
      message: "Login successful",
      token, // ✅ FIXED
      user: {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */

  export const forgotPassword =
    async (req, res) => {
      try {

        const { email } =
          req.body;

        if (!email) {
          return res.status(400).json({
            message: "Email is required",
          });
        }

        const normalizedEmail =
          email
            .toLowerCase()
            .trim();

      /* FIND USER */

        const result =
          await pool.query(
            `
            SELECT id
            FROM members
            WHERE email = $1
            `,
            [normalizedEmail]
          );

        if (
          result.rows.length === 0
        ) {
          return res.status(404).json({
            message:
              "No account found",
          });
        }

      const token =
        crypto.randomBytes(32)
          .toString("hex");

      const expires =
        new Date(
          Date.now() + 3600000
        );

      await pool.query(
        `
        UPDATE members
        SET
          reset_token = $1,
          reset_token_expires = $2
        WHERE email = $3
        `,
        [
          token,
          expires,
          normalizedEmail,
        ]
      );

      const resetURL =
        `http://localhost:5174/reset-password/${token}`;
      
        await transporter.sendMail({
        from:
          process.env.EMAIL_USER,

        to: normalizedEmail,

        subject:
          "Password Reset",

        html: `
          <p>
            Click below to reset your password:
          </p>

          <a href="${resetURL}">
            Reset Password
          </a>
        `,
      });

      return res.json({
        message:
          "Reset email sent",
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        message:
          "Server error",
      });
    }
  };

/* =========================
   RESET PASSWORD
========================= */

export const resetPassword =
  async (req, res) => {
    try {

      const { token } =
        req.params;

      const { password } =
        req.body;

      if (!password) {
        return res.status(400).json({
          message:
            "Password required",
        });
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

      if (
        !passwordRegex.test(
          password
        )
      ) {
        return res.status(400).json({
          message:
            "Password must contain uppercase, lowercase, number, special character, and be at least 8 characters long",
        });
      }

      const result =
        await pool.query(
          `
          SELECT *
          FROM members
          WHERE reset_token = $1
          AND reset_token_expires > NOW()
          `,
          [token]
        );

      if (
        result.rows.length === 0
      ) {
        return res.status(400).json({
          message:
            "Invalid or expired token",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      await pool.query(
        `
        UPDATE members
        SET
          password_hash = $1,
          reset_token = NULL,
          reset_token_expires = NULL
        WHERE id = $2
        `,
        [
          hashedPassword,
          result.rows[0].id,
        ]
      );

      return res.json({
        message:
          "Password updated",
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        message:
          "Server error",
      });
    }
  };

/* =========================
   GET PROFILE
========================= */
export const getProfile = async (req, res) => {
  try {
    const id = req.user.id;

    const result = await pool.query(
      `
      SELECT
        id,
        first_name,
        middle_initial,
        last_name,
        username,
        gender,
        email,
        phone,
        dob
      FROM members
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      user: safeUser(result.rows[0]),
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
    DELETE ACCOUNT
========================= */

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM members
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    await pool.query(
      `
      DELETE FROM members
      WHERE id = $1
      `,
      [userId]
    );

    return res.status(200).json({
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error(
      "❌ DELETE ACCOUNT ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/*=====================
      Update Profile
  =====================*/
export const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;

    const {
      firstName,
      middleInitial,
      lastName,
      gender,
      email,
      phone,
      dob,
    } = req.body;

    const normalizedEmail =
      email?.toLowerCase().trim();

    /* =========================
       CHECK IF EMAIL EXISTS
    ========================= */
    if (normalizedEmail) {
      const existingUser = await pool.query(
        `
        SELECT id
        FROM members
        WHERE email = $1
        AND id != $2
        `,
        [normalizedEmail, id]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }
    }

    /* =========================
       UPDATE USER
    ========================= */
    const result = await pool.query(
      `
      UPDATE members
      SET
        first_name = $1,
        middle_initial = $2,
        last_name = $3,
        gender = $4,
        email = $5,
        phone = $6,
        dob = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        firstName,
        middleInitial || null,
        lastName,
        gender,
        normalizedEmail,
        phone || null,
        dob || null,
        id,
      ]
    );

    /* =========================
       USER NOT FOUND
    ========================= */
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      user: safeUser(result.rows[0]),
    });

  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};