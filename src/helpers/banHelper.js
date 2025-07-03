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
    });
    return !!found;
}

/**
 * Bans a phone number for a period of time
 * @param {string} phone
 * @param {string} reason
 * @param {number} minutes
 */
export async function banPhone(phone, reason) {

    const existing = await BannedPhone.findOne({ phone });

    let minutes;
    if (!existing) {
        minutes = 15; // First time
    } else {
        const previousBan = existing.expiresAt.getTime() - existing.bannedAt.getTime();
        if (previousBan <= 15 * 60 * 1000) {
        minutes = 60; // Second Ban level (1 hour)
        } else {
        minutes = 1440; // Third ban level (24 hours)
        }
    }

    const now = new Date();
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    return await BannedPhone.findOneAndUpdate(
        { phone },
        { 
            reason,
            expiresAt,
            bannedAt: now
        },
        { upsert: true, new: true }
    );
}
