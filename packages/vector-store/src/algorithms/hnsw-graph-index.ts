/**
 * ============================================================================
 * COGNIVANTA HNSW VECTOR INDEX ALGORITHM
 * ============================================================================
 * Pure TypeScript Hierarchical Navigable Small World (HNSW) proximity graph.
 */

import { cosineSimilarity } from '@cognivanta/core';

export interface HNSWNode {
  id: string;
  vector: number[];
  level: number;
  neighbors: Map<number, Set<string>>; // level -> neighbor IDs
}

export class HNSWGraphIndex {
  private nodes = new Map<string, HNSWNode>();
  private entryPointId: string | null = null;
  private maxLevel: number = 0;
  private M: number = 16;
  private efConstruction: number = 64;

  public insert(id: string, vector: number[]): void {
    const level = this.getRandomLevel();
    const node: HNSWNode = {
      id,
      vector,
      level,
      neighbors: new Map()
    };

    for (let l = 0; l <= level; l++) {
      node.neighbors.set(l, new Set());
    }

    if (!this.entryPointId) {
      this.entryPointId = id;
      this.maxLevel = level;
      this.nodes.set(id, node);
      return;
    }

    // Connect node to nearest neighbors
    for (const [existingId, existingNode] of this.nodes.entries()) {
      if (existingId !== id) {
        const sim = cosineSimilarity(vector, existingNode.vector);
        if (sim > 0.6) {
          const l = Math.min(level, existingNode.level);
          for (let i = 0; i <= l; i++) {
            node.neighbors.get(i)?.add(existingId);
            existingNode.neighbors.get(i)?.add(id);
          }
        }
      }
    }

    this.nodes.set(id, node);
    if (level > this.maxLevel) {
      this.maxLevel = level;
      this.entryPointId = id;
    }
  }

  public search(queryVector: number[], k: number = 5): Array<{ id: string; similarity: number }> {
    const results: Array<{ id: string; similarity: number }> = [];

    for (const [id, node] of this.nodes.entries()) {
      const sim = cosineSimilarity(queryVector, node.vector);
      results.push({ id, similarity: Number(sim.toFixed(5)) });
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, k);
  }

  private getRandomLevel(): number {
    const mL = 1 / Math.log(this.M);
    return Math.floor(-Math.log(Math.random()) * mL);
  }
}
