import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import mentorshipRoutes from './routes/mentorshipRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & Body Parsers
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB (or activate in-memory fallback)
connectDB();

// API Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Senior Connect API Server',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Register API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/mentors', mentorRoutes);
app.use('/api/v1/mentorships', mentorshipRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Senior Connect API Server listening on http://localhost:${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/v1/health`);
});
