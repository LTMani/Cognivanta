import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const pipelinesRouter = Router();

pipelinesRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      data: [
        { id: 'pipelines-01', name: 'Production PipelineController', status: 'active', createdAt: new Date().toISOString() },
        { id: 'pipelines-02', name: 'Staging PipelineController', status: 'active', createdAt: new Date().toISOString() }
      ]
    });
  } catch (error) {
    next(error);
  }
});

pipelinesRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({
      success: true,
      data: {
        id: 'pipelines-' + Date.now(),
        ...req.body,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});
