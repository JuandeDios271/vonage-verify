import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    select: false // Oculta por defecto
  },
  verified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  },
  // Opcionales para trazabilidad
  ip: String,
  userAgent: String
}, {
  timestamps: true
});

// TTL automático (opcional, si no está ya configurado)
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);
