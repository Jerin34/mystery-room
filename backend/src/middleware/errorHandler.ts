import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`Unhandled error on ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected error occurred. Our detectives are investigating.'
      : err.message || 'Internal Server Error';

  return sendError(res, code, message, statusCode);
}
