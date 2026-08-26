import { Router, Response, NextFunction } from 'express';
import { workspaceService } from '../domain/workspace/workspace.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const workspaceRouter = Router();

workspaceRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const list = await workspaceService.listForOrg(req.organizationId!);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

workspaceRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    const ws = await workspaceService.createWorkspace({
      organizationId: req.organizationId!,
      actorId: req.user!.id,
      actorEmail: req.user!.email,
      name,
      description
    });
    res.status(201).json({ success: true, data: ws });
  } catch (error) {
    next(error);
  }
});
