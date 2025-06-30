/**
 * Sends a standard JSON response to the API.
 *
 * @param {object} res - Express response object
 * @param {number} httpStatus - HTTP status code (e.g. 200, 400)
 * @param {string} status - Internal status code (e.g. 'ok', 'missing_fields')
 * @param {string} message - Frontend readable message
 * @param {object|null} data - Optional payload with data (default: null)
 */
export function sendResponse(res, httpStatus, status, message, data = null) {
  return res.status(httpStatus).json({
    status,
    message,
    data,
  });
}
