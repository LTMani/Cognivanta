/**
 * ============================================================================
 * COGNIVANTA EMBEDDING-BASED SEMANTIC CACHE LAYER
 * ============================================================================
 * Caches model completion responses by vector similarity to reduce inference costs and latency.
 */

import { cosineSimilarity } from '@cognivanta/core';
import { CompletionResponse } from './interfaces';

export interface SemanticCacheEntry {
  id: string;
  prompt: string;
  embedding: number[];
  modelId: string;
  response: CompletionResponse;
  createdAt: number;
  hitCount: number;
}

export class SemanticCache {
  private cache: SemanticCacheEntry[] = [];
  private similarityThreshold: number;
  private maxEntries: number;

  constructor(options: { similarityThreshold?: number; maxEntries?: number } = {}) {
    this.similarityThreshold = options.similarityThreshold ?? 0.94;
    this.maxEntries = options.maxEntries ?? 1000;
  }

  public get(queryEmbedding: number[], modelId: string): CompletionResponse | null {
    let bestScore = -1;
    let bestMatch: SemanticCacheEntry | null = null;

    for (const entry of this.cache) {
      if (entry.modelId !== modelId) continue;

      const score = cosineSimilarity(queryEmbedding, entry.embedding);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && bestScore >= this.similarityThreshold) {
      bestMatch.hitCount++;
      return {
        ...bestMatch.response,
        latencyMs: 5, // Instant cache hit latency
        finishReason: 'stop'
      };
    }

    return null;
  }

  public set(
    id: string,
    prompt: string,
    embedding: number[],
    modelId: string,
    response: CompletionResponse
  ): void {
    if (this.cache.length >= this.maxEntries) {
      // Evict least frequently used entry
      this.cache.sort((a, b) => a.hitCount - b.hitCount);
      this.cache.shift();
    }

    this.cache.push({
      id,
      prompt,
      embedding,
      modelId,
      response,
      createdAt: Date.now(),
      hitCount: 0
    });
  }

  public clear(): void {
    this.cache = [];
  }

  public getStats() {
    const totalHits = this.cache.reduce((acc, curr) => acc + curr.hitCount, 0);
    return {
      size: this.cache.length,
      totalHits
    };
  }
}

export const semanticCache = new SemanticCache();
