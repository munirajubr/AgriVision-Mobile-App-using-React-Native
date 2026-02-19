import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../lib/cloudinary.js';

// Generate JWT token with expiry
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });

// Function to generate a unique username from fullName
const generateUniqueUsername = async (fullName) => {
  let baseUsername = fullName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  if (baseUsername.length < 3) baseUsername = "user" + Math.floor(100 + Math.random() * 900);
  
  let username = baseUsername;
  let exists = await User.findOne({ username });
  let counter = 1;

  while (exists) {
    username = `${baseUsername}${counter}`;
    exists = await User.findOne({ username });
    counter++;
  }
  return username;
};

// -- Register new user --
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (fullName.length < 3) {
      return res.status(400).json({ success: false, error: 'Name must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const emailNormalized = email.toLowerCase().trim();

    if (await User.findOne({ email: emailNormalized })) {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }

    // Generate unique username
    const username = await generateUniqueUsername(fullName);
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new User({
      fullName,
      username,
      email: emailNormalized,
      password,
      profileImage,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
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
    const { identifier, password } = req.body; // 'identifier' can be email or username

    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Identifier and password are required' });
    }

    const normalizedIdentifier = identifier.toLowerCase().trim();

    // Find user by email OR username
    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        phone: user.phone || '',
        farmLocation: user.farmLocation || '',
        farmSize: user.farmSize || '',
        experience: user.experience || '',
        farmingType: user.farmingType || '',
        soilType: user.soilType || '',
        irrigationType: user.irrigationType || '',
        createdAt: user.createdAt,
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
    const { username, fullName, ...profileFields } = req.body; // Ignore username/fullName for updates if needed
    let user;

    if (req.user) {
      user = await User.findById(req.user._id);
    } 
    
    if (!user && username) {
      user = await User.findOne({ username });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Update fields (DO NOT allow username change)
    if (fullName) user.fullName = fullName;

    // Handle profile image upload to Cloudinary if it's base64
    if (profileFields.profileImage && profileFields.profileImage.startsWith('data:image')) {
      console.log('Uploading image to Cloudinary...');
      try {
        const uploadResponse = await cloudinary.uploader.upload(profileFields.profileImage, {
          folder: 'agrivision_profiles',
          transformation: [
            { width: 500, height: 500, crop: "fill", gravity: "face" }
          ]
        });
        profileFields.profileImage = uploadResponse.secure_url;
        console.log('Image uploaded successfully:', uploadResponse.secure_url);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError.message);
        // Fallback or continue with previous image if upload fails
      }
    }

    console.log('Updating user fields:', Object.keys(profileFields));
    Object.assign(user, profileFields);
    await user.save();
    console.log('User profile updated in database.');

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ 
      success: true, 
      user: {
        ...userResponse,
        id: user._id
      } 
    });
  } catch (error) {
    console.error('Setup error details:', error);
    res.status(500).json({ success: false, error: 'Internal server error in setup' });
  }
};

export {
  registerUser,
  loginUser,
  setupProfile,
};
