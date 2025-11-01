import express from 'express';
// import { registerUser, loginUser, setupProfile } from '../controllers/authController.js';
import { registerUser, loginUser} from '../controllers/authController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route: only authenticated users can access profile setup
// router.post('/setup', protect, setupProfile);

export default router;
