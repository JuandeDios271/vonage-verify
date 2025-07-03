import { BannedPhone } from '../models/BannedPhone.js'

/**
 * Checks if the phone is currently banned
 * @param {string} phone
 * @returns {Promise<boolean>}
 */
export async function isPhoneBanned(phone) {
  const found = await BannedPhone.findOne({
    phone,
    expiresAt: { $gt: new Date() }
  })
  return !!found
}

/**
 * Bans a phone number for a period of time
 * @param {string} phone
 * @param {string} reason
 * @param {number} minutes
 */
export async function banPhone(phone, reason, minutes = 60) {
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000)

  return await BannedPhone.findOneAndUpdate(
    { phone },
    { reason, expiresAt, bannedAt: new Date() },
    { upsert: true, new: true }
  )
}
