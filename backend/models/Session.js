const mongoose = require('mongoose');

// Define Schema for Mentorship Sessions
const sessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    time: {
      type: String, // Format: e.g. "14:00" or "02:00 PM"
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    notes: {
      type: String,
      default: '',
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/xyz-senior-connect',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Session', sessionSchema);
