/**
 * Generates a random numeric code with the specified length.
 *
 * @param {number} length - Code length (e.g. 4, 6)
 * @returns {string} - Code as a numeric string
 */
export function generateCode(length = 6) {
  if (length < 1 || length > 10) {
    throw new Error('[E400] Longitud del código inválida (debe ser entre 1 y 10)')
  }

  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1

  const code = Math.floor(Math.random() * (max - min + 1)) + min
  return code.toString()
}
