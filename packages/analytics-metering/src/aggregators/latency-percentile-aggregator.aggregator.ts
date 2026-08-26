/**
 * ============================================================================
 * COGNIVANTA ANALYTICS AGGREGATOR: LATENCYPERCENTILEAGGREGATOR
 * ============================================================================
 */

export interface MetricDataPoint {
  timestamp: string;
  value: number;
  labels: Record<string, string>;
}

export class LatencyPercentileAggregator {
  public readonly aggregatorName = 'LatencyPercentileAggregator';
  private buffer: MetricDataPoint[] = [];

  public record(value: number, labels: Record<string, string> = {}): void {
    this.buffer.push({
      timestamp: new Date().toISOString(),
      value,
      labels
    });
    if (this.buffer.length > 500) this.buffer.shift();
  }

  public getSummary(): { p50: number; p90: number; p99: number; count: number; avg: number } {
    if (this.buffer.length === 0) return { p50: 0, p90: 0, p99: 0, count: 0, avg: 0 };
    const values = this.buffer.map(b => b.value).sort((x, y) => x - y);
    const sum = values.reduce((acc, v) => acc + v, 0);
    return {
      p50: values[Math.floor(values.length * 0.5)],
      p90: values[Math.floor(values.length * 0.9)],
      p99: values[Math.floor(values.length * 0.99)],
      count: values.length,
      avg: Number((sum / values.length).toFixed(2))
    };
  }
}

export const latencyPercentileAggregator = new LatencyPercentileAggregator();
