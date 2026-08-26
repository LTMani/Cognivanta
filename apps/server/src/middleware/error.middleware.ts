import { Request, Response, NextFunction } from 'express';
import { CognivantaError } from '@cognivanta/core';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof CognivantaError) {
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  // Fallback for unexpected errors
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      name: 'InternalServerError',
      message: isDev ? err.message : 'An unexpected internal server error occurred.',
      timestamp: new Date().toISOString(),
      stack: isDev ? err.stack : undefined
    }
  });
}
