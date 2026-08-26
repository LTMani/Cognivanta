/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: TOKENUSAGELEDGERREPOSITORY
 * ============================================================================
 * Entity: TokenUsageLedger
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { TokenUsageLedger, TokenUsageLedgerAttributes } from '@cognivanta/core';

export class TokenUsageLedgerRepository {
  private entities = new Map<string, TokenUsageLedger>();

  public async findById(id: string): Promise<TokenUsageLedger | null> {
    const item = this.entities.get(id);
    return item ? new TokenUsageLedger(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<TokenUsageLedgerAttributes>): Promise<TokenUsageLedger[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new TokenUsageLedger(item.toJSON()));
  }

  public async create(entity: TokenUsageLedger | TokenUsageLedgerAttributes): Promise<TokenUsageLedger> {
    const instance = entity instanceof TokenUsageLedger ? entity : new TokenUsageLedger(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<TokenUsageLedgerAttributes>): Promise<TokenUsageLedger | null> {
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

export const tokenUsageLedgerRepository = new TokenUsageLedgerRepository();
