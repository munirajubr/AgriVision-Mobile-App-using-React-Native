import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./lib/cron.js";

import authRoutes from "./routes/authRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js"; // Importing the new device routes

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Start the cron job for scheduled tasks (if implemented in lib/cron.js)
job.start(); 

// Middleware setup
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS

// Route setup
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
 // Mounting the device API endpoints

// Server listen
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  connectDB(); // Establish database connection
});
