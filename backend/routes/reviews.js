const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/reviews
// @desc    Leave a review for a mentor
// @access  Private (Students)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mentorId, rating, comment } = req.body;

    if (!mentorId || !rating || !comment) {
      return res.status(400).json({ message: 'Mentor, rating, and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Prevent reviewing oneself
    if (mentor._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    // Check if the student has already reviewed this mentor
    const existingReview = await Review.findOne({ student: req.user._id, mentor: mentorId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this mentor' });
    }

    // Check if the student has had at least one completed session with this mentor
    const completedSession = await Session.findOne({
      student: req.user._id,
      mentor: mentorId,
      status: 'completed'
    });

    if (!completedSession) {
      return res.status(403).json({ message: 'You can only review mentors after completing a session with them' });
    }

    // Create and save review
    const review = new Review({
      mentor: mentorId,
      student: req.user._id,
      rating: Number(rating),
      comment,
    });

    await review.save();

    // Recalculate mentor's average rating
    const allReviews = await Review.find({ mentor: mentorId });
    const totalScore = allReviews.reduce((sum, item) => sum + item.rating, 0);
    const avgRating = parseFloat((totalScore / allReviews.length).toFixed(1));

    mentor.rating = avgRating;
    mentor.numReviews = allReviews.length;
    await mentor.save();

    const populatedReview = await Review.findById(review._id).populate('student', 'name email');

    res.status(201).json({
      review: populatedReview,
      updatedRating: avgRating,
      numReviews: allReviews.length,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error submitting review' });
  }
});

// @route   GET /api/reviews/mentor/:mentorId
// @desc    Get all reviews for a mentor
// @access  Public
router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const reviews = await Review.find({ mentor: req.params.mentorId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

module.exports = router;
