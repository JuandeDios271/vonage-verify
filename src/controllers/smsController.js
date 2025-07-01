import { VerificationCode } from '../models/VerificationCode.js'
import { sanitizePhone } from '../utils/phoneSanitizer.js'
import { sendResponse } from '../utils/sendResponse.js'
import { parseError } from '../utils/parseError.js'
import { sendSms } from '../services/vonageSmsService.js'
import { generateCode } from '../utils/codeGenerator.js'
import logger from '../utils/logger.js'
import bcrypt from 'bcrypt';

/**
 * Send an SMS with a generated code to the specified number
 *
 * @param {import('express').Request} req - HTTP request that must include `phone` in the body
 * @param {import('express').Response} res - HTTP Response Object
 * 
 * @throws {Error} - In case of API invalid parameters
 * 
 * @returns {void}
 */
export async function sendVerificationCode(req, res) {
  try {

    const phoneNumber = sanitizePhone(req.body.phone);

    logger.info(`[sendVerificationCode] phone: ${phoneNumber}`);

    if (!phoneNumber) {

      throw new Error('[E400] Invalid or missing phone number');

    }

    // Limit: max 5 codes per IP or PhoneNumber every 5 minutes
    const recetAttempts = await VerificationCode.countDocuments({
      phone: phoneNumber,
      createdAt: { $gt: new Date( Date.now() - 5 * 60 * 1000) }
    });

    if ( recetAttempts >= 5 ) {

      throw new Error( '[E429] Too many requests for this number. Try later.' );

    }

    const code = generateCode(6); // código de 6 dígitos
    const expiresAt = new Date( Date.now() + 5 * 60 * 1000 );
    const message = `Your verification code is: ${code}`
    await sendSms(phoneNumber, message);

    /**
     * bcrypt library to hash the code
     * 
     * @link https://www.npmjs.com/package/bcrypt
     */
    const saltRounds = 10;
    const hashedCode = await bcrypt.hash(code, saltRounds);

    logger.info(`[sendVerificationCode->VerificationCode.create()] Payload to save: ${JSON.stringify({ phoneNumber, code, hashedCode, expiresAt })}`);
    await VerificationCode.create({
      phone: phoneNumber,
      code: hashedCode,
      expiresAt
    });

    return sendResponse(res, 200, 'sms_sent', 'Code sent successfully');

  } catch (err) {
    logger.error(`[sendVerificationCode] Error:' ${err}`);
    const { statusCode, message } = parseError(err);
    return sendResponse(res, statusCode, 'sms_failed', message);
  }
}

/**
 * Verifies that the code entered by the user is correct.
 * This endpoint will be functional once you implement persistence.
 *
 * @param {import('express').Request} req - HTTP request that must include `phone` and `code` in the body
 * @param {import('express').Response} res - HTTP Response Object
 * 
 * @throws {Error} - If invalid parameters or the code expires
 * 
 * @returns {void}
 */
export async function verifySmsCode(req, res) {
  try {
    const { phone, code } = req.body;

    logger.info(`[verifySmsCode] phone: ${phone}, code: ${code}`);

    const phoneNumber = sanitizePhone(phone);
    const codeTrimmed = code?.toString().trim();

    if (!phoneNumber || !codeTrimmed) {
      throw new Error('[E400] Phone number and code required');
    }

    if ( !/^\d{6}$/.test(codeTrimmed) ) {
      throw new Error('[E422] Code must be a 6-digit number');
    }

    // Search all valid codes (unused and not expired)
    const possibleCodes = await VerificationCode.find({
      phone: phoneNumber,
      used: false,
      expiresAt: { $gt: new Date() }
    }).select('+code');

    let matchedRecord = null;

    // Compare hashed with bcrypt
    for ( const record of possibleCodes ) {
      /**
       * Compare bcrypt
       * 
       * @link https://www.npmjs.com/package/bcrypt
       */
      const match = await bcrypt.compare( codeTrimmed, record.code );
      if ( match ) {
        matchedRecord = record;
        break;
      }
    }

    if (!matchedRecord) {
      throw new Error('[S002] Incorrect or expired code');
    }

    // Mark as used
    matchedRecord.used = true
    await matchedRecord.save();

    return sendResponse(res, 200, 'sms_verified', 'Code verified successfully');
  } catch (err) {

    logger.error(`[verifySmsCode] Error: ${err}`);
    const { statusCode, message } = parseError(err);
    return sendResponse(res, statusCode, 'sms_verification_failed', message);

  }
}
