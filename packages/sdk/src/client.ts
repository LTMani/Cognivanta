/**
 * ============================================================================
 * COGNIVANTA OFFICIAL TYPESCRIPT / NODE.JS SDK CLIENT
 * ============================================================================
 */

import {
  ChatMessage,
  AgentDefinition,
  AgentExecutionRun,
  KnowledgeSpace,
  DocumentRecord,
  WorkflowDefinition,
  PlatformAnalyticsOverview,
  EvalRunResult
} from '@cognivanta/core';

export interface CognivantaClientOptions {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export class CognivantaClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(options: CognivantaClientOptions = {}) {
    this.apiKey = options.apiKey || process.env.COGNIVANTA_API_KEY || 'demo-token';
    this.baseUrl = (options.baseUrl || process.env.COGNIVANTA_API_URL || 'http://localhost:3000/api/v1').replace(/\/$/, '');
  }

  // --- AI Chat ---
  public async sendMessage(params: {
    message: string;
    conversationId?: string;
    modelId?: string;
  }): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
    return this.post('/chat/send', params);
  }

  // --- AI Agents ---
  public async listAgents(): Promise<AgentDefinition[]> {
    const res = await this.get<{ success: boolean; data: AgentDefinition[] }>('/agents');
    return res.data;
  }

  public async runAgent(agentId: string, prompt: string): Promise<AgentExecutionRun> {
    const res = await this.post<{ success: boolean; data: AgentExecutionRun }>(`/agents/${agentId}/run`, { prompt });
    return res.data;
  }

  // --- Knowledge Hub ---
  public async listKnowledgeSpaces(): Promise<KnowledgeSpace[]> {
    const res = await this.get<{ success: boolean; data: KnowledgeSpace[] }>('/knowledge/spaces');
    return res.data;
  }

  public async ingestDocument(params: {
    knowledgeSpaceId: string;
    fileName: string;
    content: string;
  }): Promise<DocumentRecord> {
    const res = await this.post<{ success: boolean; data: DocumentRecord }>('/knowledge/ingest', params);
    return res.data;
  }

  // --- Analytics ---
  public async getAnalyticsOverview(): Promise<PlatformAnalyticsOverview> {
    const res = await this.get<{ success: boolean; data: PlatformAnalyticsOverview }>('/analytics/overview');
    return res.data;
  }

  // --- Evaluations ---
  public async runEvaluation(datasetId: string, modelId?: string): Promise<EvalRunResult> {
    const res = await this.post<{ success: boolean; data: EvalRunResult }>('/eval/run', { datasetId, modelId });
    return res.data;
  }

  private async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
    return response.json() as Promise<T>;
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
    return response.json() as Promise<T>;
  }
}

export const createCognivantaClient = (options?: CognivantaClientOptions) => new CognivantaClient(options);
