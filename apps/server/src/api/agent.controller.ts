import { Router, Response, NextFunction } from 'express';
import { agentService } from '../domain/agent/agent.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const agentRouter = Router();

agentRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req.query.workspaceId as string) || req.user!.workspaceIds[0];
    const list = await agentService.listAgents(workspaceId);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

agentRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, roleType, systemInstructions, modelId, enabledToolIds } = req.body;
    const workspaceId = req.body.workspaceId || req.user!.workspaceIds[0];

    const agent = await agentService.createAgent({
      organizationId: req.organizationId!,
      workspaceId,
      name,
      description,
      roleType,
      systemInstructions,
      modelId,
      enabledToolIds
    });
    res.status(201).json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
});

agentRouter.post('/:id/run', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    const result = await agentService.executeAgent({
      agentId: req.params.id,
      workspaceId: req.user!.workspaceIds[0],
      userId: req.user!.id,
      userEmail: req.user!.email,
      prompt: prompt || 'Execute agent autonomous reasoning task.'
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
