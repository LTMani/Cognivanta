/**
 * ============================================================================
 * COGNIVANTA TIMESERIES ANALYTICS AGGREGATOR & COST ATTRIBUTION
 * ============================================================================
 */

import { TokenUsageRecord, AnalyticsTimeseriesPoint } from '@cognivanta/core';

export interface CostAttributionBreakdown {
  byModel: Record<string, { tokenCount: number; costUSD: number; queryCount: number }>;
  byWorkspace: Record<string, { tokenCount: number; costUSD: number; queryCount: number }>;
  byUser: Record<string, { tokenCount: number; costUSD: number; queryCount: number }>;
}

export class AnalyticsAggregator {
  public aggregateTimeseries(
    records: TokenUsageRecord[],
    bucket: 'day' | 'hour' = 'day'
  ): AnalyticsTimeseriesPoint[] {
    const buckets = new Map<string, {
      queryCount: number;
      totalTokens: number;
      costUSD: number;
      latencies: number[];
      errorCount: number;
    }>();

    for (const r of records) {
      const date = new Date(r.timestamp);
      const key = bucket === 'day'
        ? date.toISOString().split('T')[0]
        : `${date.toISOString().split('T')[0]} ${date.getHours()}:00`;

      if (!buckets.has(key)) {
        buckets.set(key, { queryCount: 0, totalTokens: 0, costUSD: 0, latencies: [], errorCount: 0 });
      }

      const b = buckets.get(key)!;
      b.queryCount++;
      b.totalTokens += r.totalTokens;
      b.costUSD += r.estimatedCostUSD;
      b.latencies.push(r.latencyMs);
      if (r.statusCode >= 400) b.errorCount++;
    }

    return Array.from(buckets.entries()).map(([timestamp, data]) => {
      const avgLat = data.latencies.length > 0
        ? data.latencies.reduce((a, b) => a + b, 0) / data.latencies.length
        : 0;

      return {
        timestamp,
        queryCount: data.queryCount,
        totalTokens: data.totalTokens,
        costUSD: Number(data.costUSD.toFixed(4)),
        avgLatencyMs: Number(avgLat.toFixed(2)),
        errorCount: data.errorCount
      };
    });
  }

  public attributeCost(records: TokenUsageRecord[]): CostAttributionBreakdown {
    const byModel: CostAttributionBreakdown['byModel'] = {};
    const byWorkspace: CostAttributionBreakdown['byWorkspace'] = {};
    const byUser: CostAttributionBreakdown['byUser'] = {};

    for (const r of records) {
      // By Model
      if (!byModel[r.modelName]) byModel[r.modelName] = { tokenCount: 0, costUSD: 0, queryCount: 0 };
      byModel[r.modelName].tokenCount += r.totalTokens;
      byModel[r.modelName].costUSD += r.estimatedCostUSD;
      byModel[r.modelName].queryCount++;

      // By Workspace
      if (!byWorkspace[r.workspaceId]) byWorkspace[r.workspaceId] = { tokenCount: 0, costUSD: 0, queryCount: 0 };
      byWorkspace[r.workspaceId].tokenCount += r.totalTokens;
      byWorkspace[r.workspaceId].costUSD += r.estimatedCostUSD;
      byWorkspace[r.workspaceId].queryCount++;

      // By User
      const uKey = r.userId || 'system_service';
      if (!byUser[uKey]) byUser[uKey] = { tokenCount: 0, costUSD: 0, queryCount: 0 };
      byUser[uKey].tokenCount += r.totalTokens;
      byUser[uKey].costUSD += r.estimatedCostUSD;
      byUser[uKey].queryCount++;
    }

    return { byModel, byWorkspace, byUser };
  }
}

export class AnomalyDetector {
  public detectSpikes(
    points: AnalyticsTimeseriesPoint[],
    multiplier: number = 2.5
  ): AnalyticsTimeseriesPoint[] {
    if (points.length < 3) return [];

    const queryCounts = points.map(p => p.queryCount);
    const avg = queryCounts.reduce((a, b) => a + b, 0) / queryCounts.length;
    const threshold = avg * multiplier;

    return points.filter(p => p.queryCount > threshold);
  }
}

export const analyticsAggregator = new AnalyticsAggregator();
export const anomalyDetector = new AnomalyDetector();
