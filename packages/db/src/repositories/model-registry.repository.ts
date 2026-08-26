/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: MODELREGISTRYITEMREPOSITORY
 * ============================================================================
 * Entity: ModelRegistryItem
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { ModelRegistryItem, ModelRegistryItemAttributes } from '@cognivanta/core';

export class ModelRegistryItemRepository {
  private entities = new Map<string, ModelRegistryItem>();

  public async findById(id: string): Promise<ModelRegistryItem | null> {
    const item = this.entities.get(id);
    return item ? new ModelRegistryItem(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<ModelRegistryItemAttributes>): Promise<ModelRegistryItem[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new ModelRegistryItem(item.toJSON()));
  }

  public async create(entity: ModelRegistryItem | ModelRegistryItemAttributes): Promise<ModelRegistryItem> {
    const instance = entity instanceof ModelRegistryItem ? entity : new ModelRegistryItem(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<ModelRegistryItemAttributes>): Promise<ModelRegistryItem | null> {
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

export const modelRegistryItemRepository = new ModelRegistryItemRepository();
