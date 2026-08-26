import { Router, Response, NextFunction } from 'express';
import { workflowService } from '../domain/workflow/workflow.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const workflowRouter = Router();

workflowRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req.query.workspaceId as string) || req.user!.workspaceIds[0];
    const list = await workflowService.listWorkflows(workspaceId);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

workflowRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, nodes, edges } = req.body;
    const workspaceId = req.body.workspaceId || req.user!.workspaceIds[0];

    const wf = await workflowService.saveWorkflow({
      workspaceId,
      name,
      description,
      nodes,
      edges
    });
    res.status(201).json({ success: true, data: wf });
  } catch (error) {
    next(error);
  }
});

workflowRouter.post('/:id/execute', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await workflowService.executeWorkflow({
      workflowId: req.params.id,
      workspaceId: req.user!.workspaceIds[0],
      triggeredBy: req.user!.id,
      inputParams: req.body.inputParams || {}
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
