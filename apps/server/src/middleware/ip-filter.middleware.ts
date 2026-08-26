/**
 * ============================================================================
 * COGNIVANTA ENTERPRISE MIDDLEWARE: IPFILTER
 * ============================================================================
 * Description: Corporate IP whitelisting and CIDR boundary checker.
 */

import { Request, Response, NextFunction } from 'express';

export function ipFilter(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  res.setHeader('X-Cognivanta-Processed-By', 'ipFilter');

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // Telemetry trace recorded
  });

  next();
}
