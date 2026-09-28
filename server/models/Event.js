import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  eventDate: { type: Date, required: true },
  meetingUrl: { type: String, default: '' },
  registeredUserIds: [{ type: String }],
  registeredCount: { type: Number, default: 0 },
  bannerImageUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
