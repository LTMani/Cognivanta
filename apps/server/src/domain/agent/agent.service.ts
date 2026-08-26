/**
 * ============================================================================
 * COGNIVANTA AGENT MANAGEMENT & ORCHESTRATION SERVICE
 * ============================================================================
 */

import {
  AgentDefinition,
  AgentExecutionRun,
  generateUUID,
  NotFoundError,
  AgentRoleType
} from '@cognivanta/core';
import { agentRepository, auditRepository } from '@cognivanta/db';
import { agentExecutor } from '@cognivanta/agent-engine';

export class AgentService {
  constructor() {
    this.seedDefaultAgents();
  }

  private async seedDefaultAgents(): Promise<void> {
    const existing = await agentRepository.findByWorkspace('ws-default-enterprise');
    if (existing.length === 0) {
      const defaultAgents: Array<Partial<AgentDefinition>> = [
        {
          name: 'Research Assistant',
          description: 'Helps in researching and summarizing topics across enterprise knowledge spaces.',
          roleType: 'researcher',
          systemInstructions: 'You are an elite research assistant. Synthesize grounded findings with clear citations.',
          modelId: 'gpt-4o',
          enabledToolIds: ['web_search', 'rag_query']
        },
        {
          name: 'Document Analyst',
          description: 'Extracts insights, tables, and structured entities from PDF, Word, and Excel docs.',
          roleType: 'document_analyst',
          systemInstructions: 'You are a meticulous document analyst. Extract key figures, entities, and risk factors.',
          modelId: 'claude-3-5-sonnet',
          enabledToolIds: ['rag_query']
        },
        {
          name: 'Data Analyst',
          description: 'Analyzes structured datasets, writes SQL queries, and generates chart insights.',
          roleType: 'data_analyst',
          systemInstructions: 'You are a senior data analyst. Perform statistical breakdowns and trend calculations.',
          modelId: 'gpt-4o',
          enabledToolIds: ['calculator']
        }
      ];

      for (const a of defaultAgents) {
        await this.createAgent({
          organizationId: 'org-cognivanta-inc',
          workspaceId: 'ws-default-enterprise',
          name: a.name!,
          description: a.description!,
          roleType: a.roleType!,
          systemInstructions: a.systemInstructions!,
          modelId: a.modelId,
          enabledToolIds: a.enabledToolIds
        });
      }
    }
  }

  public async listAgents(workspaceId: string): Promise<AgentDefinition[]> {
    return agentRepository.findByWorkspace(workspaceId);
  }

  public async createAgent(params: {
    organizationId: string;
    workspaceId: string;
    name: string;
    description: string;
    roleType?: AgentRoleType;
    systemInstructions: string;
    modelId?: string;
    enabledToolIds?: string[];
  }): Promise<AgentDefinition> {
    const id = generateUUID();
    const agent: AgentDefinition = {
      id,
      organizationId: params.organizationId,
      workspaceId: params.workspaceId,
      name: params.name,
      description: params.description,
      roleType: params.roleType || 'custom',
      status: 'active',
      systemInstructions: params.systemInstructions,
      modelId: params.modelId || 'gpt-4o',
      temperature: 0.2,
      maxIterations: 10,
      timeoutSeconds: 120,
      enabledToolIds: params.enabledToolIds || ['web_search'],
      knowledgeSpaceIds: [],
      memorySettings: {
        enableShortTermMemory: true,
        enableLongTermMemory: true,
        enableSemanticMemory: true,
        maxMemoryTokens: 4000,
        reflectionIntervalRuns: 5
      },
      permissions: {
        allowedToolDomains: ['*'],
        allowInternetAccess: true,
        allowCodeExecution: false,
        allowDatabaseWrite: false,
        requireHumanApprovalForActions: []
      },
      metrics: {
        totalRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
        averageDurationMs: 0,
        totalTokensUsed: 0,
        totalCostUSD: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return agentRepository.create(agent);
  }

  public async executeAgent(params: {
    agentId: string;
    workspaceId: string;
    userId: string;
    userEmail: string;
    prompt: string;
  }): Promise<AgentExecutionRun> {
    const agent = await agentRepository.findById(params.agentId);
    if (!agent) throw new NotFoundError(`Agent ${params.agentId} not found.`);

    const runResult = await agentExecutor.runAgent(
      agent,
      params.prompt,
      params.workspaceId,
      params.userId
    );

    // Update agent metrics
    agent.metrics.totalRuns++;
    agent.metrics.successfulRuns++;
    agent.metrics.totalTokensUsed += runResult.totalTokensUsed;
    agent.metrics.totalCostUSD += runResult.totalCostUSD;
    await agentRepository.update(agent.id, { metrics: agent.metrics });

    return runResult;
  }
}

export const agentService = new AgentService();
