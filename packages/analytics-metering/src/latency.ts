/**
 * ============================================================================
 * COGNIVANTA LATENCY PERCENTILE & STATISTICAL METRIC CALCULATOR
 * ============================================================================
 */

export interface LatencyDistribution {
  count: number;
  minMs: number;
  maxMs: number;
  meanMs: number;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  standardDeviationMs: number;
}

export class LatencyMetricsCalculator {
  public calculate(samples: number[]): LatencyDistribution {
    if (samples.length === 0) {
      return {
        count: 0,
        minMs: 0,
        maxMs: 0,
        meanMs: 0,
        p50Ms: 0,
        p90Ms: 0,
        p95Ms: 0,
        p99Ms: 0,
        standardDeviationMs: 0
      };
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    const mean = sum / sorted.length;

    const variance = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / sorted.length;
    const stdDev = Math.sqrt(variance);

    const percentile = (p: number) => {
      const idx = Math.ceil((p / 100) * sorted.length) - 1;
      return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
    };

    return {
      count: sorted.length,
      minMs: sorted[0],
      maxMs: sorted[sorted.length - 1],
      meanMs: Number(mean.toFixed(2)),
      p50Ms: percentile(50),
      p90Ms: percentile(90),
      p95Ms: percentile(95),
      p99Ms: percentile(99),
      standardDeviationMs: Number(stdDev.toFixed(2))
    };
  }
}

export const latencyCalculator = new LatencyMetricsCalculator();
