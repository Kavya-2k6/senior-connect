import express from 'express';
import { memoryStore } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Fetch events list
router.get('/', (req, res) => {
  res.json({ success: true, count: memoryStore.events.length, data: memoryStore.events });
});

// Create new workshop event (Seniors/Admin only)
router.post('/', authenticateToken, (req, res) => {
  const { title, description, eventDate, meetingUrl, bannerImageUrl } = req.body;

  if (!title || !description || !eventDate) {
    return res.status(400).json({ success: false, message: 'Title, description, and event date are required.' });
  }

  const newEvent = {
    _id: `evt_${Date.now()}`,
    title,
    hostId: req.user.id,
    hostName: `${req.user.name} (${req.user.role === 'SENIOR' ? 'Senior Mentor' : 'Admin'})`,
    description,
    eventDate,
    meetingUrl: meetingUrl || 'https://meet.google.com/abc-defg-hij',
    registeredUserIds: [],
    registeredCount: 0,
    bannerImageUrl: bannerImageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  };

  memoryStore.events.unshift(newEvent);

  res.status(201).json({
    success: true,
    message: 'Campus event created successfully!',
    data: newEvent
  });
});

// RSVP / Register for event
router.post('/:id/register', authenticateToken, (req, res) => {
  const event = memoryStore.events.find(e => e._id === req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  if (event.registeredUserIds.includes(req.user.id)) {
    return res.status(400).json({ success: false, message: 'You are already registered for this event!' });
  }

  event.registeredUserIds.push(req.user.id);
  event.registeredCount += 1;

  res.json({
    success: true,
    message: 'Registered for event successfully!',
    registeredCount: event.registeredCount
  });
});

export default router;
