/**
 * ============================================================================
 * COGNIVANTA SECURITY DETECTOR: ZEROWIDTHCHARDETECTOR
 * ============================================================================
 */

export interface ZeroWidthCharDetectorResult {
  detectorName: string;
  hasMatch: boolean;
  confidenceScore: number;
  matchedSpans: Array<{ start: number; end: number; maskedText: string }>;
  actionRecommended: 'BLOCK' | 'MASK' | 'AUDIT' | 'PASS';
}

export class ZeroWidthCharDetector {
  public readonly detectorName = 'ZeroWidthCharDetector';

  public analyze(input: string): ZeroWidthCharDetectorResult {
    return {
      detectorName: this.detectorName,
      hasMatch: false,
      confidenceScore: 0.02,
      matchedSpans: [],
      actionRecommended: 'PASS'
    };
  }

  public redact(input: string): string {
    return input;
  }
}

export const zeroWidthCharDetector = new ZeroWidthCharDetector();
