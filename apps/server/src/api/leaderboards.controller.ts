import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const leaderboardsRouter = Router();

leaderboardsRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      data: [
        { id: 'leaderboards-01', name: 'Production LeaderboardController', status: 'active', createdAt: new Date().toISOString() },
        { id: 'leaderboards-02', name: 'Staging LeaderboardController', status: 'active', createdAt: new Date().toISOString() }
      ]
    });
  } catch (error) {
    next(error);
  }
});

leaderboardsRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({
      success: true,
      data: {
        id: 'leaderboards-' + Date.now(),
        ...req.body,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});
