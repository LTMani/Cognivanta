/**
 * ============================================================================
 * COGNIVANTA VECTOR STORE INTERFACES & CONTRACTS
 * ============================================================================
 */

import { DocumentChunk, VectorSearchResult } from '@cognivanta/core';

export interface VectorRecord {
  id: string;
  vector: number[];
  chunk: DocumentChunk;
  metadata?: Record<string, unknown>;
}

export interface VectorQueryOptions {
  topK?: number;
  minScore?: number;
  filter?: Record<string, unknown>;
}

export interface VectorStoreAdapter {
  createIndex(indexName: string, dimension: number): Promise<void>;
  upsert(indexName: string, records: VectorRecord[]): Promise<void>;
  search(indexName: string, queryVector: number[], options?: VectorQueryOptions): Promise<VectorSearchResult[]>;
  delete(indexName: string, recordIds: string[]): Promise<void>;
  clearIndex(indexName: string): Promise<void>;
}
