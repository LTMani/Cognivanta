import { Router, Response, NextFunction } from 'express';
import { entityExtractor } from '../../../../packages/rag-engine/src/intelligence/entity.extractor';
import { documentSummarizer } from '../../../../packages/rag-engine/src/intelligence/document.summarizer';
import { keyphraseExtractor } from '../../../../packages/rag-engine/src/intelligence/table.extractor';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const docIntelRouter = Router();

docIntelRouter.post('/analyze', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { text, modelId } = req.body;
    const content = text || 'Q1 Revenue grew by 18.6% reaching $42.8M according to Tharun on May 20, 2024.';

    const entities = entityExtractor.extract(content);
    const keyphrases = keyphraseExtractor.extract(content);
    const summary = await documentSummarizer.summarize(content, modelId);

    res.status(200).json({
      success: true,
      data: {
        entities,
        keyphrases,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
});
