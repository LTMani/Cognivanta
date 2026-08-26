import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../domain/auth/auth.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, orgName } = req.body;
    const result = await authService.register({ email, password, name, orgName });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, data: { user: req.user, organizationId: req.organizationId } });
  } catch (error) {
    next(error);
  }
});
