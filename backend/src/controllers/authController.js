import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper to generate JWT
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }
    if (username.length < 3) {
      return res.status(400).json({ success: false, error: "Username must be at least 3 characters." });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ success: false, error: "Email already exists." });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ success: false, error: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new User({
      username,
      email,
      password: hashedPassword,
      profileImage,
      isProfileComplete: false,
    });

    await user.save();

    const token = generateToken(user._id);

    console.log("User registered:", email);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        isProfileComplete: user.isProfileComplete,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};


// Login existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      farmLocation: user.farmLocation,
      farmSize: user.farmSize,
      experience: user.experience,
      connectedDevices: user.connectedDevices,
      farmingType: user.farmingType,
      soilType: user.soilType,
      irrigationType: user.irrigationType,
      lastHarvest: user.lastHarvest,
      cropsGrown: user.cropsGrown,
      profileImage: user.profileImage,
      isProfileComplete: user.isProfileComplete,
      createdAt: user.createdAt,
    };

    console.log("User logged in:", email);

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

export { registerUser, loginUser };
