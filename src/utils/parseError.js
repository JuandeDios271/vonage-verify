/**
 * Parse an error message in the format "[E400] Error Message"
 *
 * @param {Error|string} err - Error object or raw error message
 * 
 * @returns {{ code: string|null, message: string, statusCode: number }}
 */
export function parseError(err) {
  const rawMessage = typeof err === 'string' ? err : err.message || 'Unknown error'

  const match = rawMessage.match(/^\[([A-Z0-9]+)\]\s*(.*)$/)

  if (match) {
    const code = match[1]
    const message = match[2] || 'Unknown error'

    let statusCode = 500
    if (code === 'E403') statusCode = 403
    else if (code === 'E429') statusCode = 429
    else if (code.startsWith('E4') || code.startsWith('V')) statusCode = 400

    return { code, message, statusCode }
  }

  return {
    code: null,
    message: rawMessage,
    statusCode: 500,
  }
}
