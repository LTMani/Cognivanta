/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: VECTORINDEXSPECIFICATIONREPOSITORY
 * ============================================================================
 * Entity: VectorIndexSpecification
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { VectorIndexSpecification, VectorIndexSpecificationAttributes } from '@cognivanta/core';

export class VectorIndexSpecificationRepository {
  private entities = new Map<string, VectorIndexSpecification>();

  public async findById(id: string): Promise<VectorIndexSpecification | null> {
    const item = this.entities.get(id);
    return item ? new VectorIndexSpecification(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<VectorIndexSpecificationAttributes>): Promise<VectorIndexSpecification[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new VectorIndexSpecification(item.toJSON()));
  }

  public async create(entity: VectorIndexSpecification | VectorIndexSpecificationAttributes): Promise<VectorIndexSpecification> {
    const instance = entity instanceof VectorIndexSpecification ? entity : new VectorIndexSpecification(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<VectorIndexSpecificationAttributes>): Promise<VectorIndexSpecification | null> {
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

export const vectorIndexSpecificationRepository = new VectorIndexSpecificationRepository();
