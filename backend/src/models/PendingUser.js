import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
  fullName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  otp: { type: String, required: true },
  otpExpires: { type: Date, required: true },
  isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-delete after 15 minutes
pendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);
export default PendingUser;
