// -------------------- Imports --------------------
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import prisma from "../prisma.js";

// -------------------- Setup --------------------
const router = express.Router();

// Convert import.meta.url → __dirname (ESM-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your JSON “database” for the message feature
const dbPath = path.join(__dirname, "../data/db.json");

// -------------------- Helpers (file-based message) --------------------

// Read JSON safely
function readDB() {
  try {
    // If file doesn’t exist, create a default one
    if (!fs.existsSync(dbPath)) {
      const defaultData = { message: "Hello from backend!" };
      fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }

    const fileData = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(fileData);
  } catch (err) {
    console.error("❌ Error reading db.json:", err);
    return { message: "Error reading database" };
  }
}

// Write JSON safely
function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error writing to db.json:", err);
    throw err; // rethrow so the POST route can respond with 500
  }
}

// -------------------- Message Routes (file-based) --------------------

// GET /api/message → Read and return message
router.get("/message", (req, res) => {
  console.log("📨 GET /api/message received");

  try {
    const data = readDB();
    res.json({ message: data.message });
  } catch (error) {
    console.error("❌ Failed to process GET /message:", error);
    res.status(500).json({ error: "Failed to read message" });
  }
});

// POST /api/message → Update message
router.post("/message", (req, res) => {
  console.log("✏️ POST /api/message received with body:", req.body);

  try {
    const { message } = req.body;

    if (typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Invalid message format" });
    }

    writeDB({ message });
    res.json({ success: true, message });
  } catch (error) {
    console.error("❌ Failed to process POST /message:", error);
    res.status(500).json({ error: "Failed to write message" });
  }
});

// -------------------- User Routes (real DB via Prisma) --------------------

// POST /api/users → Sign up (save to real DB)
router.post("/users", async (req, res) => {
  try {
    console.log("🧍 POST /api/users", req.body);
    const {
      firstName,
      middleInitial,
      lastName,
      email,
      phone,
      dob,
      password,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Parse dob string "YYYY-MM-DD" if provided
    let dobDate = null;
    if (dob) {
      const parsed = new Date(dob);
      if (!isNaN(parsed.getTime())) {
        dobDate = parsed;
      }
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        middleInitial: middleInitial || null,
        lastName,
        email,
        phone: phone || null,
        dob: dobDate,
        passwordHash,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/users → list users (for testing)
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    res.json({ users });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
