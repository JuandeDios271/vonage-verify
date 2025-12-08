import { VerificationCode } from '../models/VerificationCode.js';
import { banPhone } from './banHelper.js';
import bcrypt from 'bcrypt';

/**
 * Save a new hashed code to MongoDB
 * 
 * @param {string} phone - Phone formatted with +52
 * @param {string} code - 6-digit code (no hash)
 * @param {Date} expiresAt - Code expiration time
 * @returns {Promise<void>}
 */
export async function storeVerificationCode(phone, code, expiresAt) {

  /**
   * bcrypt library to hash the code
   * 
   * @link https://www.npmjs.com/package/bcrypt
   */
  const saltRounds = 10;
  const hashedCode = await bcrypt.hash(code, saltRounds);

  // 🔐 Verificar número de códigos recientes antes de guardar
  const recentCount = await VerificationCode.countDocuments({
    phone,
    createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // últimos 5 minutos
  });

  if (recentCount >= 5) {
    await banPhone(phone, 'Too many code requests in short time'); // 1 hora
    throw new Error('[E429] Too many requests. Phone temporarily banned.');
  }

  await VerificationCode.create({
    phone,
    code: hashedCode,
    expiresAt
  });
}

/**
 * Verifica si existen demasiados intentos recientes para este número
 * 
 * @param {string} phone - Phone
 * @param {number} limit - Maximum attempts allowed
 * @param {number} windowMinutes - Time window in minutes
 * @returns {Promise<boolean>} - true if it exceeds the limit
 */
export async function isRateLimited(phone, limit = 5, windowMinutes = 5) {
  const recentAttempts = await VerificationCode.countDocuments({
    phone,
    createdAt: { $gt: new Date(Date.now() - windowMinutes * 60 * 1000) }
  });

  const exceeded = recentAttempts >= limit;

  if (exceeded) {
    await banPhone(phone, 'Too many SMS requests'); // baneo por 1 hora
  }

  return exceeded;
}

/**
 * Search for valid codes and compare with bcrypt
 * 
 * @param {string} phone - Phone
 * @param {string} code - Unhashed code
 * @returns {Promise<boolean>} - true if the code is correct
 */
export async function verifyCode(phone, code) {
  const possibleCodes = await VerificationCode.find({
    phone,
    verified: false,
    expiresAt: { $gt: new Date() }
  }).select('+code');

  for (const record of possibleCodes) {

    /**
     * bcrypt library to hash the code
     * 
     * @link https://www.npmjs.com/package/bcrypt
     */
    const match = await bcrypt.compare(code, record.code)
    if (match) {
      record.verified = true;
      await record.save();
      return true;
    }
  }

  // No match found → count recent failed attempts
  const recentFailures = await VerificationCode.countDocuments({
    phone,
    verified: false,
    expiresAt: { $gt: new Date() }
  });

  if (recentFailures >= 5) {
    await banPhone(phone, 'Too many failed verifications'); // 1 hora
  }

  return false;
}
