/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: TOOLSPECIFICATIONREPOSITORY
 * ============================================================================
 * Entity: ToolSpecification
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { ToolSpecification, ToolSpecificationAttributes } from '@cognivanta/core';

export class ToolSpecificationRepository {
  private entities = new Map<string, ToolSpecification>();

  public async findById(id: string): Promise<ToolSpecification | null> {
    const item = this.entities.get(id);
    return item ? new ToolSpecification(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<ToolSpecificationAttributes>): Promise<ToolSpecification[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new ToolSpecification(item.toJSON()));
  }

  public async create(entity: ToolSpecification | ToolSpecificationAttributes): Promise<ToolSpecification> {
    const instance = entity instanceof ToolSpecification ? entity : new ToolSpecification(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<ToolSpecificationAttributes>): Promise<ToolSpecification | null> {
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

export const toolSpecificationRepository = new ToolSpecificationRepository();
