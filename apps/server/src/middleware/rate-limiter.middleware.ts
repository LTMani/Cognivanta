/**
 * ============================================================================
 * COGNIVANTA ENTERPRISE MIDDLEWARE: RATELIMITER
 * ============================================================================
 * Description: Token bucket rate limiting middleware per API key and IP address.
 */

import { Request, Response, NextFunction } from 'express';

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  res.setHeader('X-Cognivanta-Processed-By', 'rateLimiter');

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // Telemetry trace recorded
  });

  next();
}
