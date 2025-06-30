import { sanitizePhone } from '../utils/phoneSanitizer.js'
import { sendResponse } from '../utils/sendResponse.js'
import { parseError } from '../utils/parseError.js'
import { sendSms } from '../services/vonageSmsService.js'
import { generateCode } from '../utils/codeGenerator.js'

/**
 * Send an SMS with a generated code to the specified number
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendVerificationCode(req, res) {
  try {
    const phone = sanitizePhone(req.body.phone);

    if (!phone) {
      throw new Error('[E400] Invalid or missing phone number');
    }

    const code = generateCode(6) // código de 6 dígitos

    // 🔜 Aquí luego guardaremos en Mongo { phone, code, expiresAt }

    const message = `Tu código de verificación es: ${code}`
    await sendSms(phone, message)

    return sendResponse(res, 200, 'sms_sent', 'Código enviado correctamente')
  } catch (err) {
    const { statusCode, message } = parseError(err)
    return sendResponse(res, statusCode, 'sms_failed', message)
  }
}

/**
 * Verifica si el código ingresado por el usuario es correcto.
 * Este endpoint será funcional una vez implementes la persistencia.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function verifySmsCode(req, res) {
  try {
    const { phone, code } = req.body

    if (!phone || !code) {
      throw new Error('[E400] Se requiere número de teléfono y código')
    }

    // 🔜 Aquí luego consultarás en Mongo si el código es válido
    // const record = await VerificationCode.findOne({ phone, code })

    const valid = false // por ahora, sólo simulado

    if (!valid) {
      throw new Error('[S002] Código incorrecto o expirado')
    }

    return sendResponse(res, 200, 'sms_verified', 'Código verificado correctamente')
  } catch (err) {
    const { statusCode, message } = parseError(err)
    return sendResponse(res, statusCode, 'sms_verification_failed', message)
  }
}
