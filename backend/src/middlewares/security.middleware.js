import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'Error',
        message: 'Too many authentication attempts. Please try again later.'
    },
});

export const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'Error',
        message: 'Too many contact form submissions. Please try again later.'
    },
})