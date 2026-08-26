/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: MESSAGETURNREPOSITORY
 * ============================================================================
 * Entity: MessageTurn
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { MessageTurn, MessageTurnAttributes } from '@cognivanta/core';

export class MessageTurnRepository {
  private entities = new Map<string, MessageTurn>();

  public async findById(id: string): Promise<MessageTurn | null> {
    const item = this.entities.get(id);
    return item ? new MessageTurn(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<MessageTurnAttributes>): Promise<MessageTurn[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new MessageTurn(item.toJSON()));
  }

  public async create(entity: MessageTurn | MessageTurnAttributes): Promise<MessageTurn> {
    const instance = entity instanceof MessageTurn ? entity : new MessageTurn(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<MessageTurnAttributes>): Promise<MessageTurn | null> {
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

export const messageTurnRepository = new MessageTurnRepository();
