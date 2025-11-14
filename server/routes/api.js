// -------------------- Imports --------------------
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// -------------------- Setup --------------------
const router = express.Router();

// Convert import.meta.url → __dirname (ESM-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your JSON “database”
const dbPath = path.join(__dirname, "../data/db.json");

// -------------------- Helpers --------------------

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

// -------------------- Routes --------------------

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

export default router;

/*
🧠 Summary:
- Auto-creates db.json if missing.
- Logs all GET and POST activity.
- Validates message input to prevent empty or invalid writes.
- Catches and reports file errors gracefully.
- Compatible with your current Express setup (server.js mounts it at /api).
*/
