// This controller handles authentication-related operations for Attendx.
// It includes functions for user registration, login, forgot password, and reset password.
// - register: Creates a new user account, hashes the password, and saves to DB.
// - login: Verifies user credentials and returns a JWT token if valid.
// - forgotPassword: Generates a reset token and sends a reset link via email.
// - resetPassword: Validates the reset token and updates the user's password.
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// 🔐 REGISTER
exports.register = async (req, res) => {
  const { fullName, email, password, role, matricNumber, department } = req.body;

  try {
    // 1. Validate Matric Number (Students only)
    if (role === 'student') {
        const letters = (matricNumber.match(/[a-zA-Z]/g) || []).length;
        const digits = (matricNumber.match(/[0-9]/g) || []).length;
        if (letters !== 5 || digits !== 6 || matricNumber.length !== 11) {
            return res.status(400).json({ message: 'Matric number must contain exactly 5 letters and 6 numbers (11 characters total)' });
        }
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user (Verified by default)
    const user = await User.create({
      name: fullName,
      email,
      password: hashedPassword,
      role,
      matric: matricNumber || null,
      department: department || null,
      isVerified: true
    });

    res.status(201).json({ 
        message: 'Registration successful! You can now log in.', 
        userId: user._id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  const { email, password, role, matric } = req.body;

  try {
    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (role && user.role !== role) {
      return res.status(400).json({ message: `Account is registered as a ${user.role}. Please select the correct role.` });
    }

    if (user.role === 'student' && (!matric || user.matric?.toLowerCase() !== matric?.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📧 FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    // Always respond with success to avoid email enumeration
    if (!user) {
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Build reset URL pointing to the frontend
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Send email via nodemailer
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Attendx" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request — Attendx',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; border-radius: 12px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">Reset Your Password</h2>
          <p style="color: #374151;">Hi ${user.name},</p>
          <p style="color: #374151;">We received a request to reset your Attendx password. Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background: #4f46e5; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 13px;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">Attendx — Smart Attendance System</p>
        </div>
      `,
    });

    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// 🔑 RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
