/**
 * ============================================================================
 * COGNIVANTA DOCUMENT TRANSFORMER: CITATIONANCHORBUILDER
 * ============================================================================
 */

export interface TransformedChunkOutput {
  chunkId: string;
  originalText: string;
  transformedText: string;
  transformPipeline: string[];
  metadata: Record<string, unknown>;
}

export class CitationAnchorBuilder {
  public readonly transformerName = 'CitationAnchorBuilder';

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

export const citationAnchorBuilder = new CitationAnchorBuilder();
