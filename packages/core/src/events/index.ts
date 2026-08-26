/**
 * ============================================================================
 * COGNIVANTA PLATFORM EVENT BUS & SUBSCRIPTION SYSTEM
 * ============================================================================
 * Strongly-typed isomorphic event bus for platform telemetry and reactive hooks.
 */

import { AuditLogEntry, ChatMessage, AgentExecutionStep, DocumentRecord } from '../types';

export interface PlatformEventMap {
  'auth:user.login': { userId: string; email: string; organizationId: string; ip?: string };
  'auth:user.logout': { userId: string };
  'chat:message.created': { conversationId: string; message: ChatMessage };
  'chat:stream.chunk': { conversationId: string; chunkText: string };
  'rag:document.indexed': { document: DocumentRecord; totalChunks: number };
  'rag:document.failed': { documentId: string; error: string };
  'agent:run.started': { runId: string; agentId: string; prompt: string };
  'agent:run.step': { runId: string; agentId: string; step: AgentExecutionStep };
  'agent:run.completed': { runId: string; agentId: string; output: string; durationMs: number };
  'workflow:node.executed': { runId: string; nodeId: string; status: string; durationMs: number };
  'audit:entry.created': AuditLogEntry;
}

export type EventKey = keyof PlatformEventMap;
export type EventHandler<K extends EventKey> = (payload: PlatformEventMap[K]) => void | Promise<void>;

export class PlatformEventBus {
  private static instance: PlatformEventBus;
  private listeners: Map<string, Set<Function>> = new Map();

  public static getInstance(): PlatformEventBus {
    if (!PlatformEventBus.instance) {
      PlatformEventBus.instance = new PlatformEventBus();
    }
    return PlatformEventBus.instance;
  }

  public emit<K extends EventKey>(event: K, payload: PlatformEventMap[K]): boolean {
    const handlers = this.listeners.get(event);
    if (!handlers || handlers.size === 0) return false;
    for (const fn of handlers) {
      try {
        fn(payload);
      } catch (err) {
        console.error(`[EventBus] Error in handler for event "${event}":`, err);
      }
    }
    return true;
  }

  public on<K extends EventKey>(event: K, handler: EventHandler<K>): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return this;
  }

  public once<K extends EventKey>(event: K, handler: EventHandler<K>): this {
    const wrapper = (payload: PlatformEventMap[K]) => {
      this.off(event, wrapper as EventHandler<K>);
      handler(payload);
    };
    return this.on(event, wrapper as EventHandler<K>);
  }

  public off<K extends EventKey>(event: K, handler: EventHandler<K>): this {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
    return this;
  }

  public removeAllListeners(event?: EventKey): this {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
    return this;
  }
}

export const eventBus = PlatformEventBus.getInstance();
