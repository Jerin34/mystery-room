import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response';
import { env } from '../config/env';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 'RATE_LIMIT_EXCEEDED', 'Too many authentication attempts. Please try again later.', 429);
  },
});

export const caseGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: env.CASE_GENERATION_LIMIT_PER_HOUR,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req as any).user?.userId || req.ip || 'anonymous';
  },
  handler: (req, res) => {
    sendError(
      res,
      'RATE_LIMIT_EXCEEDED',
      `Case generation limit of ${env.CASE_GENERATION_LIMIT_PER_HOUR} per hour reached. Please wait before creating another mystery.`,
      429
    );
  },
});
