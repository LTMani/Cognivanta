/**
 * ============================================================================
 * COGNIVANTA ANALYTICS & TOKEN USAGE REPOSITORY
 * ============================================================================
 */

import { TokenUsageRecord, PlatformAnalyticsOverview } from '@cognivanta/core';
import { dbMemory } from '../db.client';

export class AnalyticsRepository {
  public async recordUsage(record: TokenUsageRecord): Promise<TokenUsageRecord> {
    dbMemory.tokenUsageRecords.push(record);
    return record;
  }

  public async getOverview(orgId: string): Promise<PlatformAnalyticsOverview> {
    const records = dbMemory.tokenUsageRecords.filter(r => r.organizationId === orgId);

    const totalQueries = records.length || 34568; // Demo baseline if fresh
    let totalTokensUsed = 0;
    let totalCostUSD = 0;

    for (const r of records) {
      totalTokensUsed += r.totalTokens;
      totalCostUSD += r.estimatedCostUSD;
    }

    if (records.length === 0) {
      totalTokensUsed = 84290120;
      totalCostUSD = 2450.75;
    }

    const activeUsersCount = dbMemory.users.size || 1248;
    const activeAgentsCount = dbMemory.agents.size || 28;
    const activeWorkflowsCount = dbMemory.workflows.size || 12;
    const totalDocumentsCount = dbMemory.documents.size || 2341;
    const storageUsedBytes = 45.6 * 1024 * 1024 * 1024; // 45.6 GB

    // Mock realistic timeseries
    const queriesOverTime = [
      { timestamp: 'May 1', queryCount: 3200, totalTokens: 8200000, costUSD: 230, avgLatencyMs: 1200, errorCount: 4 },
      { timestamp: 'May 7', queryCount: 4100, totalTokens: 9500000, costUSD: 290, avgLatencyMs: 1150, errorCount: 2 },
      { timestamp: 'May 14', queryCount: 5800, totalTokens: 14200000, costUSD: 410, avgLatencyMs: 1300, errorCount: 5 },
      { timestamp: 'May 21', queryCount: 7642, totalTokens: 18900000, costUSD: 540, avgLatencyMs: 1240, errorCount: 3 },
      { timestamp: 'May 28', queryCount: 6800, totalTokens: 16100000, costUSD: 480, avgLatencyMs: 1180, errorCount: 1 }
    ];

    const topUsersByQueries = [
      { userId: 'u-1', userName: 'Tharun (Admin)', queryCount: 4842, tokenCount: 12400000, costUSD: 360.50 },
      { userId: 'u-2', userName: 'Sarah Johnson', queryCount: 3214, tokenCount: 8900000, costUSD: 258.20 },
      { userId: 'u-3', userName: 'Michael Brown', queryCount: 2987, tokenCount: 7800000, costUSD: 226.10 },
      { userId: 'u-4', userName: 'Jessica Davis', queryCount: 2456, tokenCount: 6400000, costUSD: 185.40 },
      { userId: 'u-5', userName: 'David Wilson', queryCount: 1987, tokenCount: 5100000, costUSD: 147.90 }
    ];

    return {
      totalQueries,
      totalTokensUsed,
      totalCostUSD,
      activeUsersCount,
      activeAgentsCount,
      activeWorkflowsCount,
      totalDocumentsCount,
      storageUsedBytes,
      systemHealthPercentage: 99.9,
      queryDistribution: {
        'AI Chat': 45,
        'RAG Search': 25,
        'Agents': 15,
        'Workflows': 10,
        'Other': 5
      },
      queriesOverTime,
      topUsersByQueries
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
