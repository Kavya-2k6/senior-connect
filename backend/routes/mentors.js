const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');

// @route   GET /api/mentors
// @desc    Get all mentors with optional search and filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, skill, domain } = req.query;

    let query = { role: 'mentor' };

    // Search by mentor name or bio keyword
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by domain
    if (domain) {
      query.domain = { $regex: domain, $options: 'i' };
    }

    // Filter by skill
    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    const mentors = await User.find(query).select('-password').sort({ rating: -1, createdAt: -1 });

    res.json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ message: 'Server error fetching mentors' });
  }
});

// @route   GET /api/mentors/:id
// @desc    Get mentor profile details and their reviews
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id).select('-password');
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Fetch reviews for this mentor
    const reviews = await Review.find({ mentor: mentor._id })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      mentor,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching mentor details:', error);
    res.status(500).json({ message: 'Server error fetching mentor profile' });
  }
});

module.exports = router;
