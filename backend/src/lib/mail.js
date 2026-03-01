import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email, otp, type = 'verification') => {
  const subject = type === 'verification' ? 'Email Verification - AgriVision' : 'Password Reset - AgriVision';
  const text = type === 'verification' 
    ? `Your verification code is ${otp}. It will expire in 10 minutes.`
    : `Your password reset code is ${otp}. It will expire in 10 minutes.`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #2e7d32; text-align: center;">AgriVision</h2>
      <p>Hello,</p>
      <p>${type === 'verification' ? 'Thank you for registering with AgriVision. Please use the following OTP to verify your email:' : 'We received a request to reset your password. Please use the following OTP to proceed:'}</p>
      <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2e7d32; border-radius: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2025 AgriVision Team. All rights reserved.</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"AgriVision Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
