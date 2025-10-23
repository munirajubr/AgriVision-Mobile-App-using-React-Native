import express from 'express';
import { registerUser, loginUser, setupProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/setup', setupProfile);

export default router;
