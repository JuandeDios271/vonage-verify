import logger from '../utils/logger.js'

/**
 * Middleware to log each incoming request
 * @param {import('express').Request} req - HTTP request object
 * @param {import('express').Response} res - HTTP response object
 * @param {import('express').NextFunction} next - Function to move to the next function
 */
function requestLogger(req, res, next) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    // Esperar a que termine la respuesta para registrar el status
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const status = res.statusCode;
        const log = `[${method}] ${originalUrl} → ${status} (${duration} ms)`;

        if (status >= 500) {
            logger.error(log);
        } else if (status >= 400) {
            logger.warn(log);
        } else {
            logger.info(log);
        }
    })

    next();
}

export default requestLogger
