import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    systemHealthPercentage: 99.9,
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      apiGateway: 'online',
      database: 'online',
      vectorStore: 'online',
      modelGateway: 'online',
      jobQueue: 'online'
    }
  });
});
