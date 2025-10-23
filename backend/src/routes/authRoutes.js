import express from 'express';
import { registerUser, loginUser, setupProfile } from '../controllers/authController.js';
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/setup", protect, setupProfile);

export default router;
