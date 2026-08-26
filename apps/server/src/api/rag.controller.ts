import { Router, Response, NextFunction } from 'express';
import { hybridRetriever } from '@cognivanta/rag-engine';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const ragRouter = Router();

ragRouter.post('/retrieve', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { queryText, knowledgeSpaceIds, topK, minScoreThreshold, rerank } = req.body;
    const result = await hybridRetriever.retrieve({
      queryText,
      knowledgeSpaceIds: knowledgeSpaceIds || [],
      topK: topK || 5,
      minScoreThreshold: minScoreThreshold || 0.4,
      rerank: rerank !== false
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
