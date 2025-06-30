/**
 * Sanitize and normalize a phone number so that it is in the Mexican international format.
 * 
 * Validation rules:
 * - If no number is provided, null is returned.
 * - Removes any non-digit or non-'+' characters.
 * - If it starts with '52' and has 12 digits, it assumes the international format without a '+'.
 *  → E.g.: "521234567890" → "+521234567890"
 * - If it has 10 digits, it assumes a national number and adds the international prefix '+52'.
 *  → E.g.: "1234567890" → "+521234567890"
 * - Otherwise (invalid format), null is returned.
 * 
 * @param {string} phoneNumber - Phone number to be sanitized
 * @returns {string|null} - Number in international format or null if invalid
 */
export default function sanitizePhone(phoneNumber) {

    // If no number is received, null is returned
    if (!phoneNumber) return null;

    // Remove non-numeric characters, except the "+" prefix
    const digitsOnly = phoneNumber.replace(/[^\d+]/g, '');

    // If it starts with '52' (without +) and has 12 digits, the '+' is added
    if (digitsOnly.startsWith('52') && digitsOnly.length === 12) {
        return `+${digitsOnly}`;
    }

    // If it has 10 digits (national format), '+52' is added
    if (digitsOnly.length === 10) {
        return `+52${digitsOnly}`;
    }

    // If it does not meet the accepted formats, return null
    return null;
}
