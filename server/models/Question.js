import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  isAccepted: { type: Boolean, default: false }
}, { timestamps: true });

const questionSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  upvotes: { type: Number, default: 0 },
  isSolved: { type: Boolean, default: false },
  acceptedAnswerId: { type: String, default: null },
  answers: [answerSchema]
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
