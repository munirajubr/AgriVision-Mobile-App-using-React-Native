import express from 'express';
import { 
  registerUser, 
  loginUser, 
  setupProfile, 
  verifyEmail, 
  resendVerificationOTP, 
  forgotPassword, 
  verifyResetOTP, 
  resetPassword 
} from '../controllers/authController.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendVerificationOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);
router.post('/setup', setupProfile);
router.put('/profile', protect, setupProfile); // Adding PUT /profile with protection

export default router;
