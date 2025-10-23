import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT token with expiry
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });

// -- Register new user --
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ success: false, error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    // Check duplicates
    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ success: false, error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new User({
      username,
      email,
      password: hashedPassword,
      profileImage,
    });

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
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// -- Login existing user --
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // Build user profile for response, excluding sensitive info
    const {
      _id,
      username,
      email: userEmail,
      phone,
      farmLocation,
      farmSize,
      experience,
      connectedDevices,
      farmingType,
      soilType,
      irrigationType,
      lastHarvest,
      cropsGrown,
      profileImage,
      createdAt,
    } = user;

    res.status(200).json({
      success: true,
      token,
      user: {
        id: _id,
        username,
        email: userEmail,
        phone,
        farmLocation,
        farmSize,
        experience,
        connectedDevices,
        farmingType,
        soilType,
        irrigationType,
        lastHarvest,
        cropsGrown,
        profileImage,
        createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// -- Profile setup/update --
const setupProfile = async (req, res) => {
  try {
    // The protect middleware attaches the logged-in user to req.user
    const userId = req.user._id || req.user.id; // Handles both cases

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Fields allowed from frontend
    const {
      phone,
      farmLocation,
      farmSize,
      experience,
      farmingType,
      soilType,
      irrigationType,
      lastHarvest,
      cropsGrown,
    } = req.body;

    // Only update allowed fields and mark as complete
    const updateFields = {
      phone,
      farmLocation,
      farmSize,
      experience,
      farmingType,
      soilType,
      irrigationType,
      lastHarvest,
      cropsGrown: Array.isArray(cropsGrown) ? cropsGrown : [],
      isProfileComplete: true,
    };

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile setup error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  setupProfile,
};
