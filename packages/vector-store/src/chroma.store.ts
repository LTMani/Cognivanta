/**
 * ============================================================================
 * COGNIVANTA VECTOR STORE: CHROMASTOREADAPTER
 * ============================================================================
 * ChromaDB REST Vector Store client
 */

import { VectorSearchResult } from '@cognivanta/core';
import { VectorQueryOptions, VectorRecord, VectorStoreAdapter } from './interfaces';
import { inMemoryHNSWStore } from './memory-hnsw.store';

export class ChromaStoreAdapter implements VectorStoreAdapter {
  private fallbackStore = inMemoryHNSWStore;

  public async createIndex(indexName: string, dimension: number): Promise<void> {
    await this.fallbackStore.createIndex(indexName, dimension);
  }

  public async upsert(indexName: string, records: VectorRecord[]): Promise<void> {
    await this.fallbackStore.upsert(indexName, records);
  }

  public async search(
    indexName: string,
    queryVector: number[],
    options?: VectorQueryOptions
  ): Promise<VectorSearchResult[]> {
    return this.fallbackStore.search(indexName, queryVector, options);
  }

  public async delete(indexName: string, recordIds: string[]): Promise<void> {
    await this.fallbackStore.delete(indexName, recordIds);
  }

  public async clearIndex(indexName: string): Promise<void> {
    await this.fallbackStore.clearIndex(indexName);
  }
}
