/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: AUDITLOGBLOCKREPOSITORY
 * ============================================================================
 * Entity: AuditLogBlock
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { AuditLogBlock, AuditLogBlockAttributes } from '@cognivanta/core';

export class AuditLogBlockRepository {
  private entities = new Map<string, AuditLogBlock>();

  public async findById(id: string): Promise<AuditLogBlock | null> {
    const item = this.entities.get(id);
    return item ? new AuditLogBlock(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<AuditLogBlockAttributes>): Promise<AuditLogBlock[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new AuditLogBlock(item.toJSON()));
  }

  public async create(entity: AuditLogBlock | AuditLogBlockAttributes): Promise<AuditLogBlock> {
    const instance = entity instanceof AuditLogBlock ? entity : new AuditLogBlock(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<AuditLogBlockAttributes>): Promise<AuditLogBlock | null> {
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

export const auditLogBlockRepository = new AuditLogBlockRepository();
