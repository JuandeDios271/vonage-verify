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

    // Map codes to HTTP status
    const statusCode = code.startsWith('E4') || code.startsWith('V') ? 400 : 500

    return { code, message, statusCode }
  }

  return {
    code: null,
    message: rawMessage,
    statusCode: 500,
  }
}
