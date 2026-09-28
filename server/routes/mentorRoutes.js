import express from 'express';
import { memoryStore } from '../config/db.js';

const router = express.Router();

// Fetch mentors list with filtering & search
router.get('/', (req, res) => {
  const { search, department, skill, year } = req.query;

  let mentors = memoryStore.users.filter(u => u.role === 'SENIOR');

  if (department && department !== 'ALL') {
    mentors = mentors.filter(m => m.department.toLowerCase() === department.toLowerCase());
  }

  if (year && year !== 'ALL') {
    mentors = mentors.filter(m => m.graduationYear === parseInt(year));
  }

  if (skill) {
    mentors = mentors.filter(m => 
      m.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  if (search) {
    const q = search.toLowerCase();
    mentors = mentors.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.bio.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  // Remove passwords before returning
  const sanitizedMentors = mentors.map(m => {
    const { passwordHash, ...rest } = m;
    return rest;
  });

  res.json({
    success: true,
    count: sanitizedMentors.length,
    data: sanitizedMentors
  });
});

// Fetch mentor profile detail by ID
router.get('/:id', (req, res) => {
  const mentor = memoryStore.users.find(u => u._id === req.params.id && u.role === 'SENIOR');

  if (!mentor) {
    return res.status(404).json({ success: false, message: 'Mentor not found.' });
  }

  const { passwordHash, ...mentorProfile } = mentor;
  res.json({ success: true, data: mentorProfile });
});

export default router;
