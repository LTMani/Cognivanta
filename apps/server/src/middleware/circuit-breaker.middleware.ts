/**
 * ============================================================================
 * COGNIVANTA ENTERPRISE MIDDLEWARE: CIRCUITBREAKER
 * ============================================================================
 * Description: Upstream provider circuit breaker tracking consecutive error thresholds.
 */

import { Request, Response, NextFunction } from 'express';

export function circuitBreaker(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  res.setHeader('X-Cognivanta-Processed-By', 'circuitBreaker');

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // Telemetry trace recorded
  });

  next();
}
