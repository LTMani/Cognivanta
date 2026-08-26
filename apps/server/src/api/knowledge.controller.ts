import { Router, Request, Response, NextFunction } from 'express';
import { knowledgeService } from '../domain/knowledge/knowledge.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const knowledgeRouter = Router();

knowledgeRouter.get('/spaces', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req.query.workspaceId as string) || req.user!.workspaceIds[0];
    const list = await knowledgeService.listSpaces(workspaceId);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

knowledgeRouter.post('/spaces', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, embeddingModelId } = req.body;
    const workspaceId = req.body.workspaceId || req.user!.workspaceIds[0];
    const space = await knowledgeService.createSpace({
      workspaceId,
      name,
      description,
      embeddingModelId
    });
    res.status(201).json({ success: true, data: space });
  } catch (error) {
    next(error);
  }
});

knowledgeRouter.get('/spaces/:spaceId/documents', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const list = await knowledgeService.listDocuments(req.params.spaceId);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

knowledgeRouter.post('/ingest', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { knowledgeSpaceId, fileName, content, fileType } = req.body;
    const doc = await knowledgeService.ingestDocument({
      knowledgeSpaceId,
      workspaceId: req.user!.workspaceIds[0],
      actorId: req.user!.id,
      actorEmail: req.user!.email,
      fileName,
      content: content || 'Sample document content for enterprise indexing.',
      fileSizeBytes: (content ? Buffer.byteLength(content) : 1024),
      fileType
    });
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
});
