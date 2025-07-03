import mongoose from 'mongoose';

const bannedPhoneSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  reason: {
    type: String,
    required: true
  },
  bannedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

bannedPhoneSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL

export const BannedPhone = mongoose.model('BannedPhone', bannedPhoneSchema);
