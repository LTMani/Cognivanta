/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: KNOWLEDGESPACEENTITYREPOSITORY
 * ============================================================================
 * Entity: KnowledgeSpaceEntity
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { KnowledgeSpaceEntity, KnowledgeSpaceEntityAttributes } from '@cognivanta/core';

export class KnowledgeSpaceEntityRepository {
  private entities = new Map<string, KnowledgeSpaceEntity>();

  public async findById(id: string): Promise<KnowledgeSpaceEntity | null> {
    const item = this.entities.get(id);
    return item ? new KnowledgeSpaceEntity(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<KnowledgeSpaceEntityAttributes>): Promise<KnowledgeSpaceEntity[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new KnowledgeSpaceEntity(item.toJSON()));
  }

  public async create(entity: KnowledgeSpaceEntity | KnowledgeSpaceEntityAttributes): Promise<KnowledgeSpaceEntity> {
    const instance = entity instanceof KnowledgeSpaceEntity ? entity : new KnowledgeSpaceEntity(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<KnowledgeSpaceEntityAttributes>): Promise<KnowledgeSpaceEntity | null> {
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

export const knowledgeSpaceEntityRepository = new KnowledgeSpaceEntityRepository();
