// This controller handles authentication-related operations for Attendx.
// It includes functions for user registration and login.
// - register: Creates a new user account, hashes the password, and saves to DB.
// - login: Verifies user credentials and returns a JWT token if valid.
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  const { email, password } = req.body;

  try {
    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

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
