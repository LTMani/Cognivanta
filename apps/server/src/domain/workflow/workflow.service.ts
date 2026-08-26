/**
 * ============================================================================
 * COGNIVANTA WORKFLOW MANAGEMENT SERVICE
 * ============================================================================
 */

import {
  WorkflowDefinition,
  WorkflowExecutionRun,
  generateUUID,
  NotFoundError
} from '@cognivanta/core';
import { workflowRepository, auditRepository } from '@cognivanta/db';
import { workflowRuntime } from '@cognivanta/workflow-engine';

export class WorkflowService {
  constructor() {
    this.seedDefaultWorkflow();
  }

  private async seedDefaultWorkflow(): Promise<void> {
    const existing = await workflowRepository.findByWorkspace('ws-default-enterprise');
    if (existing.length === 0) {
      await this.saveWorkflow({
        workspaceId: 'ws-default-enterprise',
        name: 'Market Research Workflow',
        description: 'Scheduled daily workflow analyzing market news and report trends.',
        nodes: [
          { id: 'node-1', type: 'trigger_schedule', title: 'Schedule Daily', position: { x: 250, y: 50 }, config: {} },
          { id: 'node-2', type: 'rag_retrieval', title: 'Market Reports', position: { x: 250, y: 150 }, config: {} },
          { id: 'node-3', type: 'llm_prompt', title: 'Analyze Trends', position: { x: 250, y: 250 }, config: {} },
          { id: 'node-4', type: 'condition_branch', title: 'Is Data Valid?', position: { x: 250, y: 350 }, config: {} },
          { id: 'node-5', type: 'data_transform', title: 'Format Output', position: { x: 150, y: 450 }, config: {} },
          { id: 'node-6', type: 'end_output', title: 'End', position: { x: 150, y: 550 }, config: {} }
        ],
        edges: [
          { id: 'e1-2', source: 'node-1', target: 'node-2' },
          { id: 'e2-3', source: 'node-2', target: 'node-3' },
          { id: 'e3-4', source: 'node-3', target: 'node-4' },
          { id: 'e4-5', source: 'node-4', target: 'node-5', conditionLabel: 'Yes' },
          { id: 'e5-6', source: 'node-5', target: 'node-6' }
        ]
      });
    }
  }

  public async listWorkflows(workspaceId: string): Promise<WorkflowDefinition[]> {
    return workflowRepository.findByWorkspace(workspaceId);
  }

  public async saveWorkflow(params: {
    workspaceId: string;
    name: string;
    description?: string;
    nodes: WorkflowDefinition['nodes'];
    edges: WorkflowDefinition['edges'];
  }): Promise<WorkflowDefinition> {
    const id = generateUUID();
    const wf: WorkflowDefinition = {
      id,
      workspaceId: params.workspaceId,
      name: params.name,
      description: params.description,
      version: 1,
      status: 'draft',
      nodes: params.nodes,
      edges: params.edges,
      triggerConfig: { type: 'manual' },
      metrics: {
        totalRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
        avgExecutionSeconds: 1.42
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return workflowRepository.create(wf);
  }

  public async executeWorkflow(params: {
    workflowId: string;
    workspaceId: string;
    triggeredBy: string;
    inputParams?: Record<string, unknown>;
  }): Promise<WorkflowExecutionRun> {
    const wf = await workflowRepository.findById(params.workflowId);
    if (!wf) throw new NotFoundError(`Workflow ${params.workflowId} not found.`);

    const runResult = await workflowRuntime.executeWorkflow(
      wf,
      params.workspaceId,
      params.triggeredBy,
      params.inputParams
    );

    // Update workflow metrics
    wf.metrics.totalRuns++;
    if (runResult.status === 'completed') wf.metrics.successfulRuns++;
    else wf.metrics.failedRuns++;
    await workflowRepository.update(wf.id, { metrics: wf.metrics });

    return runResult;
  }
}

export const workflowService = new WorkflowService();
