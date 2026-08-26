/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: APIKEYSECRETREPOSITORY
 * ============================================================================
 * Entity: ApiKeySecret
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { ApiKeySecret, ApiKeySecretAttributes } from '@cognivanta/core';

export class ApiKeySecretRepository {
  private entities = new Map<string, ApiKeySecret>();

  public async findById(id: string): Promise<ApiKeySecret | null> {
    const item = this.entities.get(id);
    return item ? new ApiKeySecret(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<ApiKeySecretAttributes>): Promise<ApiKeySecret[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new ApiKeySecret(item.toJSON()));
  }

  public async create(entity: ApiKeySecret | ApiKeySecretAttributes): Promise<ApiKeySecret> {
    const instance = entity instanceof ApiKeySecret ? entity : new ApiKeySecret(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<ApiKeySecretAttributes>): Promise<ApiKeySecret | null> {
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

export const apiKeySecretRepository = new ApiKeySecretRepository();
