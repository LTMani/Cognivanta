/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: EVALUATIONRUNREPORTREPOSITORY
 * ============================================================================
 * Entity: EvaluationRunReport
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { EvaluationRunReport, EvaluationRunReportAttributes } from '@cognivanta/core';

export class EvaluationRunReportRepository {
  private entities = new Map<string, EvaluationRunReport>();

  public async findById(id: string): Promise<EvaluationRunReport | null> {
    const item = this.entities.get(id);
    return item ? new EvaluationRunReport(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<EvaluationRunReportAttributes>): Promise<EvaluationRunReport[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new EvaluationRunReport(item.toJSON()));
  }

  public async create(entity: EvaluationRunReport | EvaluationRunReportAttributes): Promise<EvaluationRunReport> {
    const instance = entity instanceof EvaluationRunReport ? entity : new EvaluationRunReport(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<EvaluationRunReportAttributes>): Promise<EvaluationRunReport | null> {
    const existing = this.entities.get(id);
    if (!existing) return null;

    Object.assign(existing, updates);
    existing.touch();
    this.entities.set(id, existing);
    return existing;
  }

  public async delete(id: string): Promise<boolean> {
    return this.entities.delete(id);
  }

  public async count(): Promise<number> {
    return this.entities.size;
  }

  public async clear(): Promise<void> {
    this.entities.clear();
  }
}

export const evaluationRunReportRepository = new EvaluationRunReportRepository();
