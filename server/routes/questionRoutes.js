import express from 'express';
import { memoryStore } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get questions list
router.get('/', (req, res) => {
  const { tag, search } = req.query;
  let questions = [...memoryStore.questions];

  if (tag && tag !== 'ALL') {
    questions = questions.filter(q => q.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }

  if (search) {
    const qry = search.toLowerCase();
    questions = questions.filter(q => 
      q.title.toLowerCase().includes(qry) ||
      q.content.toLowerCase().includes(qry) ||
      q.tags.some(t => t.toLowerCase().includes(qry))
    );
  }

  res.json({ success: true, count: questions.length, data: questions });
});

// Post question
router.post('/', authenticateToken, (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Question title and content are required.' });
  }

  const newQuestion = {
    _id: `q_${Date.now()}`,
    authorId: req.user.id,
    authorName: req.user.name,
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title,
    content,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['General']),
    upvotes: 0,
    isSolved: false,
    acceptedAnswerId: null,
    answers: [],
    createdAt: new Date().toISOString()
  };

  memoryStore.questions.unshift(newQuestion);

  res.status(201).json({
    success: true,
    message: 'Question posted successfully!',
    data: newQuestion
  });
});

// Post answer to a question
router.post('/:id/answers', authenticateToken, (req, res) => {
  const { content } = req.body;
  const question = memoryStore.questions.find(q => q._id === req.params.id);

  if (!question) {
    return res.status(404).json({ success: false, message: 'Question thread not found.' });
  }

  if (!content) {
    return res.status(400).json({ success: false, message: 'Answer content cannot be empty.' });
  }

  const newAnswer = {
    _id: `ans_${Date.now()}`,
    authorId: req.user.id,
    authorName: req.user.name,
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    content,
    upvotes: 0,
    isAccepted: false,
    createdAt: new Date().toISOString()
  };

  question.answers.push(newAnswer);

  // Notify question author
  if (question.authorId !== req.user.id) {
    memoryStore.notifications.unshift({
      _id: `notif_${Date.now()}`,
      recipientId: question.authorId,
      type: 'ANSWER_POSTED',
      message: `${req.user.name} answered your question: "${question.title.substring(0, 40)}..."`,
      targetUrl: '/questions',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.status(201).json({
    success: true,
    message: 'Answer posted successfully!',
    data: newAnswer
  });
});

// Upvote question
router.post('/:id/upvote', authenticateToken, (req, res) => {
  const question = memoryStore.questions.find(q => q._id === req.params.id);

  if (!question) {
    return res.status(404).json({ success: false, message: 'Question not found.' });
  }

  question.upvotes += 1;
  res.json({ success: true, upvotes: question.upvotes });
});

export default router;
