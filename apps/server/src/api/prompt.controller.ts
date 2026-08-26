import { Router, Response, NextFunction } from 'express';
import { promptService } from '../domain/prompt/prompt.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const promptRouter = Router();

promptRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req.query.workspaceId as string) || req.user!.workspaceIds[0];
    const list = await promptService.listTemplates(workspaceId);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

promptRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, template, variables, tags } = req.body;
    const workspaceId = req.body.workspaceId || req.user!.workspaceIds[0];
    const created = await promptService.createTemplate({
      workspaceId,
      name,
      description,
      template,
      variables,
      tags
    });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

promptRouter.post('/:id/compile', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const compiled = await promptService.compilePrompt(req.params.id, req.body.variables || {});
    res.status(200).json({ success: true, data: { compiled } });
  } catch (error) {
    next(error);
  }
});
