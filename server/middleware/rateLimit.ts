import rateLimit from 'express-rate-limit';

export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    ok: false,
    code: 'RATE_LIMITED',
    error: 'Too many contact requests from this address. Please wait 15 minutes or email directly.',
  },
});

export const healthRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    ok: false,
    code: 'RATE_LIMITED',
    error: 'Too many login attempts. Please wait 15 minutes before trying again.',
  },
});

export const aiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 25,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    ok: false,
    code: 'RATE_LIMITED',
    error: 'Muavin AI rate limit reached. Please pause briefly before sending another question.',
  },
});
