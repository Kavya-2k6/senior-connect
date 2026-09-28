const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/sessions
// @desc    Book a new mentorship session
// @access  Private (Students & Mentors)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mentorId, topic, date, time, notes } = req.body;

    if (!mentorId || !topic || !date || !time) {
      return res.status(400).json({ message: 'Please provide mentor, topic, date, and time' });
    }

    if (req.user.role === 'mentor') {
      return res.status(403).json({ message: 'Mentors cannot book sessions with other mentors' });
    }

    // Verify mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if mentor is already booked for this slot
    const existingSession = await Session.findOne({
      mentor: mentorId,
      date,
      time,
      status: { $ne: 'cancelled' } // Treat 'upcoming' and 'completed' as occupying the slot
    });

    if (existingSession) {
      return res.status(400).json({ message: 'This mentor is already booked for this specific date and time.' });
    }

    // Create session
    const session = new Session({
      student: req.user._id,
      mentor: mentorId,
      topic,
      date,
      time,
      notes: notes || '',
      meetingLink: `https://meet.google.com/senior-${Math.random().toString(36).substring(2, 7)}`,
    });

    await session.save();

    // Populate user info for response
    const populatedSession = await Session.findById(session._id)
      .populate('mentor', 'name email company domain')
      .populate('student', 'name email');

    res.status(201).json(populatedSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Server error booking session' });
  }
});

// @route   GET /api/sessions/my
// @desc    Get all sessions for the logged-in user (as student or mentor)
// @access  Private
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const query = req.user.role === 'mentor' 
      ? { mentor: req.user._id } 
      : { student: req.user._id };

    const sessions = await Session.find(query)
      .populate('mentor', 'name email company domain skills rating')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
});

// @route   GET /api/sessions/stats
// @desc    Get dashboard statistics for current user
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const query = req.user.role === 'mentor' 
      ? { mentor: req.user._id } 
      : { student: req.user._id };

    const totalSessions = await Session.countDocuments(query);
    const upcomingSessions = await Session.countDocuments({ ...query, status: 'upcoming' });
    const completedSessions = await Session.countDocuments({ ...query, status: 'completed' });
    const cancelledSessions = await Session.countDocuments({ ...query, status: 'cancelled' });

    res.json({
      totalSessions,
      upcomingSessions,
      completedSessions,
      cancelledSessions,
      rating: req.user.rating || 0,
      numReviews: req.user.numReviews || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

// @route   PUT /api/sessions/:id/status
// @desc    Update session status (e.g., cancel or complete)
// @access  Private
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['upcoming', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is either student or mentor for this session
    const isAuthorized = 
      session.student.toString() === req.user._id.toString() ||
      session.mentor.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to modify this session' });
    }

    session.status = status;
    await session.save();

    res.json(session);
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ message: 'Server error updating session status' });
  }
});

// @route   PUT /api/sessions/:id/notes
// @desc    Add or update session notes
// @access  Private
router.put('/:id/notes', authMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const isAuthorized = 
      session.student.toString() === req.user._id.toString() ||
      session.mentor.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to modify this session' });
    }

    session.notes = notes;
    await session.save();

    res.json(session);
  } catch (error) {
    console.error('Error updating session notes:', error);
    res.status(500).json({ message: 'Server error updating session notes' });
  }
});

module.exports = router;
