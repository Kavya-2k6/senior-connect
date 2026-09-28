import express from 'express';
import { memoryStore } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create new mentorship session request
router.post('/request', authenticateToken, (req, res) => {
  const { mentorId, topic, agenda, preferredSlot } = req.body;

  if (!mentorId || !topic || !agenda) {
    return res.status(400).json({ success: false, message: 'Mentor, topic, and agenda are required.' });
  }

  const mentor = memoryStore.users.find(u => u._id === mentorId);
  if (!mentor) {
    return res.status(404).json({ success: false, message: 'Target mentor not found.' });
  }

  const newRequest = {
    _id: `m_req_${Date.now()}`,
    juniorId: req.user.id,
    juniorName: req.user.name,
    juniorEmail: req.user.email,
    mentorId: mentor._id,
    mentorName: mentor.name,
    topic,
    agenda,
    preferredSlot: preferredSlot || 'Flexible',
    meetingLink: '',
    status: 'PENDING',
    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  };

  memoryStore.mentorships.unshift(newRequest);

  // Push notification for mentor
  memoryStore.notifications.unshift({
    _id: `notif_${Date.now()}`,
    recipientId: mentor._id,
    type: 'REQUEST_RECEIVED',
    message: `${req.user.name} sent you a mentorship request on "${topic}"`,
    targetUrl: '/dashboard',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    message: 'Mentorship request submitted successfully!',
    data: newRequest
  });
});

// Get logged-in user's requests (both as junior and senior)
router.get('/my-requests', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const requests = memoryStore.mentorships.filter(
    m => m.juniorId === userId || m.mentorId === userId
  );

  res.json({ success: true, count: requests.length, data: requests });
});

// Update request status (ACCEPTED / REJECTED / COMPLETED)
router.patch('/:id/status', authenticateToken, (req, res) => {
  const { status, meetingLink, rejectionReason } = req.body;
  const request = memoryStore.mentorships.find(m => m._id === req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Mentorship request not found.' });
  }

  if (request.mentorId !== req.user.id && request.juniorId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Unauthorized to update this request.' });
  }

  if (status) request.status = status;
  if (meetingLink) request.meetingLink = meetingLink;
  if (rejectionReason) request.rejectionReason = rejectionReason;

  if (status === 'ACCEPTED') {
    memoryStore.notifications.unshift({
      _id: `notif_${Date.now()}`,
      recipientId: request.juniorId,
      type: 'REQUEST_ACCEPTED',
      message: `${request.mentorName} accepted your request on "${request.topic}"!`,
      targetUrl: '/dashboard',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    message: `Request status updated to ${status}.`,
    data: request
  });
});

export default router;
