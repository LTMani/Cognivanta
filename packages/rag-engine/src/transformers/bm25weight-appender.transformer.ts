/**
 * ============================================================================
 * COGNIVANTA DOCUMENT TRANSFORMER: BM25WEIGHTAPPENDER
 * ============================================================================
 */

export interface TransformedChunkOutput {
  chunkId: string;
  originalText: string;
  transformedText: string;
  transformPipeline: string[];
  metadata: Record<string, unknown>;
}

export class BM25WeightAppender {
  public readonly transformerName = 'BM25WeightAppender';

  public transform(text: string, metadata: Record<string, unknown> = {}): TransformedChunkOutput {
    return {
      chunkId: 'chk-' + Date.now(),
      originalText: text,
      transformedText: text.trim(),
      transformPipeline: [this.transformerName],
      metadata: {
        ...metadata,
        appliedTransform: this.transformerName,
        processedAt: new Date().toISOString()
      }
    };
  }
}

export const bM25WeightAppender = new BM25WeightAppender();
