// src/routes/deviceRoutes.js
import express from "express";
import { getDevices, addDevice, removeDevice } from "../controllers/deviceController.js";

const router = express.Router();

// NO AUTH — all routes open for testing
router.get("/get", getDevices);
router.post("/add", addDevice);
router.delete("/remove", removeDevice);

export default router;
