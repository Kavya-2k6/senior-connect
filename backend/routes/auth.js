const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretjwtkey_seniorconnect_2024', {
    expiresIn: '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new student or mentor
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, bio, domain, skills, company, experienceYears } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      bio: bio || '',
      domain: domain || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s) => s.trim()) : []),
      company: company || '',
      experienceYears: experienceYears || 0,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Return user info and token (excluding password)
    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        bio: newUser.bio,
        domain: newUser.domain,
        skills: newUser.skills,
        company: newUser.company,
        experienceYears: newUser.experienceYears,
        isAvailable: newUser.isAvailable,
        rating: newUser.rating,
        numReviews: newUser.numReviews,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login existing user & return JWT
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        domain: user.domain,
        skills: user.skills,
        company: user.company,
        experienceYears: user.experienceYears,
        isAvailable: user.isAvailable,
        rating: user.rating,
        numReviews: user.numReviews,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get currently logged-in user profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile & availability
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, domain, skills, company, experienceYears, isAvailable } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (domain !== undefined) user.domain = domain;
    if (company !== undefined) user.company = company;
    if (experienceYears !== undefined) user.experienceYears = experienceYears;
    if (isAvailable !== undefined) user.isAvailable = isAvailable;

    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;
