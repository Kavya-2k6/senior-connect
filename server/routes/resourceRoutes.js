import express from 'express';
import { memoryStore } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Fetch resources with filters
router.get('/', (req, res) => {
  const { category, department, semester, search } = req.query;

  let resources = [...memoryStore.resources];

  if (category && category !== 'ALL') {
    resources = resources.filter(r => r.category === category);
  }

  if (department && department !== 'ALL') {
    resources = resources.filter(r => r.department.toLowerCase() === department.toLowerCase());
  }

  if (semester && semester !== 'ALL') {
    resources = resources.filter(r => r.semester === parseInt(semester));
  }

  if (search) {
    const q = search.toLowerCase();
    resources = resources.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: resources.length, data: resources });
});

// Upload new resource
router.post('/', authenticateToken, (req, res) => {
  const { title, category, department, semester, description, fileUrl, tags } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ success: false, message: 'Title, category, and description are required.' });
  }

  const newResource = {
    _id: `res_${Date.now()}`,
    title,
    uploaderId: req.user.id,
    uploaderName: req.user.name,
    category: category || 'NOTES',
    department: department || 'CSE',
    semester: parseInt(semester) || 4,
    description,
    fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['General']),
    upvotes: 0,
    downloadsCount: 1,
    createdAt: new Date().toISOString()
  };

  memoryStore.resources.unshift(newResource);

  res.status(201).json({
    success: true,
    message: 'Resource uploaded successfully!',
    data: newResource
  });
});

// Upvote resource
router.post('/:id/upvote', authenticateToken, (req, res) => {
  const resource = memoryStore.resources.find(r => r._id === req.params.id);

  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found.' });
  }

  resource.upvotes += 1;

  res.json({
    success: true,
    message: 'Resource upvoted!',
    upvotes: resource.upvotes
  });
});

export default router;
