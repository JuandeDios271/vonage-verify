// Import the official Express CORS dependency
import cors from 'cors';

/**
 * List of allowed origins, defined in the CORS_ORIGINS environment variable.
 * Converted to an array, removing unnecessary spaces.
 */
const allowedOrigins = process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || [];

// HTTP allowed methods
const allowedMethods = ['GET', 'POST', 'OPTIONS'];

/**
 * CORS options delegator.
 * 
 * This function runs for each request and determines if the origin is allowed.
 *  - If there is no 'origin' (e.g., tools like Postman or curl), allow the request.
 *  - If the origin is in the allowlist, allow the request.
 *  - If not, raise an error that will be handled by subsequent middleware.
 * 
 * @param {import('express').Request} req - HTTP request object
 * @param {function(Error|null, import('cors').CorsOptions|null): void} callback - Callback that defines the result of the source analysis
 * 
 * @returns {void}
 */
const corsOptionsDelegate = function (req, callback) {
  const origin = req.header('Origin');

  // Allow requests without 'Origin' (e.g. from Postman or curl)
  if (!origin) {
    return callback(null, {
      origin: false,
      methods: allowedMethods,
      credentials: true
    });
  }

  // Allow if the origin is whitelisted or if the origin allows '*'
  if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
    return callback(null, {
      origin: true,
      methods: allowedMethods,
      credentials: true
    });
  }

  // Reject the origin if not allowed
  return callback(new Error('CORS_ORIGIN_NOT_ALLOWED'), null);
};

// Actual CORS middleware using the above options
const corsMiddleware = cors(corsOptionsDelegate);

/**
 * Middleware to handle CORS errors when an origin is not allowed.
 * Returns a clear, detailed response to the client.
 * 
 * @param {Error} err - Error object received by the middleware (automatically routed by Express)
 * @param {import('express').Request} req - HTTP request object
 * @param {import('express').Response} res - HTTP response object
 * @param {import('express').NextFunction} next - Function to move to the next middleware (if the error is not CORS)
 * 
 * @returns {void} - Returns a 403 response if the error is due to an unauthorized source; otherwise, it delegates the error.
 */
function handleCorsError(err, req, res, next) {

    if (err?.message === 'CORS_ORIGIN_NOT_ALLOWED') {
        return res.status(403).json({
            success: false,
            status: 'cors_rejected',
            message: 'Origin not allowed by CORS policy',
            origin: req.header('Origin') || null,
            allowedOrigins
        });
    }

    // If the error is not from CORS, continue with the next function
    next(err);

}

// Export the middlewares for use in app.js
export { corsMiddleware, handleCorsError };