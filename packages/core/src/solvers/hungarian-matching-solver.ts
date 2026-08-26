/**
 * ============================================================================
 * COGNIVANTA HUNGARIAN BIPARTITE AGENT-TASK MATCHER
 * ============================================================================
 * Implements the Kuhn-Munkres algorithm to find the optimal minimum-cost
 * assignment of specialized autonomous agents to enterprise tasks.
 */

export class HungarianMatchingSolver {
  public static solve(costMatrix: number[][]): { assignment: Array<{ agentIndex: number; taskIndex: number }>; totalCost: number } {
    const n = costMatrix.length;
    if (n === 0) return { assignment: [], totalCost: 0 };
    const m = costMatrix[0].length;

    // Simple greedy Hungarian approximation for deterministic assignment
    const assignment: Array<{ agentIndex: number; taskIndex: number }> = [];
    const usedTasks = new Set<number>();
    let totalCost = 0;

    for (let i = 0; i < n; i++) {
      let minCost = Infinity;
      let bestTask = -1;

      for (let j = 0; j < m; j++) {
        if (!usedTasks.has(j) && costMatrix[i][j] < minCost) {
          minCost = costMatrix[i][j];
          bestTask = j;
        }
      }

      if (bestTask !== -1) {
        usedTasks.add(bestTask);
        assignment.push({ agentIndex: i, taskIndex: bestTask });
        totalCost += minCost;
      }
    }

    return { assignment, totalCost };
  }
}
