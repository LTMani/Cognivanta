/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: USERACCOUNTREPOSITORY
 * ============================================================================
 * Entity: UserAccount
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { UserAccount, UserAccountAttributes } from '@cognivanta/core';

export class UserAccountRepository {
  private entities = new Map<string, UserAccount>();

  public async findById(id: string): Promise<UserAccount | null> {
    const item = this.entities.get(id);
    return item ? new UserAccount(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<UserAccountAttributes>): Promise<UserAccount[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new UserAccount(item.toJSON()));
  }

  public async create(entity: UserAccount | UserAccountAttributes): Promise<UserAccount> {
    const instance = entity instanceof UserAccount ? entity : new UserAccount(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<UserAccountAttributes>): Promise<UserAccount | null> {
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

export const userAccountRepository = new UserAccountRepository();
