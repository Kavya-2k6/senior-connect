const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect private routes
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_seniorconnect_2024');

    // Attach user information to request (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found or invalid token' });
    }

    req.user = user;
    next(); // Move to the next route handler
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};

module.exports = authMiddleware;
