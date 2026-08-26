/**
 * ============================================================================
 * COGNIVANTA AGENT TOOL REGISTRY & RUNTIME DISPATCHER
 * ============================================================================
 */

import { ToolDefinition, ToolResult, NotFoundError } from '@cognivanta/core';

export interface AgentToolExecutor {
  readonly definition: ToolDefinition;
  execute(params: Record<string, unknown>): Promise<unknown>;
}

export class ToolRegistry {
  private tools = new Map<string, AgentToolExecutor>();

  public register(tool: AgentToolExecutor): void {
    this.tools.set(tool.definition.name, tool);
  }

  public getTool(name: string): AgentToolExecutor | undefined {
    return this.tools.get(name);
  }

  public listDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map(t => t.definition);
  }

  public async executeTool(name: string, callId: string, params: Record<string, unknown>): Promise<ToolResult> {
    const startTime = Date.now();
    const tool = this.tools.get(name);

    if (!tool) {
      return {
        toolCallId: callId,
        toolName: name,
        result: null,
        error: `Tool "${name}" is not registered in this agent environment.`,
        executionTimeMs: Date.now() - startTime
      };
    }

    try {
      const result = await tool.execute(params);
      return {
        toolCallId: callId,
        toolName: name,
        result,
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: unknown) {
      return {
        toolCallId: callId,
        toolName: name,
        result: null,
        error: err instanceof Error ? err.message : String(err),
        executionTimeMs: Date.now() - startTime
      };
    }
  }
}

export const toolRegistry = new ToolRegistry();
