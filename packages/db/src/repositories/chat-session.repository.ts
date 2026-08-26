/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: CHATSESSIONREPOSITORY
 * ============================================================================
 * Entity: ChatSession
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { ChatSession, ChatSessionAttributes } from '@cognivanta/core';

export class ChatSessionRepository {
  private entities = new Map<string, ChatSession>();

  public async findById(id: string): Promise<ChatSession | null> {
    const item = this.entities.get(id);
    return item ? new ChatSession(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<ChatSessionAttributes>): Promise<ChatSession[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new ChatSession(item.toJSON()));
  }

  public async create(entity: ChatSession | ChatSessionAttributes): Promise<ChatSession> {
    const instance = entity instanceof ChatSession ? entity : new ChatSession(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<ChatSessionAttributes>): Promise<ChatSession | null> {
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

export const chatSessionRepository = new ChatSessionRepository();
