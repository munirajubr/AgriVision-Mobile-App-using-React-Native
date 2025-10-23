import express from 'express';
import { registerUser, loginUser, setupProfile } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/setup', setupProfile);

export default router;
