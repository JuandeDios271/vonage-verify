import { sanitizePhone } from '../utils/phoneSanitizer.js';
import { sendResponse } from '../utils/sendResponse.js';
import { parseError } from '../utils/parseError.js';
import { sendSms } from '../services/vonageSmsService.js';
import { generateCode } from '../utils/codeGenerator.js';
import { sendCodeSchema, verifyCodeSchema } from '../validators/smsValidator.js';
import { isRateLimited, storeVerificationCode, verifyCode } from '../helpers/smsVerificationHelper.js';
import { isPhoneBanned } from '../helpers/banHelper.js'; // al inicio del archivo
import logger from '../utils/logger.js';

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
    // Validar entrada con Zod
    const validation = sendCodeSchema.safeParse(req.body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid input';
      throw new Error(`[E422] ${firstError}`);
    }

    const phoneNumber = sanitizePhone(validation.data.phone);
    if (!phoneNumber) {
      throw new Error('[E400] Invalid or missing phone number');
    }

    if (await isPhoneBanned(phoneNumber)) {
      throw new Error('[E403] This phone number is temporarily banned');
    }

    logger.info(`[sendVerificationCode] phone: ${phoneNumber}`);

    // Limitar por intentos recientes
    if (await isRateLimited(phoneNumber)) {
      throw new Error('[E429] Too many requests for this number. Try later.');
    }

    const code = generateCode(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await sendSms(phoneNumber, `Tu codigo de verificacion para Nexyo es: ${code}. No lo compartas con nadie.`);
    logger.info(`[sendVerificationCode] SMS sent to: ${phoneNumber}`);

    await storeVerificationCode(phoneNumber, code, expiresAt);
    logger.info(`[sendVerificationCode] Code stored in MongoDB`);

    return sendResponse(res, 200, 'sms_sent', 'Code sent successfully');
  } catch (err) {
    logger.error(`[sendVerificationCode] Error: ${err}`);
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
    const validation = verifyCodeSchema.safeParse(req.body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid input';
      throw new Error(`[E422] ${firstError}`);
    }

    const phoneNumber = sanitizePhone(validation.data.phone);
    const code = validation.data.code;

    if (!phoneNumber || !code) {
      throw new Error('[E400] Phone number and code required');
    }

    if (await isPhoneBanned(phoneNumber)) {
      throw new Error('[E403] This phone number is temporarily banned');
    }

    logger.info(`[verifySmsCode] phone: ${phoneNumber}, code: ${code}`);

    const valid = await verifyCode(phoneNumber, code);

    if (!valid) {
      throw new Error('[S002] Incorrect or expired code');
    }

    return sendResponse(res, 200, 'sms_verified', 'Code verified successfully');
  } catch (err) {
    logger.error(`[verifySmsCode] Error: ${err}`);
    const { statusCode, message } = parseError(err);
    return sendResponse(res, statusCode, 'sms_verification_failed', message);
  }
}
