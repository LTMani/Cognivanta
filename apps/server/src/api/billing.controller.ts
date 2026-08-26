import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const billingRouter = Router();

billingRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      data: [
        { id: 'billing-01', name: 'Production BillingController', status: 'active', createdAt: new Date().toISOString() },
        { id: 'billing-02', name: 'Staging BillingController', status: 'active', createdAt: new Date().toISOString() }
      ]
    });
  } catch (error) {
    next(error);
  }
});

billingRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({
      success: true,
      data: {
        id: 'billing-' + Date.now(),
        ...req.body,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});
