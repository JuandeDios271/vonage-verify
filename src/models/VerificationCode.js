import mongoose from 'mongoose'

const verificationCodeSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false }
}, {
    timestamps: true
})

verificationCodeSchema.index({ phone: 1, code: 1 }); // Para búsqueda eficiente
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL automático

export const VerificationCode = mongoose.model( 'VerificationCode', verificationCodeSchema );
