import mongoose from 'mongoose';

const mentorshipSchema = new mongoose.Schema({
  juniorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  agenda: { type: String, required: true },
  preferredSlot: { type: String, required: true },
  meetingLink: { type: String, default: '' },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
  rejectionReason: { type: String, default: '' },
  scheduledAt: { type: Date }
}, { timestamps: true });

export default mongoose.models.Mentorship || mongoose.model('Mentorship', mentorshipSchema);
