import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // Exclude password before sending
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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
