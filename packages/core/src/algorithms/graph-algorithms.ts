/**
 * ============================================================================
 * COGNIVANTA GRAPH ALGORITHMS: PAGERANK, DIJKSTRA, & CENTRALITY
 * ============================================================================
 */

export class GraphAlgorithms {
  public static pageRank(
    adjacencyList: Map<string, string[]>,
    dampingFactor: number = 0.85,
    maxIterations: number = 20,
    tolerance: number = 0.0001
  ): Map<string, number> {
    const nodes = Array.from(adjacencyList.keys());
    const N = nodes.length;
    if (N === 0) return new Map();

    let ranks = new Map<string, number>();
    for (const node of nodes) {
      ranks.set(node, 1.0 / N);
    }

    for (let iter = 0; iter < maxIterations; iter++) {
      const newRanks = new Map<string, number>();
      let diff = 0;

      for (const node of nodes) {
        let incomingRankSum = 0;
        for (const [otherNode, neighbors] of adjacencyList.entries()) {
          if (neighbors.includes(node) && neighbors.length > 0) {
            incomingRankSum += (ranks.get(otherNode) || 0) / neighbors.length;
          }
        }

        const newRank = (1 - dampingFactor) / N + dampingFactor * incomingRankSum;
        newRanks.set(node, newRank);
        diff += Math.abs(newRank - (ranks.get(node) || 0));
      }

      ranks = newRanks;
      if (diff < tolerance) break;
    }

    return ranks;
  }

  public static shortestPathDijkstra(
    nodes: string[],
    edges: Array<{ source: string; target: string; weight: number }>,
    startNode: string,
    endNode: string
  ): { distance: number; path: string[] } {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>(nodes);

    for (const node of nodes) {
      distances.set(node, node === startNode ? 0 : Infinity);
      previous.set(node, null);
    }

    while (unvisited.size > 0) {
      let current: string | null = null;
      let minDistance = Infinity;

      for (const node of unvisited) {
        const d = distances.get(node)!;
        if (d < minDistance) {
          minDistance = d;
          current = node;
        }
      }

      if (!current || minDistance === Infinity || current === endNode) break;

      unvisited.delete(current);

      const outgoing = edges.filter(e => e.source === current);
      for (const edge of outgoing) {
        if (unvisited.has(edge.target)) {
          const alt = distances.get(current)! + edge.weight;
          if (alt < distances.get(edge.target)!) {
            distances.set(edge.target, alt);
            previous.set(edge.target, current);
          }
        }
      }
    }

    const path: string[] = [];
    let curr: string | null = endNode;
    while (curr) {
      path.unshift(curr);
      curr = previous.get(curr) || null;
    }

    return {
      distance: distances.get(endNode) || Infinity,
      path: path[0] === startNode ? path : []
    };
  }
}
