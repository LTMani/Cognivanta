/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: ROLEPROFILEREPOSITORY
 * ============================================================================
 * Entity: RoleProfile
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { RoleProfile, RoleProfileAttributes } from '@cognivanta/core';

export class RoleProfileRepository {
  private entities = new Map<string, RoleProfile>();

  public async findById(id: string): Promise<RoleProfile | null> {
    const item = this.entities.get(id);
    return item ? new RoleProfile(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<RoleProfileAttributes>): Promise<RoleProfile[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new RoleProfile(item.toJSON()));
  }

  public async create(entity: RoleProfile | RoleProfileAttributes): Promise<RoleProfile> {
    const instance = entity instanceof RoleProfile ? entity : new RoleProfile(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<RoleProfileAttributes>): Promise<RoleProfile | null> {
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

export const roleProfileRepository = new RoleProfileRepository();
