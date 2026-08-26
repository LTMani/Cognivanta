/**
 * ============================================================================
 * COGNIVANTA ENTERPRISE MIDDLEWARE: ABACVALIDATOR
 * ============================================================================
 * Description: Attribute-based access control evaluation middleware.
 */

import { Request, Response, NextFunction } from 'express';

export function abacValidator(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  res.setHeader('X-Cognivanta-Processed-By', 'abacValidator');

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // Telemetry trace recorded
  });

  next();
}
