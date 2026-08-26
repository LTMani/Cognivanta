/**
 * ============================================================================
 * COGNIVANTA RECURSIVE CHARACTER TEXT CHUNKER
 * ============================================================================
 * Recursively splits text along natural paragraph, sentence, and word boundaries.
 */

import { estimateTokenCount } from '@cognivanta/core';

export interface ChunkOptions {
  chunkSize?: number; // Target characters per chunk
  chunkOverlap?: number;
  separators?: string[];
}

export interface TextChunk {
  index: number;
  content: string;
  charStart: number;
  charEnd: number;
  tokenCount: number;
}

export class RecursiveCharacterChunker {
  private chunkSize: number;
  private chunkOverlap: number;
  private separators: string[];

  constructor(options: ChunkOptions = {}) {
    this.chunkSize = options.chunkSize ?? 1000;
    this.chunkOverlap = options.chunkOverlap ?? 150;
    this.separators = options.separators ?? ['\n\n', '\n', '. ', '? ', '! ', '; ', ', ', ' '];
  }

  public chunkText(text: string): TextChunk[] {
    if (!text || text.trim().length === 0) return [];

    const chunks: TextChunk[] = [];
    const rawChunks = this.splitRecursive(text, this.separators);

    let charOffset = 0;
    rawChunks.forEach((chunkContent, idx) => {
      const trimmed = chunkContent.trim();
      if (trimmed.length > 0) {
        const charStart = text.indexOf(trimmed, charOffset);
        const actualStart = charStart !== -1 ? charStart : charOffset;
        const charEnd = actualStart + trimmed.length;

        chunks.push({
          index: idx,
          content: trimmed,
          charStart: actualStart,
          charEnd,
          tokenCount: estimateTokenCount(trimmed)
        });

        charOffset = actualStart + Math.max(1, trimmed.length - this.chunkOverlap);
      }
    });

    return chunks;
  }

  private splitRecursive(text: string, separators: string[]): string[] {
    if (text.length <= this.chunkSize) {
      return [text];
    }

    if (separators.length === 0) {
      // Hard split fallback
      const hardChunks: string[] = [];
      for (let i = 0; i < text.length; i += this.chunkSize - this.chunkOverlap) {
        hardChunks.push(text.slice(i, i + this.chunkSize));
      }
      return hardChunks;
    }

    const separator = separators[0];
    const remainingSeparators = separators.slice(1);
    const splits = text.split(separator);
    const result: string[] = [];
    let currentChunk = '';

    for (const split of splits) {
      const candidate = currentChunk ? currentChunk + separator + split : split;

      if (candidate.length <= this.chunkSize) {
        currentChunk = candidate;
      } else {
        if (currentChunk) {
          result.push(currentChunk);
        }

        if (split.length > this.chunkSize) {
          // Recurse on larger individual piece
          const subChunks = this.splitRecursive(split, remainingSeparators);
          result.push(...subChunks);
          currentChunk = '';
        } else {
          currentChunk = split;
        }
      }
    }

    if (currentChunk) {
      result.push(currentChunk);
    }

    return result;
  }
}

export const recursiveChunker = new RecursiveCharacterChunker();
