import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const telemetryRouter = Router();

telemetryRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      data: [
        { id: 'telemetry-01', name: 'Production TelemetryController', status: 'active', createdAt: new Date().toISOString() },
        { id: 'telemetry-02', name: 'Staging TelemetryController', status: 'active', createdAt: new Date().toISOString() }
      ]
    });
  } catch (error) {
    next(error);
  }
});

telemetryRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({
      success: true,
      data: {
        id: 'telemetry-' + Date.now(),
        ...req.body,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});
