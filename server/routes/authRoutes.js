import express from 'express';
import jwt from 'jsonwebtoken';
import { memoryStore } from '../config/db.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Register new student account
router.post('/register', (req, res) => {
  const { name, email, password, role, department, graduationYear, bio, skills } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  // Verify email domain format
  if (!email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  // Check if email already exists
  const existingUser = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
  }

  const newUser = {
    _id: `user_${Date.now()}`,
    name,
    email,
    passwordHash: `$2a$10$wN3eR2Z0kS1e4u9uX6G3yO2XN1M8Z.a1b2c3d4e5f6g7h8i9j0k1`,
    role: role || 'JUNIOR',
    department: department || 'CSE',
    graduationYear: parseInt(graduationYear) || 2027,
    bio: bio || 'Motivated student seeking mentorship and guidance.',
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['JavaScript']),
    company: role === 'SENIOR' ? 'Student Mentor' : '',
    linkedinUrl: '',
    githubUrl: '',
    availabilitySlots: ['Weekdays 5 PM - 7 PM'],
    averageRating: role === 'SENIOR' ? 5.0 : 0,
    totalSessions: 0,
    karmaPoints: 10,
    isVerified: true,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
  };

  memoryStore.users.push(newUser);

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { passwordHash, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    message: 'User registered successfully!',
    token,
    user: userWithoutPassword
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
  }

  const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { passwordHash, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: 'Login successful!',
    token,
    user: userWithoutPassword
  });
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  const user = memoryStore.users.find(u => u._id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { passwordHash, ...userWithoutPassword } = user;
  res.json({ success: true, user: userWithoutPassword });
});

// Update profile
router.put('/profile', authenticateToken, (req, res) => {
  const userIndex = memoryStore.users.findIndex(u => u._id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const updatedUser = {
    ...memoryStore.users[userIndex],
    ...req.body,
    _id: req.user.id // ensure ID cannot be altered
  };

  memoryStore.users[userIndex] = updatedUser;
  const { passwordHash, ...userWithoutPassword } = updatedUser;

  res.json({
    success: true,
    message: 'Profile updated successfully!',
    user: userWithoutPassword
  });
});

export default router;
