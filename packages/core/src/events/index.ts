/**
 * ============================================================================
 * COGNIVANTA PLATFORM EVENT BUS & SUBSCRIPTION SYSTEM
 * ============================================================================
 * Strongly-typed in-memory and distributed event bus for platform telemetry and reactive hooks.
 */

import { EventEmitter } from 'events';
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
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(100);
  }

  public static getInstance(): PlatformEventBus {
    if (!PlatformEventBus.instance) {
      PlatformEventBus.instance = new PlatformEventBus();
    }
    return PlatformEventBus.instance;
  }

  public emit<K extends EventKey>(event: K, payload: PlatformEventMap[K]): boolean {
    return this.emitter.emit(event, payload);
  }

  public on<K extends EventKey>(event: K, handler: EventHandler<K>): this {
    this.emitter.on(event, handler as (...args: unknown[]) => void);
    return this;
  }

  public once<K extends EventKey>(event: K, handler: EventHandler<K>): this {
    this.emitter.once(event, handler as (...args: unknown[]) => void);
    return this;
  }

  public off<K extends EventKey>(event: K, handler: EventHandler<K>): this {
    this.emitter.off(event, handler as (...args: unknown[]) => void);
    return this;
  }

  public removeAllListeners(event?: EventKey): this {
    if (event) {
      this.emitter.removeAllListeners(event);
    } else {
      this.emitter.removeAllListeners();
    }
    return this;
  }
}

export const eventBus = PlatformEventBus.getInstance();
