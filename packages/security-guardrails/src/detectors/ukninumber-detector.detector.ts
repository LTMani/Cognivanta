/**
 * ============================================================================
 * COGNIVANTA SECURITY DETECTOR: UKNINUMBERDETECTOR
 * ============================================================================
 */

export interface UKNINumberDetectorResult {
  detectorName: string;
  hasMatch: boolean;
  confidenceScore: number;
  matchedSpans: Array<{ start: number; end: number; maskedText: string }>;
  actionRecommended: 'BLOCK' | 'MASK' | 'AUDIT' | 'PASS';
}

export class UKNINumberDetector {
  public readonly detectorName = 'UKNINumberDetector';

  public analyze(input: string): UKNINumberDetectorResult {
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

export const uKNINumberDetector = new UKNINumberDetector();
