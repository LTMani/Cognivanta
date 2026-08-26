import { Router, Response, NextFunction } from 'express';
import { auditRepository, dbMemory } from '@cognivanta/db';
import { chainVerifier } from '@cognivanta/audit-compliance';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const auditRouter = Router();

auditRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const list = await auditRepository.getByOrganization(req.organizationId!, 100);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

auditRouter.post('/verify', authenticate, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = chainVerifier.verify(dbMemory.auditLogs);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
