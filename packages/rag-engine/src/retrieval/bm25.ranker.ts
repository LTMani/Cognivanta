/**
 * ============================================================================
 * COGNIVANTA BM25 (OKAPI BM25) SPARSE LEXICAL SEARCH ENGINE
 * ============================================================================
 * Implements standard BM25 probabilistic ranking algorithm for sparse keyword retrieval.
 */

import { DocumentChunk } from '@cognivanta/core';

export interface BM25Doc {
  id: string;
  chunk: DocumentChunk;
  tokens: string[];
  length: number;
}

export class BM25Ranker {
  private k1: number; // Term frequency saturation parameter (typically 1.2 - 2.0)
  private b: number;  // Document length normalization parameter (typically 0.75)
  private corpus: Map<string, BM25Doc[]> = new Map(); // IndexName -> docs
  private avgDocLength: Map<string, number> = new Map();
  private docFrequencies: Map<string, Map<string, number>> = new Map(); // IndexName -> term -> docCount

  constructor(k1: number = 1.5, b: number = 0.75) {
    this.k1 = k1;
    this.b = b;
  }

  public indexChunks(indexName: string, chunks: DocumentChunk[]): void {
    const docs: BM25Doc[] = [];
    const dfMap = new Map<string, number>();
    let totalLen = 0;

    for (const chunk of chunks) {
      const tokens = this.tokenize(chunk.content);
      const uniqueTokens = new Set(tokens);

      for (const t of uniqueTokens) {
        dfMap.set(t, (dfMap.get(t) || 0) + 1);
      }

      docs.push({
        id: chunk.id,
        chunk,
        tokens,
        length: tokens.length
      });

      totalLen += tokens.length;
    }

    this.corpus.set(indexName, docs);
    this.docFrequencies.set(indexName, dfMap);
    this.avgDocLength.set(indexName, docs.length > 0 ? totalLen / docs.length : 0);
  }

  public search(
    indexName: string,
    query: string,
    topK: number = 10
  ): Array<{ chunk: DocumentChunk; score: number }> {
    const docs = this.corpus.get(indexName);
    const dfMap = this.docFrequencies.get(indexName);
    const avgLen = this.avgDocLength.get(indexName);

    if (!docs || !dfMap || !avgLen || docs.length === 0) return [];

    const queryTokens = this.tokenize(query);
    const N = docs.length;
    const scored: Array<{ chunk: DocumentChunk; score: number }> = [];

    for (const doc of docs) {
      let score = 0;
      const termCounts = new Map<string, number>();

      for (const t of doc.tokens) {
        termCounts.set(t, (termCounts.get(t) || 0) + 1);
      }

      for (const qTerm of queryTokens) {
        const tf = termCounts.get(qTerm) || 0;
        if (tf === 0) continue;

        const df = dfMap.get(qTerm) || 0;
        // Standard Inverse Document Frequency (IDF)
        const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);

        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (doc.length / avgLen));

        score += idf * (numerator / denominator);
      }

      if (score > 0) {
        scored.push({ chunk: doc.chunk, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    // Normalize BM25 score between 0 and 1
    const maxScore = scored[0]?.score || 1;
    return scored.slice(0, topK).map(s => ({
      chunk: s.chunk,
      score: Number((s.score / maxScore).toFixed(4))
    }));
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  }
}

export const bm25Ranker = new BM25Ranker();
