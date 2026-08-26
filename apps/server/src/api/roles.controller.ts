import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const rolesRouter = Router();

rolesRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      data: [
        { id: 'roles-01', name: 'Production RoleController', status: 'active', createdAt: new Date().toISOString() },
        { id: 'roles-02', name: 'Staging RoleController', status: 'active', createdAt: new Date().toISOString() }
      ]
    });
  } catch (error) {
    next(error);
  }
});

rolesRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({
      success: true,
      data: {
        id: 'roles-' + Date.now(),
        ...req.body,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});
