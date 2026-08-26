/**
 * ============================================================================
 * COGNIVANTA SEMANTIC BOUNDARY & SENTENCE CHUNKERS
 * ============================================================================
 */

import { estimateTokenCount } from '@cognivanta/core';
import { TextChunk } from './recursive.chunker';

export class SemanticBoundaryChunker {
  private targetTokens: number;

  constructor(targetTokens: number = 300) {
    this.targetTokens = targetTokens;
  }

  public chunk(text: string): TextChunk[] {
    const paragraphs = text.split(/\n\n+/);
    const chunks: TextChunk[] = [];
    let currentBlock = '';
    let blockIndex = 0;
    let charOffset = 0;

    for (const p of paragraphs) {
      const trimmed = p.trim();
      if (!trimmed) continue;

      const currentTokens = estimateTokenCount(currentBlock);
      const newTokens = estimateTokenCount(trimmed);

      if (currentTokens + newTokens > this.targetTokens && currentBlock) {
        chunks.push({
          index: blockIndex++,
          content: currentBlock.trim(),
          charStart: charOffset,
          charEnd: charOffset + currentBlock.length,
          tokenCount: currentTokens
        });
        charOffset += currentBlock.length;
        currentBlock = trimmed;
      } else {
        currentBlock += (currentBlock ? '\n\n' : '') + trimmed;
      }
    }

    if (currentBlock.trim()) {
      chunks.push({
        index: blockIndex,
        content: currentBlock.trim(),
        charStart: charOffset,
        charEnd: charOffset + currentBlock.length,
        tokenCount: estimateTokenCount(currentBlock)
      });
    }

    return chunks;
  }
}

export class SlidingWindowTokenChunker {
  private windowTokens: number;
  private strideTokens: number;

  constructor(windowTokens: number = 256, strideTokens: number = 64) {
    this.windowTokens = windowTokens;
    this.strideTokens = strideTokens;
  }

  public chunk(text: string): TextChunk[] {
    const words = text.split(/\s+/).filter(Boolean);
    const chunks: TextChunk[] = [];
    let idx = 0;

    // Approximate ~1.3 words per token
    const wordsPerWindow = Math.floor(this.windowTokens * 0.75);
    const wordsPerStride = Math.floor(this.strideTokens * 0.75);

    for (let i = 0; i < words.length; i += wordsPerStride) {
      const windowWords = words.slice(i, i + wordsPerWindow);
      const content = windowWords.join(' ');

      chunks.push({
        index: idx++,
        content,
        charStart: 0,
        charEnd: content.length,
        tokenCount: estimateTokenCount(content)
      });

      if (i + wordsPerWindow >= words.length) break;
    }

    return chunks;
  }
}

export const semanticChunker = new SemanticBoundaryChunker();
export const slidingWindowChunker = new SlidingWindowTokenChunker();
