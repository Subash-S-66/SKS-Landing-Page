const User = require('../models/User');
const LoginAttempt = require('../models/LoginAttempt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { username, password, honeypot } = req.body;

    // Honeypot check
    if (honeypot) {
      return res.status(400).json({ error: 'Bot detected' });
    }

    const ip = req.ip || req.connection.remoteAddress;

    const recentAttempts = await LoginAttempt.find({ ip, timestamp: { $gte: new Date(Date.now() - 30 * 60 * 1000) } });
    const failedAttempts = recentAttempts.filter(a => !a.success);

    if (failedAttempts.length >= 5) {
      return res.status(429).json({ error: 'Account locked out. Please try again later.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      await LoginAttempt.create({ ip, success: false });
      return res.status(401).json({ error: 'Invalid credentials', remainingAttempts: 4 - failedAttempts.length });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await LoginAttempt.create({ ip, success: false });
      return res.status(401).json({ error: 'Invalid credentials', remainingAttempts: 4 - failedAttempts.length });
    }

    await LoginAttempt.create({ ip, success: true });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set HTTP-Only Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const verifyToken = async (req, res) => {
  res.json({ valid: true, user: req.user });
};

module.exports = { login, verifyToken };
