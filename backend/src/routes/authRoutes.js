import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });

// REGISTER new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
    if (username.length < 3) {
      return res.status(400).json({ success: false, error: "Username must be at least 3 characters" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    }

    // Duplicate check
    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, error: "Email already exists" });
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ success: false, error: "Username already exists" });
    }

    // Profile image
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const user = new User({ username, email, password, profileImage });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// LOGIN existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    console.log(`[DEBUG] Login attempt for email: '${email}'`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("[DEBUG] User not found for email:", email);
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("[DEBUG] Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// SETUP/UPDATE PROFILE for existing user
router.post("/setup", async (req, res) => {
  try {
    const { username, ...profileFields } = req.body;
    // Console for debugging route access
    console.log("Setup request received with username:", username);

    if (!username) {
      return res.status(400).json({ success: false, error: "Username is required" });
    }

    const user = await User.findOne({ username });
    console.log("User found for setup:", !!user);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    Object.assign(user, profileFields);
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Setup error:", err);
    res.status(500).json({ success: false, error: "Internal server error in setup" });
  }
});

export default router;
