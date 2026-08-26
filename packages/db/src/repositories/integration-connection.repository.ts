/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: INTEGRATIONCONNECTIONREPOSITORY
 * ============================================================================
 * Entity: IntegrationConnection
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { IntegrationConnection, IntegrationConnectionAttributes } from '@cognivanta/core';

export class IntegrationConnectionRepository {
  private entities = new Map<string, IntegrationConnection>();

  public async findById(id: string): Promise<IntegrationConnection | null> {
    const item = this.entities.get(id);
    return item ? new IntegrationConnection(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<IntegrationConnectionAttributes>): Promise<IntegrationConnection[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new IntegrationConnection(item.toJSON()));
  }

  public async create(entity: IntegrationConnection | IntegrationConnectionAttributes): Promise<IntegrationConnection> {
    const instance = entity instanceof IntegrationConnection ? entity : new IntegrationConnection(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<IntegrationConnectionAttributes>): Promise<IntegrationConnection | null> {
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

export const integrationConnectionRepository = new IntegrationConnectionRepository();
