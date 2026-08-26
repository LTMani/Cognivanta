/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: EVALUATIONBENCHMARKSETREPOSITORY
 * ============================================================================
 * Entity: EvaluationBenchmarkSet
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { EvaluationBenchmarkSet, EvaluationBenchmarkSetAttributes } from '@cognivanta/core';

export class EvaluationBenchmarkSetRepository {
  private entities = new Map<string, EvaluationBenchmarkSet>();

  public async findById(id: string): Promise<EvaluationBenchmarkSet | null> {
    const item = this.entities.get(id);
    return item ? new EvaluationBenchmarkSet(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<EvaluationBenchmarkSetAttributes>): Promise<EvaluationBenchmarkSet[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new EvaluationBenchmarkSet(item.toJSON()));
  }

  public async create(entity: EvaluationBenchmarkSet | EvaluationBenchmarkSetAttributes): Promise<EvaluationBenchmarkSet> {
    const instance = entity instanceof EvaluationBenchmarkSet ? entity : new EvaluationBenchmarkSet(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<EvaluationBenchmarkSetAttributes>): Promise<EvaluationBenchmarkSet | null> {
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

export const evaluationBenchmarkSetRepository = new EvaluationBenchmarkSetRepository();
