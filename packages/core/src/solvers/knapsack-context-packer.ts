/**
 * ============================================================================
 * COGNIVANTA 0/1 KNAPSACK CONTEXT WINDOW PACKER
 * ============================================================================
 * Maximizes information retrieval value within strict token context limits.
 */

export interface ContextChunkItem {
  id: string;
  tokens: number;
  relevanceScore: number;
  content: string;
}

export class KnapsackContextPacker {
  public static pack(items: ContextChunkItem[], maxTokens: number): {
    packedItems: ContextChunkItem[];
    totalTokens: number;
    totalScore: number;
  } {
    const N = items.length;
    if (N === 0 || maxTokens <= 0) return { packedItems: [], totalTokens: 0, totalScore: 0 };

    // Dynamic programming matrix
    const dp: number[][] = Array.from({ length: N + 1 }, () => new Array(maxTokens + 1).fill(0));

    for (let i = 1; i <= N; i++) {
      const item = items[i - 1];
      const w = item.tokens;
      const v = Math.round(item.relevanceScore * 1000);

      for (let c = 0; c <= maxTokens; c++) {
        if (w <= c) {
          dp[i][c] = Math.max(dp[i - 1][c], dp[i - 1][c - w] + v);
        } else {
          dp[i][c] = dp[i - 1][c];
        }
      }
    }

    // Backtrack to find chosen items
    const chosen: ContextChunkItem[] = [];
    let curCap = maxTokens;

    for (let i = N; i > 0; i--) {
      if (dp[i][curCap] !== dp[i - 1][curCap]) {
        const item = items[i - 1];
        chosen.push(item);
        curCap -= item.tokens;
      }
    }

    const totalTokens = chosen.reduce((acc, item) => acc + item.tokens, 0);
    const totalScore = Number(chosen.reduce((acc, item) => acc + item.relevanceScore, 0).toFixed(4));

    return {
      packedItems: chosen.reverse(),
      totalTokens,
      totalScore
    };
  }
}
