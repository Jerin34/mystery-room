import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  requestId: string;
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  const requestId = (res.req as any)?.id || 'unknown';
  const response: ApiResponse<T> = {
    success: true,
    data,
    error: null,
    requestId,
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  details?: any
): Response {
  const requestId = (res.req as any)?.id || 'unknown';
  const response: ApiResponse = {
    success: false,
    data: null,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    requestId,
  };
  return res.status(statusCode).json(response);
}
