/**
 * Import 'basic-auth' library to automatically decode the Authorization header
 * in Basic format and extract the username/password.
 */ 
import basicAuth from 'basic-auth';

/**
 * HTTP Basic Authentication Middleware.
 * 
 * This middleware verifies that the request contains a valid Authorization header 
 * in "Basic base64(user:password)" format and that the credentials match 
 * those defined in the .env file (BASIC_AUTH_USER, BASIC_AUTH_PASS).
 * 
 * If authentication fails, it responds with a 401 status and a standard
 * WWW-Authenticate header for browsers and HTTP clients.
 * 
 * @param {import('express').Request} req - HTTP request object
 * @param {import('express').Response} res - HTTP response object
 * @param {import('express').NextFunction} next - Function to move to the next middleware
 * 
 * @returns {void} - Ends the response with a 401 error or calls `next()` if authenticated
 */
function authMiddleware( req, res, next ) {

    // Extract the credentials from the Authorization header
    const user = basicAuth( req );

    // Validate if credential exists and if them match with .env variables
    if (
        !user ||
        user.name !== process.env.BASIC_AUTH_USER ||
        user.pass !== process.env.BASIC_AUTH_PASS
    ) {
        // Sets the standard header so clients know they need to authenticate
        res.set('WWW-Authenticate', 'Basic realm="vonage-verifier"');

        /** 
         * Standard Unauthorized message
         * 
         * Indicates that the client has not provided valid credentials to
         * access the requested resource (401 status)
         */
        return res.status(401).json({
            status: 'unauthorized',
            message: 'Authentication required',
        });
    }

    // If authentication passes, continue to the next function
    next();
}

// Export the middleware for use in app.js
export { authMiddleware }