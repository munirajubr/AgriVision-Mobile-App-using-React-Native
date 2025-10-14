import express from 'express';
// Assumes protect middleware handles JWT token verification and sets req.user.id
import { protect } from '../middleware/auth.middleware.js'; 
import {
    getDevices,
    getDevice,
    createDevice,
    updateDevice,
    deleteDevice,
    setWifiConfig,
    receiveSensorData 
} from '../controllers/deviceController.js';

const router = express.Router();

// =========================================================
// 1. IoT Data Ingestion (Unprotected)
// POST /api/devices/data: Route for receiving sensor data from the physical IoT device.
// =========================================================
router.post('/data', receiveSensorData); 

// =========================================================
// 2. User Management Endpoints (Protected)
// Requires a valid JWT token.
// =========================================================

// Routes for listing and creating devices: /api/devices
router.route('/')
    // GET: Get all devices owned by the authenticated user
    .get(protect, getDevices) 
    // POST: Register a new device
    .post(protect, createDevice); 

// Routes for single device operations: /api/devices/:id
router.route('/:id')
    // GET: Get details for a single device
    .get(protect, getDevice)    
    // PUT: Update device details (name, location, status, etc.)
    .put(protect, updateDevice)    
    // DELETE: Delete a device registration
    .delete(protect, deleteDevice); 

// Route for Wi-Fi Provisioning: /api/devices/:id/wifi
router.route('/:id/wifi')
    // PUT: User saves Wi-Fi credentials for the device
    .put(protect, setWifiConfig); 

export default router;
