/**
 * ============================================================================
 * COGNIVANTA WORKFLOW EXECUTION RUNTIME & STATE MACHINE
 * ============================================================================
 */

import {
  WorkflowDefinition,
  WorkflowExecutionRun,
  WorkflowNode,
  generateUUID
} from '@cognivanta/core';
import { DAGSolver } from './dag';
import { modelGateway } from '@cognivanta/model-gateway';
import { hybridRetriever } from '@cognivanta/rag-engine';

export class WorkflowRuntime {
  public async executeWorkflow(
    workflow: WorkflowDefinition,
    workspaceId: string,
    triggeredBy: string,
    inputParams: Record<string, unknown> = {}
  ): Promise<WorkflowExecutionRun> {
    const runId = generateUUID();
    const startTime = Date.now();
    const sortedNodes = DAGSolver.validateAndSort(workflow);
    const nodeStates: WorkflowExecutionRun['nodeExecutionStates'] = {};
    let currentContext = { ...inputParams };

    for (const node of sortedNodes) {
      const nodeStart = Date.now();
      nodeStates[node.id] = {
        status: 'running',
        inputData: currentContext,
        startedAt: new Date(nodeStart).toISOString(),
        durationMs: 0
      };

      try {
        const output = await this.executeNode(node, currentContext);
        const nodeEnd = Date.now();

        nodeStates[node.id] = {
          status: 'success',
          inputData: currentContext,
          outputData: output,
          startedAt: new Date(nodeStart).toISOString(),
          finishedAt: new Date(nodeEnd).toISOString(),
          durationMs: nodeEnd - nodeStart
        };

        // Merge node output into pipeline context
        currentContext = { ...currentContext, [node.id]: output };
      } catch (err: unknown) {
        const nodeEnd = Date.now();
        nodeStates[node.id] = {
          status: 'failed',
          error: err instanceof Error ? err.message : String(err),
          startedAt: new Date(nodeStart).toISOString(),
          finishedAt: new Date(nodeEnd).toISOString(),
          durationMs: nodeEnd - nodeStart
        };
        break;
      }
    }

    const durationMs = Date.now() - startTime;
    const hasFailure = Object.values(nodeStates).some(s => s.status === 'failed');

    return {
      id: runId,
      workflowId: workflow.id,
      workspaceId,
      triggeredBy,
      status: hasFailure ? 'failed' : 'completed',
      nodeExecutionStates: nodeStates,
      inputParams,
      outputResult: currentContext,
      startedAt: new Date(startTime).toISOString(),
      finishedAt: new Date().toISOString(),
      durationMs
    };
  }

  private async executeNode(node: WorkflowNode, context: Record<string, unknown>): Promise<unknown> {
    switch (node.type) {
      case 'trigger_manual':
      case 'trigger_schedule':
        return { triggeredAt: new Date().toISOString(), ...context };

      case 'rag_retrieval': {
        const query = (node.config.query as string) || 'Enterprise quarterly market reports';
        const res = await hybridRetriever.retrieve({
          queryText: query,
          knowledgeSpaceIds: [],
          topK: 3,
          minScoreThreshold: 0.3,
          rerank: true
        });
        return { retrievedContext: res.assembledContext };
      }

      case 'llm_prompt': {
        const prompt = (node.config.prompt as string) || 'Analyze trend vectors and summarize insights.';
        const resp = await modelGateway.complete({
          modelId: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }]
        });
        return { text: resp.content, tokens: resp.usage.totalTokens };
      }

      case 'condition_branch': {
        return { isValid: true, evaluatedBranch: 'yes' };
      }

      case 'data_transform': {
        return { formattedAt: new Date().toISOString(), recordsProcessed: 48 };
      }

      case 'end_output':
      default:
        return { status: 'completed', contextSummary: 'DAG workflow successfully executed.' };
    }
  }
}

export const workflowRuntime = new WorkflowRuntime();
