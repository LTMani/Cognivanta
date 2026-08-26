import { Router, Request, Response, NextFunction } from 'express';
import { DEFAULT_MODELS, DEFAULT_EMBEDDING_MODELS } from '@cognivanta/core';
import { modelGateway } from '@cognivanta/model-gateway';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const modelRouter = Router();

modelRouter.get('/', authenticate, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        chatModels: DEFAULT_MODELS,
        embeddingModels: DEFAULT_EMBEDDING_MODELS
      }
    });
  } catch (error) {
    next(error);
  }
});

modelRouter.post('/complete', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { modelId, messages, temperature, maxTokens } = req.body;
    const response = await modelGateway.complete({
      modelId: modelId || 'gpt-4o',
      messages,
      temperature,
      maxTokens
    });
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
});

modelRouter.post('/embed', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { modelId, input } = req.body;
    const response = await modelGateway.embed({
      modelId: modelId || 'text-embedding-3-small',
      input
    });
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
});
