/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: SECURITYPERMISSIONREPOSITORY
 * ============================================================================
 * Entity: SecurityPermission
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { SecurityPermission, SecurityPermissionAttributes } from '@cognivanta/core';

export class SecurityPermissionRepository {
  private entities = new Map<string, SecurityPermission>();

  public async findById(id: string): Promise<SecurityPermission | null> {
    const item = this.entities.get(id);
    return item ? new SecurityPermission(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<SecurityPermissionAttributes>): Promise<SecurityPermission[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new SecurityPermission(item.toJSON()));
  }

  public async create(entity: SecurityPermission | SecurityPermissionAttributes): Promise<SecurityPermission> {
    const instance = entity instanceof SecurityPermission ? entity : new SecurityPermission(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<SecurityPermissionAttributes>): Promise<SecurityPermission | null> {
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

export const securityPermissionRepository = new SecurityPermissionRepository();
