/**
 * ============================================================================
 * COGNIVANTA CONVERSATION & MESSAGE REPOSITORY
 * ============================================================================
 */

import { Conversation, ChatMessage } from '@cognivanta/core';
import { dbMemory } from '../db.client';

export class ConversationRepository {
  public async findById(id: string): Promise<Conversation | null> {
    return dbMemory.conversations.get(id) || null;
  }

  public async findByWorkspace(workspaceId: string): Promise<Conversation[]> {
    const list: Conversation[] = [];
    for (const conv of dbMemory.conversations.values()) {
      if (conv.workspaceId === workspaceId) {
        list.push(conv);
      }
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public async findByUser(userId: string): Promise<Conversation[]> {
    const list: Conversation[] = [];
    for (const conv of dbMemory.conversations.values()) {
      if (conv.userId === userId) {
        list.push(conv);
      }
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public async create(conv: Conversation): Promise<Conversation> {
    dbMemory.conversations.set(conv.id, conv);
    return conv;
  }

  public async update(id: string, updates: Partial<Conversation>): Promise<Conversation | null> {
    const existing = dbMemory.conversations.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    dbMemory.conversations.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    // Also delete associated messages
    for (const msg of dbMemory.messages.values()) {
      if (msg.conversationId === id) {
        dbMemory.messages.delete(msg.id);
      }
    }
    return dbMemory.conversations.delete(id);
  }

  public async addMessage(msg: ChatMessage): Promise<ChatMessage> {
    dbMemory.messages.set(msg.id, msg);
    // Update conversation timestamp
    const conv = dbMemory.conversations.get(msg.conversationId);
    if (conv) {
      conv.updatedAt = new Date().toISOString();
    }
    return msg;
  }

  public async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const list: ChatMessage[] = [];
    for (const msg of dbMemory.messages.values()) {
      if (msg.conversationId === conversationId) {
        list.push(msg);
      }
    }
    return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}

export const conversationRepository = new ConversationRepository();
