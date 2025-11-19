// -------------------- Imports --------------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.js";       // signup/login routes
import profileRoutes from "./routes/profile.js"; // protected profile route

// -------------------- Config --------------------
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- Middleware --------------------
app.use(cors({ origin: "http://localhost:3000" })); // allow frontend requests
app.use(express.json()); // parse JSON bodies

// -------------------- Routes --------------------
app.use("/api/auth", authRoutes);       // signup & login routes
app.use("/api/profile", profileRoutes); // protected profile route

// -------------------- Root Endpoint --------------------
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
