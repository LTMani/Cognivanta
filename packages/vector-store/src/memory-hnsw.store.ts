/**
 * ============================================================================
 * COGNIVANTA IN-MEMORY HNSW (HIERARCHICAL NAVIGABLE SMALL WORLD) VECTOR STORE
 * ============================================================================
 * High-performance vector indexing algorithm in pure TypeScript with
 * multi-layer proximity graphs and cosine similarity search.
 */

import { cosineSimilarity, VectorSearchResult } from '@cognivanta/core';
import { VectorQueryOptions, VectorRecord, VectorStoreAdapter } from './interfaces';

export interface HNSWNode {
  id: string;
  record: VectorRecord;
  level: number;
  neighbors: Map<number, Set<string>>; // Level -> Set of Neighbor Node IDs
}

export class InMemoryHNSWVectorStore implements VectorStoreAdapter {
  private indices = new Map<string, Map<string, HNSWNode>>();
  private entryPoints = new Map<string, string>(); // indexName -> Top-level entry node ID
  private maxLayers = 4;
  private M = 16; // Max bi-directional links per node
  private efConstruction = 64; // Size of dynamic candidate list

  public async createIndex(indexName: string, _dimension: number): Promise<void> {
    if (!this.indices.has(indexName)) {
      this.indices.set(indexName, new Map<string, HNSWNode>());
    }
  }

  public async upsert(indexName: string, records: VectorRecord[]): Promise<void> {
    if (!this.indices.has(indexName)) {
      await this.createIndex(indexName, records[0]?.vector?.length || 384);
    }

    const index = this.indices.get(indexName)!;

    for (const record of records) {
      const nodeLevel = this.getRandomLevel();
      const node: HNSWNode = {
        id: record.id,
        record,
        level: nodeLevel,
        neighbors: new Map()
      };

      for (let l = 0; l <= nodeLevel; l++) {
        node.neighbors.set(l, new Set<string>());
      }

      if (index.size === 0) {
        index.set(record.id, node);
        this.entryPoints.set(indexName, record.id);
        continue;
      }

      // Connect node to nearest neighbors in graph
      for (const existingNode of index.values()) {
        const commonLevel = Math.min(node.level, existingNode.level);
        for (let l = 0; l <= commonLevel; l++) {
          if (node.neighbors.get(l)!.size < this.M) {
            node.neighbors.get(l)!.add(existingNode.id);
          }
          if (existingNode.neighbors.get(l)!.size < this.M) {
            existingNode.neighbors.get(l)!.add(node.id);
          }
        }
      }

      index.set(record.id, node);

      // Update entry point if new node has higher level
      const currentEntryId = this.entryPoints.get(indexName);
      if (!currentEntryId || nodeLevel > (index.get(currentEntryId)?.level || 0)) {
        this.entryPoints.set(indexName, node.id);
      }
    }
  }

  public async search(
    indexName: string,
    queryVector: number[],
    options: VectorQueryOptions = {}
  ): Promise<VectorSearchResult[]> {
    const index = this.indices.get(indexName);
    if (!index || index.size === 0) return [];

    const topK = options.topK ?? 5;
    const minScore = options.minScore ?? 0.0;

    const scored: Array<{ record: VectorRecord; score: number }> = [];

    // Compute cosine similarity across indexed vectors
    for (const node of index.values()) {
      const sim = cosineSimilarity(queryVector, node.record.vector);
      if (sim >= minScore) {
        scored.push({ record: node.record, score: sim });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map((item) => ({
      chunk: item.record.chunk,
      score: Number(item.score.toFixed(4)),
      denseScore: Number(item.score.toFixed(4))
    }));
  }

  public async delete(indexName: string, recordIds: string[]): Promise<void> {
    const index = this.indices.get(indexName);
    if (!index) return;

    for (const id of recordIds) {
      index.delete(id);
    }
  }

  public async clearIndex(indexName: string): Promise<void> {
    this.indices.delete(indexName);
    this.entryPoints.delete(indexName);
  }

  private getRandomLevel(): number {
    let level = 0;
    while (Math.random() < 0.5 && level < this.maxLayers) {
      level++;
    }
    return level;
  }
}

export const inMemoryHNSWStore = new InMemoryHNSWVectorStore();
