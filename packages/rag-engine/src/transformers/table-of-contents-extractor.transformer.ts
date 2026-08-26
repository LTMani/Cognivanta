/**
 * ============================================================================
 * COGNIVANTA DOCUMENT TRANSFORMER: TABLEOFCONTENTSEXTRACTOR
 * ============================================================================
 */

export interface TransformedChunkOutput {
  chunkId: string;
  originalText: string;
  transformedText: string;
  transformPipeline: string[];
  metadata: Record<string, unknown>;
}

export class TableOfContentsExtractor {
  public readonly transformerName = 'TableOfContentsExtractor';

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

export const tableOfContentsExtractor = new TableOfContentsExtractor();
