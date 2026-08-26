/**
 * ============================================================================
 * COGNIVANTA HYBRID RETRIEVER WITH RECIPROCAL RANK FUSION (RRF)
 * ============================================================================
 * Blends Dense Vector similarity (HNSW) and Sparse Lexical BM25 ranking.
 */

import {
  DocumentChunk,
  RAGRetrievalQuery,
  RAGRetrievalResult,
  VectorSearchResult
} from '@cognivanta/core';
import { inMemoryHNSWStore } from '@cognivanta/vector-store';
import { modelGateway } from '@cognivanta/model-gateway';
import { bm25Ranker } from './bm25.ranker';

export class HybridRAGRetriever {
  private rrfK: number = 60; // Standard RRF damping factor

  public async retrieve(query: RAGRetrievalQuery): Promise<RAGRetrievalResult> {
    const startTime = Date.now();

    // 1. Generate Query Vector Embedding
    const embedRes = await modelGateway.embed({
      modelId: 'text-embedding-3-small',
      input: query.queryText
    });
    const queryVector = embedRes.embeddings[0];

    const allDenseResults: VectorSearchResult[] = [];
    const allSparseResults: Array<{ chunk: DocumentChunk; score: number }> = [];

    // 2. Query each knowledge space
    for (const spaceId of query.knowledgeSpaceIds) {
      const indexName = `idx_${spaceId.replace(/-/g, '_')}`;

      // Dense HNSW Vector Search
      const dense = await inMemoryHNSWStore.search(indexName, queryVector, {
        topK: query.topK * 2,
        minScore: query.minScoreThreshold
      });
      allDenseResults.push(...dense);

      // Sparse BM25 Search
      const sparse = bm25Ranker.search(indexName, query.queryText, query.topK * 2);
      allSparseResults.push(...sparse);
    }

    // 3. Compute Reciprocal Rank Fusion (RRF)
    const fusedScores = new Map<string, { chunk: DocumentChunk; rrfScore: number; denseScore: number; sparseScore: number }>();

    allDenseResults.forEach((res, rank) => {
      const rrf = 1.0 / (this.rrfK + rank + 1);
      const existing = fusedScores.get(res.chunk.id);
      if (existing) {
        existing.rrfScore += rrf;
        existing.denseScore = res.score;
      } else {
        fusedScores.set(res.chunk.id, {
          chunk: res.chunk,
          rrfScore: rrf,
          denseScore: res.score,
          sparseScore: 0
        });
      }
    });

    allSparseResults.forEach((res, rank) => {
      const rrf = 1.0 / (this.rrfK + rank + 1);
      const existing = fusedScores.get(res.chunk.id);
      if (existing) {
        existing.rrfScore += rrf;
        existing.sparseScore = res.score;
      } else {
        fusedScores.set(res.chunk.id, {
          chunk: res.chunk,
          rrfScore: rrf,
          denseScore: 0,
          sparseScore: res.score
        });
      }
    });

    const sortedChunks = Array.from(fusedScores.values())
      .sort((a, b) => b.rrfScore - a.rrfScore)
      .slice(0, query.topK);

    // 4. Assemble Grounded Context
    const assembledContext = sortedChunks
      .map((sc, idx) => `[Source ${idx + 1}: ${sc.chunk.metadata.sourceFile}]\n${sc.chunk.content}`)
      .join('\n\n---\n\n');

    const latencyMs = Date.now() - startTime;

    return {
      query: query.queryText,
      retrievedChunks: sortedChunks.map(sc => ({
        chunk: sc.chunk,
        score: Number(sc.rrfScore.toFixed(4)),
        denseScore: sc.denseScore,
        sparseScore: sc.sparseScore
      })),
      assembledContext,
      totalRetrieved: sortedChunks.length,
      retrievalLatencyMs: latencyMs
    };
  }
}

export const hybridRetriever = new HybridRAGRetriever();
