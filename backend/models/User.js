const mongoose = require('mongoose');

// Define Schema for Users (both Students and Mentors)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'mentor'],
      default: 'student',
    },
    // Mentor-specific profile details
    bio: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      default: '', // e.g., 'Web Development', 'AI/ML', 'Cloud Computing'
    },
    skills: {
      type: [String],
      default: [], // e.g., ['React', 'Node.js', 'System Design']
    },
    company: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
