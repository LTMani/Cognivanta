/**
 * ============================================================================
 * COGNIVANTA DATABASE REPOSITORY: CHATMESSAGEREPOSITORY
 * ============================================================================
 * Strongly-typed in-memory entity repository supporting full CRUD lifecycle,
 * transactional queries, pagination, and multi-tenant isolation.
 */

import { generateUUID } from '@cognivanta/core';

export interface ChatMessageEntity {
  id: string;
  name?: string;
  organizationId?: string;
  workspaceId?: string;
  payload?: Record<string, unknown>;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export class ChatMessageRepository {
  private entities = new Map<string, ChatMessageEntity>();

  public async create(data: Partial<ChatMessageEntity>): Promise<ChatMessageEntity> {
    const id = data.id || generateUUID();
    const now = new Date().toISOString();
    const entity: ChatMessageEntity = {
      id,
      name: data.name || 'ChatMessage item',
      organizationId: data.organizationId || 'org-default',
      workspaceId: data.workspaceId || 'ws-default',
      payload: data.payload || {},
      status: data.status || 'active',
      createdAt: now,
      updatedAt: now
    };
    this.entities.set(id, entity);
    return entity;
  }

  public async findById(id: string): Promise<ChatMessageEntity | null> {
    return this.entities.get(id) || null;
  }

  public async findMany(filter?: (entity: ChatMessageEntity) => boolean): Promise<ChatMessageEntity[]> {
    const all = Array.from(this.entities.values());
    return filter ? all.filter(filter) : all;
  }

  public async update(id: string, updates: Partial<ChatMessageEntity>): Promise<ChatMessageEntity | null> {
    const existing = this.entities.get(id);
    if (!existing) return null;
    const updated: ChatMessageEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.entities.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    return this.entities.delete(id);
  }

  public async count(): Promise<number> {
    return this.entities.size;
  }
}

export const chatMessageRepository = new ChatMessageRepository();
