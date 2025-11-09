const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// 📝 Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'All fields required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, passwordHash });
    await newUser.save();

    // ✅ Fetch saved user to ensure all fields are loaded
    const savedUser = await User.findById(newUser._id);

    const token = jwt.sign(
      { id: savedUser._id, name: savedUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        createdAt: savedUser.createdAt  // ✅ include join date
      }
    });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// 🔐 Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Missing fields' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        createdAt: user.createdAt  // ✅ also include here
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
