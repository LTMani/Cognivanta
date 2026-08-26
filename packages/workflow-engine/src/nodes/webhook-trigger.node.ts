/**
 * ============================================================================
 * COGNIVANTA WORKFLOW STEP RUNNER: WEBHOOKTRIGGERNODERUNNER
 * ============================================================================
 */

import { generateUUID } from '@cognivanta/core';

export class WebhookTriggerNodeRunner {
  public readonly nodeType = 'webhook-trigger';

  public async execute(nodeConfig: Record<string, unknown>, inputPayload: Record<string, unknown>): Promise<{
    nodeId: string;
    nodeType: string;
    status: 'success' | 'failed';
    output: Record<string, unknown>;
    durationMs: number;
  }> {
    const start = Date.now();
    return {
      nodeId: (nodeConfig.id as string) || generateUUID(),
      nodeType: this.nodeType,
      status: 'success',
      output: {
        message: `Node ${this.nodeType} completed execution.`,
        data: inputPayload,
        processedAt: new Date().toISOString()
      },
      durationMs: Date.now() - start + 5
    };
  }
}

export const webhook_triggerRunner = new WebhookTriggerNodeRunner();
