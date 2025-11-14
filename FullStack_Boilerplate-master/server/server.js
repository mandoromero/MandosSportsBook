// -------------------- Imports --------------------
import express from "express";      // Express framework for building API
import cors from "cors";            // Enable cross-origin requests (frontend <> backend)
import dotenv from "dotenv";        // Load environment variables from .env file
import apiRoutes from "./routes/api.js"; // Import API routes you defined

// -------------------- Config --------------------
dotenv.config(); // Load environment variables from .env

// Create an Express application
const app = express();

// -------------------- Middleware --------------------
app.use(cors());          // Allow frontend to make requests to this backend
app.use(express.json());  // Parse JSON request bodies automatically

// -------------------- Routes --------------------
// Mount your API routes at /api
app.use("/api", apiRoutes);

// Test route at root to verify backend is running
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// -------------------- Server Startup --------------------
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*
🧠 Quick summary:
- This file is the main entry point for your backend.
- Middleware:
  - cors: allows requests from frontend (important for local dev)
  - express.json(): parses incoming JSON so req.body works
- Routes:
  - /api → your API endpoints (GET/POST /message)
  - / → simple test route
- Server listens on PORT (default 5000) and logs confirmation.
- Combined with your routes/api.js and db.json, this is a fully functional lightweight backend.
*/
