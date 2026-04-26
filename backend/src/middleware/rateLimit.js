const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, // Limit each IP to 5 login requests per `window` (here, per 30 minutes)
  message: { error: 'Too many login attempts from this IP, please try again after 30 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, publicLimiter };
