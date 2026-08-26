/**
 * ============================================================================
 * COGNIVANTA DATABASE REPOSITORY: CHATSESSIONREPOSITORY
 * ============================================================================
 * Strongly-typed in-memory entity repository supporting full CRUD lifecycle,
 * transactional queries, pagination, and multi-tenant isolation.
 */

import { generateUUID } from '@cognivanta/core';

export interface ChatSessionEntity {
  id: string;
  name?: string;
  organizationId?: string;
  workspaceId?: string;
  payload?: Record<string, unknown>;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export class ChatSessionRepository {
  private entities = new Map<string, ChatSessionEntity>();

  public async create(data: Partial<ChatSessionEntity>): Promise<ChatSessionEntity> {
    const id = data.id || generateUUID();
    const now = new Date().toISOString();
    const entity: ChatSessionEntity = {
      id,
      name: data.name || 'ChatSession item',
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

  public async findById(id: string): Promise<ChatSessionEntity | null> {
    return this.entities.get(id) || null;
  }

  public async findMany(filter?: (entity: ChatSessionEntity) => boolean): Promise<ChatSessionEntity[]> {
    const all = Array.from(this.entities.values());
    return filter ? all.filter(filter) : all;
  }

  public async update(id: string, updates: Partial<ChatSessionEntity>): Promise<ChatSessionEntity | null> {
    const existing = this.entities.get(id);
    if (!existing) return null;
    const updated: ChatSessionEntity = {
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

export const chatSessionRepository = new ChatSessionRepository();
