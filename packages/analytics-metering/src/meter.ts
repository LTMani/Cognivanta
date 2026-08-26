/**
 * ============================================================================
 * COGNIVANTA TOKEN USAGE METER & REAL-TIME QUOTA CHECKER
 * ============================================================================
 */

import {
  TokenUsageRecord,
  QuotaExceededError,
  generateUUID,
  LLMProvider
} from '@cognivanta/core';

export class TokenUsageMeter {
  private records: TokenUsageRecord[] = [];
  private monthlyQuotas = new Map<string, number>(); // orgId -> tokenQuota

  public setMonthlyQuota(orgId: string, quota: number): void {
    this.monthlyQuotas.set(orgId, quota);
  }

  public checkQuota(orgId: string, requiredTokens: number): void {
    const quota = this.monthlyQuotas.get(orgId);
    if (!quota) return;

    const used = this.getTokensUsedInPeriod(orgId);
    if (used + requiredTokens > quota) {
      throw new QuotaExceededError(
        `Organization ${orgId} has exceeded its monthly token quota of ${quota.toLocaleString()} tokens.`
      );
    }
  }

  public recordUsage(params: {
    organizationId: string;
    workspaceId: string;
    userId?: string;
    agentId?: string;
    workflowId?: string;
    provider: LLMProvider;
    modelName: string;
    promptTokens: number;
    completionTokens: number;
    costUSD: number;
    latencyMs: number;
    statusCode?: number;
  }): TokenUsageRecord {
    const record: TokenUsageRecord = {
      id: generateUUID(),
      organizationId: params.organizationId,
      workspaceId: params.workspaceId,
      userId: params.userId,
      agentId: params.agentId,
      workflowId: params.workflowId,
      provider: params.provider,
      modelName: params.modelName,
      promptTokens: params.promptTokens,
      completionTokens: params.completionTokens,
      totalTokens: params.promptTokens + params.completionTokens,
      estimatedCostUSD: params.costUSD,
      latencyMs: params.latencyMs,
      statusCode: params.statusCode || 200,
      timestamp: new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  public getTokensUsedInPeriod(orgId: string): number {
    return this.records
      .filter(r => r.organizationId === orgId)
      .reduce((acc, r) => acc + r.totalTokens, 0);
  }

  public getRecords(orgId: string): TokenUsageRecord[] {
    return this.records.filter(r => r.organizationId === orgId);
  }
}

export const tokenUsageMeter = new TokenUsageMeter();
