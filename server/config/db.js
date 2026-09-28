import mongoose from 'mongoose';
import { seedUsers, seedMentorships, seedResources, seedQuestions, seedEvents } from '../data/seedData.js';

export let isInMemoryDB = false;

// Memory storage store when MongoDB is not connected locally
export const memoryStore = {
  users: [...seedUsers],
  mentorships: [...seedMentorships],
  resources: [...seedResources],
  questions: [...seedQuestions],
  events: [...seedEvents],
  notifications: [
    {
      _id: "notif_1",
      recipientId: "user_junior_1",
      type: "REQUEST_ACCEPTED",
      message: "Aravind Sharma accepted your mentorship request!",
      targetUrl: "/dashboard",
      isRead: false,
      createdAt: "2026-08-04T14:25:00.000Z"
    }
  ]
};

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/senior_connect';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ MongoDB Connected Successfully');
    isInMemoryDB = false;
  } catch (err) {
    console.log('⚠️ MongoDB not running locally. Switching to Senior Connect In-Memory Fallback Adapter...');
    isInMemoryDB = true;
    console.log(`ℹ️ Seeded ${memoryStore.users.length} Users, ${memoryStore.resources.length} Resources, ${memoryStore.questions.length} Questions & ${memoryStore.events.length} Events into memory.`);
  }
};
