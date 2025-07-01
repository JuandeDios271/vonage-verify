import rateLimit from 'express-rate-limit'

/**
 * Límite global: 10 peticiones por minuto por IP
 */
const globalRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 10,
    message: {
        status: 'too_many_requests',
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

export default globalRateLimiter;