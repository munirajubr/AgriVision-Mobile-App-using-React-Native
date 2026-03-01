import User from '../models/User.js';
import PendingUser from '../models/PendingUser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../lib/cloudinary.js';
import { sendOTP } from '../lib/mail.js';

// Helper to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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
    const existingUser = await User.findOne({ email: emailNormalized });

    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ success: false, error: 'Email already exists and is verified' });
    }

    // Generate unique username and OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create or Update Pending Registration
    // DO NOT hash here, let User model do it on final save to keep things consistent
    // or hash here if you prefer. User model has a pre-save hook that will hash it on User.save()
    // So if we save the plain password in PendingUser, it will be hashed when we finally create the User.
    await PendingUser.findOneAndUpdate(
      { email: emailNormalized },
      { 
        fullName, 
        email: emailNormalized, 
        password, 
        otp, 
        otpExpires 
      },
      { upsert: true, new: true }
    );

    console.log(`[Auth] OTP generated for ${emailNormalized}: ${otp}`);

    // Send the email
    const emailSent = await sendOTP(emailNormalized, otp, 'verification');

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email. Please check your email address and try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email.',
      email: emailNormalized
    });
  } catch (error) {
    console.error('[Register] Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

// -- Verify Email OTP --
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    }

    const emailNormalized = email.toLowerCase().trim();

    // 1. Find Pending data
    const pending = await PendingUser.findOne({ 
      email: emailNormalized,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!pending) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // 2. Finalize registration: Create or Update User
    let user = await User.findOne({ email: emailNormalized });

    if (!user) {
      const username = await generateUniqueUsername(pending.fullName);
      const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
      
      user = new User({
        fullName: pending.fullName,
        username,
        email: emailNormalized,
        password: pending.password,
        profileImage,
        isVerified: true
      });
    } else {
      user.fullName = pending.fullName;
      user.password = pending.password;
      user.isVerified = true;
    }

    await user.save();
    
    // 3. Cleanup pending entry
    await PendingUser.deleteOne({ _id: pending._id });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Account created and verified successfully',
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
    console.error('[VerifyEmail] Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};


// -- Resend Verification OTP --
const resendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });
    const emailNormalized = email.toLowerCase().trim();

    // 1. If user is already verified, stop
    const user = await User.findOne({ email: emailNormalized });
    if (user && user.isVerified) return res.status(400).json({ success: false, error: 'Email already verified' });

    // 2. Check for pending registration
    let pending = await PendingUser.findOne({ email: emailNormalized });
    
    // Fallback for legacy unverified users in User collection
    if (!pending && user && !user.isVerified) {
      pending = new PendingUser({
        fullName: user.fullName,
        email: emailNormalized,
        password: user.password, // This will be hashed, but User.save will re-hash if we're not careful later. But for OTP resending it's fine.
        otp: generateOTP(),
        otpExpires: new Date(Date.now() + 10 * 60 * 1000)
      });
    }

    if (!pending) {
      return res.status(404).json({ success: false, error: 'No unverified registration found. Please sign up first.' });
    }

    const otp = generateOTP();
    pending.otp = otp;
    pending.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await pending.save();

    const emailSent = await sendOTP(emailNormalized, otp, 'verification');
    if (!emailSent) {
      return res.status(500).json({ success: false, error: 'Failed to send verification email.' });
    }

    res.status(200).json({ success: true, message: 'New verification code sent to your email.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
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

    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        error: 'Email not verified', 
        notVerified: true,
        email: user.email 
      });
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

// -- Forgot Password (Send OTP) --
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`[Auth] Sending forgot password OTP to: ${user.email}`);
    await sendOTP(user.email, otp, 'reset');

    res.status(200).json({ success: true, message: 'Password reset code sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// -- Verify Reset OTP --
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, error: 'Email and OTP are required' });

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// -- Reset Password --
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export {
  registerUser,
  loginUser,
  setupProfile,
  verifyEmail,
  resendVerificationOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};
