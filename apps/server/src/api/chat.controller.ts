import { Router, Response, NextFunction } from 'express';
import { chatService } from '../domain/chat/chat.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const chatRouter = Router();

chatRouter.get('/conversations', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = (req.query.workspaceId as string) || req.user!.workspaceIds[0];
    const list = await chatService.listConversations(workspaceId);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

chatRouter.post('/conversations', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, title, modelId, systemPrompt } = req.body;
    const conv = await chatService.createConversation({
      workspaceId: workspaceId || req.user!.workspaceIds[0],
      userId: req.user!.id,
      title,
      modelId,
      systemPrompt
    });
    res.status(201).json({ success: true, data: conv });
  } catch (error) {
    next(error);
  }
});

chatRouter.get('/conversations/:id/messages', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const messages = await chatService.getMessages(req.params.id);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
});

chatRouter.post('/send', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { conversationId, workspaceId, message, modelId, stream } = req.body;

    if (stream) {
      // SSE Streaming Response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      await chatService.streamMessage(
        {
          conversationId,
          workspaceId: workspaceId || req.user!.workspaceIds[0],
          userId: req.user!.id,
          message,
          modelId
        },
        (chunk) => {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
      );

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const result = await chatService.sendMessage({
      conversationId,
      workspaceId: workspaceId || req.user!.workspaceIds[0],
      userId: req.user!.id,
      userEmail: req.user!.email,
      message,
      modelId
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
