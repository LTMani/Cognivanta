/**
 * ============================================================================
 * COGNIVANTA MAXIMAL MARGINAL RELEVANCE (MMR) DIVERSITY RERANKER
 * ============================================================================
 * Balances relevance to the query with diversity among retrieved chunks to avoid redundancy.
 */

import { cosineSimilarity, DocumentChunk, VectorSearchResult } from '@cognivanta/core';

export class MaximalMarginalRelevanceRanker {
  public rerank(
    queryVector: number[],
    candidates: VectorSearchResult[],
    lambda: number = 0.7,
    topK: number = 5
  ): VectorSearchResult[] {
    if (candidates.length <= topK) return candidates;

    const selected: VectorSearchResult[] = [];
    const remaining = [...candidates];

    while (selected.length < topK && remaining.length > 0) {
      let bestScore = -Infinity;
      let bestIdx = -1;

      for (let i = 0; i < remaining.length; i++) {
        const cand = remaining[i];
        const candVector = cand.chunk.embedding || [];
        const relevance = cosineSimilarity(queryVector, candVector);

        // Maximum similarity to already selected chunks
        let maxSimToSelected = 0;
        for (const sel of selected) {
          const selVector = sel.chunk.embedding || [];
          const sim = cosineSimilarity(candVector, selVector);
          if (sim > maxSimToSelected) maxSimToSelected = sim;
        }

        const mmrScore = lambda * relevance - (1 - lambda) * maxSimToSelected;

        if (mmrScore > bestScore) {
          bestScore = mmrScore;
          bestIdx = i;
        }
      }

      if (bestIdx !== -1) {
        selected.push(remaining[bestIdx]);
        remaining.splice(bestIdx, 1);
      } else {
        break;
      }
    }

    return selected;
  }
}

export const mmrRanker = new MaximalMarginalRelevanceRanker();
