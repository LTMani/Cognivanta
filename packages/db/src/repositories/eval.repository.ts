/**
 * ============================================================================
 * COGNIVANTA EVALUATION & BENCHMARK REPOSITORY
 * ============================================================================
 */

import { EvalDataset, EvalRunResult } from '@cognivanta/core';
import { dbMemory } from '../db.client';

export class EvalRepository {
  public async findDatasetById(id: string): Promise<EvalDataset | null> {
    return dbMemory.evalDatasets.get(id) || null;
  }

  public async listDatasets(workspaceId: string): Promise<EvalDataset[]> {
    const list: EvalDataset[] = [];
    for (const ds of dbMemory.evalDatasets.values()) {
      if (ds.workspaceId === workspaceId) {
        list.push(ds);
      }
    }
    return list;
  }

  public async saveDataset(ds: EvalDataset): Promise<EvalDataset> {
    dbMemory.evalDatasets.set(ds.id, ds);
    return ds;
  }

  public async saveRunResult(result: EvalRunResult): Promise<EvalRunResult> {
    dbMemory.evalRuns.set(result.id, result);
    return result;
  }

  public async getRunResult(id: string): Promise<EvalRunResult | null> {
    return dbMemory.evalRuns.get(id) || null;
  }

  public async listRunsByDataset(datasetId: string): Promise<EvalRunResult[]> {
    const list: EvalRunResult[] = [];
    for (const run of dbMemory.evalRuns.values()) {
      if (run.datasetId === datasetId) {
        list.push(run);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const evalRepository = new EvalRepository();
