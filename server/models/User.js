import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['JUNIOR', 'SENIOR', 'ADMIN'], default: 'JUNIOR' },
  department: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  company: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  availabilitySlots: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  karmaPoints: { type: Number, default: 10 },
  isVerified: { type: Boolean, default: true },
  avatar: { type: String, default: '' }
}, { timestamps: true });

userSchema.index({ role: 1, department: 1, skills: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);
