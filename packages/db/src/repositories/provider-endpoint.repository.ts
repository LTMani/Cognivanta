/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: PROVIDERENDPOINTREPOSITORY
 * ============================================================================
 * Entity: ProviderEndpoint
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { ProviderEndpoint, ProviderEndpointAttributes } from '@cognivanta/core';

export class ProviderEndpointRepository {
  private entities = new Map<string, ProviderEndpoint>();

  public async findById(id: string): Promise<ProviderEndpoint | null> {
    const item = this.entities.get(id);
    return item ? new ProviderEndpoint(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<ProviderEndpointAttributes>): Promise<ProviderEndpoint[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new ProviderEndpoint(item.toJSON()));
  }

  public async create(entity: ProviderEndpoint | ProviderEndpointAttributes): Promise<ProviderEndpoint> {
    const instance = entity instanceof ProviderEndpoint ? entity : new ProviderEndpoint(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<ProviderEndpointAttributes>): Promise<ProviderEndpoint | null> {
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

export const providerEndpointRepository = new ProviderEndpointRepository();
