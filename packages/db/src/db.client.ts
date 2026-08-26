/**
 * ============================================================================
 * COGNIVANTA UNIFIED DATABASE CLIENT & TRANSACTION MANAGER
 * ============================================================================
 * Pluggable database engine supporting In-Memory Collections and Relational SQL.
 */

import {
  User,
  Organization,
  Workspace,
  Conversation,
  ChatMessage,
  AgentDefinition,
  WorkflowDefinition,
  KnowledgeSpace,
  DocumentRecord,
  DocumentChunk,
  AuditLogEntry,
  TokenUsageRecord,
  EvalDataset,
  EvalRunResult
} from '@cognivanta/core';

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<{ rowsAffected: number }>;
}

export class InMemoryDatabase {
  public organizations = new Map<string, Organization>();
  public users = new Map<string, User & { passwordHash: string }>();
  public workspaces = new Map<string, Workspace>();
  public conversations = new Map<string, Conversation>();
  public messages = new Map<string, ChatMessage>();
  public agents = new Map<string, AgentDefinition>();
  public workflows = new Map<string, WorkflowDefinition>();
  public knowledgeSpaces = new Map<string, KnowledgeSpace>();
  public documents = new Map<string, DocumentRecord>();
  public documentChunks = new Map<string, DocumentChunk>();
  public auditLogs: AuditLogEntry[] = [];
  public tokenUsageRecords: TokenUsageRecord[] = [];
  public evalDatasets = new Map<string, EvalDataset>();
  public evalRuns = new Map<string, EvalRunResult>();

  private static instance: InMemoryDatabase;

  public static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }

  public clear(): void {
    this.organizations.clear();
    this.users.clear();
    this.workspaces.clear();
    this.conversations.clear();
    this.messages.clear();
    this.agents.clear();
    this.workflows.clear();
    this.knowledgeSpaces.clear();
    this.documents.clear();
    this.documentChunks.clear();
    this.auditLogs = [];
    this.tokenUsageRecords = [];
    this.evalDatasets.clear();
    this.evalRuns.clear();
  }
}

export const dbMemory = InMemoryDatabase.getInstance();
