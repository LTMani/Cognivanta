import { Router, Response, NextFunction } from 'express';
import { evalRepository } from '@cognivanta/db';
import { GOLDEN_BENCHMARK_DATASETS, benchmarkRunner } from '@cognivanta/eval-engine';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

export const evalRouter = Router();

evalRouter.get('/datasets', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const custom = await evalRepository.listDatasets(req.user!.workspaceIds[0]);
    res.status(200).json({
      success: true,
      data: [...GOLDEN_BENCHMARK_DATASETS, ...custom]
    });
  } catch (error) {
    next(error);
  }
});

evalRouter.post('/run', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { datasetId, modelId } = req.body;
    let dataset = await evalRepository.findDatasetById(datasetId);

    if (!dataset) {
      dataset = GOLDEN_BENCHMARK_DATASETS.find(d => d.id === datasetId) || GOLDEN_BENCHMARK_DATASETS[0];
    }

    const runResult = await benchmarkRunner.runEvaluation(dataset, modelId || 'gpt-4o');
    await evalRepository.saveRunResult(runResult);

    res.status(200).json({ success: true, data: runResult });
  } catch (error) {
    next(error);
  }
});
