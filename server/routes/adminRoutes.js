import express from 'express';
import { memoryStore } from '../config/db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get platform stats (Admin overview)
router.get('/stats', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const totalUsers = memoryStore.users.length;
  const totalSeniors = memoryStore.users.filter(u => u.role === 'SENIOR').length;
  const totalJuniors = memoryStore.users.filter(u => u.role === 'JUNIOR').length;
  const totalMentorships = memoryStore.mentorships.length;
  const activeSessions = memoryStore.mentorships.filter(m => m.status === 'ACCEPTED' || m.status === 'PENDING').length;
  const totalResources = memoryStore.resources.length;
  const totalQuestions = memoryStore.questions.length;

  res.json({
    success: true,
    data: {
      totalUsers,
      totalSeniors,
      totalJuniors,
      totalMentorships,
      activeSessions,
      totalResources,
      totalQuestions
    }
  });
});

// Admin User Management - List all registered users
router.get('/users', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const sanitizedUsers = memoryStore.users.map(u => {
    const { passwordHash, ...rest } = u;
    return rest;
  });

  res.json({ success: true, count: sanitizedUsers.length, data: sanitizedUsers });
});

// Admin Moderation - Delete item (resource or question)
router.delete('/content/:type/:id', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { type, id } = req.params;

  if (type === 'resource') {
    memoryStore.resources = memoryStore.resources.filter(r => r._id !== id);
  } else if (type === 'question') {
    memoryStore.questions = memoryStore.questions.filter(q => q._id !== id);
  } else {
    return res.status(400).json({ success: false, message: 'Invalid content type.' });
  }

  res.json({ success: true, message: `${type} removed by administrator moderation.` });
});

export default router;
