/**
 * ============================================================================
 * COGNIVANTA CONTEXTUAL COMPRESSOR & REORDERER
 * ============================================================================
 * Solves the "Lost in the Middle" attention phenomenon by reordering critical chunks.
 */

import { VectorSearchResult } from '@cognivanta/core';

export class ContextCompressor {
  public reorderLostInTheMiddle(chunks: VectorSearchResult[]): VectorSearchResult[] {
    if (chunks.length <= 2) return chunks;

    const reordered: VectorSearchResult[] = new Array(chunks.length);
    let left = 0;
    let right = chunks.length - 1;

    for (let i = 0; i < chunks.length; i++) {
      if (i % 2 === 0) {
        reordered[left++] = chunks[i];
      } else {
        reordered[right--] = chunks[i];
      }
    }

    return reordered;
  }

  public compressChunks(chunks: VectorSearchResult[], maxTotalChars: number = 6000): VectorSearchResult[] {
    let accumulatedChars = 0;
    const compressed: VectorSearchResult[] = [];

    for (const c of chunks) {
      if (accumulatedChars + c.chunk.content.length <= maxTotalChars) {
        compressed.push(c);
        accumulatedChars += c.chunk.content.length;
      } else {
        const remainingSpace = maxTotalChars - accumulatedChars;
        if (remainingSpace > 200) {
          compressed.push({
            ...c,
            chunk: {
              ...c.chunk,
              content: c.chunk.content.slice(0, remainingSpace) + '... [truncated]'
            }
          });
        }
        break;
      }
    }

    return compressed;
  }
}

export const contextCompressor = new ContextCompressor();
