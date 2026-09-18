import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

/**
 * General rate limiter — applies to all routes
 */
export const generalLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth rate limiter — strict limiter for login/OTP/password routes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.authRateLimitMax,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * OTP rate limiter — very strict for OTP requests
 */
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  message: {
    success: false,
    message: 'Too many OTP requests, please try again after 5 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
