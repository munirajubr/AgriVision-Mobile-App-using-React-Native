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
app.use(express.json({ limit: '50mb' })); // Body parser for JSON data
app.use(express.urlencoded({ limit: '50mb', extended: true })); // For large form-data
app.use(cors()); // Enable CORS

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is awake" });
});

// Route setup
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
 // Mounting the device API endpoints

// Server listen
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  connectDB(); // Establish database connection
});
