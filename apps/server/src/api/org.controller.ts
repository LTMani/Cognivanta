import { Router, Response, NextFunction } from 'express';
import { orgService } from '../domain/org/org.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const orgRouter = Router();

orgRouter.get('/current', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const org = await orgService.getOrganization(req.organizationId!);
    res.status(200).json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
});

orgRouter.patch('/settings', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await orgService.updateSettings(
      req.organizationId!,
      req.user!.id,
      req.user!.email,
      req.body
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});
