/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: SOURCECITATIONREPOSITORY
 * ============================================================================
 * Entity: SourceCitation
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { SourceCitation, SourceCitationAttributes } from '@cognivanta/core';

export class SourceCitationRepository {
  private entities = new Map<string, SourceCitation>();

  public async findById(id: string): Promise<SourceCitation | null> {
    const item = this.entities.get(id);
    return item ? new SourceCitation(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<SourceCitationAttributes>): Promise<SourceCitation[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new SourceCitation(item.toJSON()));
  }

  public async create(entity: SourceCitation | SourceCitationAttributes): Promise<SourceCitation> {
    const instance = entity instanceof SourceCitation ? entity : new SourceCitation(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<SourceCitationAttributes>): Promise<SourceCitation | null> {
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

export const sourceCitationRepository = new SourceCitationRepository();
