import { Router, Response, NextFunction } from 'express';
import { analyticsRepository } from '@cognivanta/db';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const analyticsRouter = Router();

analyticsRouter.get('/overview', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const overview = await analyticsRepository.getOverview(req.organizationId!);
    res.status(200).json({ success: true, data: overview });
  } catch (error) {
    next(error);
  }
});
