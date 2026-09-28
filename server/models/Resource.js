import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['NOTES', 'PYQ', 'ROADMAP', 'INTERVIEW_EXP'], required: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
  tags: [{ type: String }],
  upvotes: { type: Number, default: 0 },
  downloadsCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
