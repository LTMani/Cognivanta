/**
 * ============================================================================
 * COGNIVANTA SECURITY DETECTOR: IBANACCOUNTNUMBERDETECTOR
 * ============================================================================
 */

export interface IBANAccountNumberDetectorResult {
  detectorName: string;
  hasMatch: boolean;
  confidenceScore: number;
  matchedSpans: Array<{ start: number; end: number; maskedText: string }>;
  actionRecommended: 'BLOCK' | 'MASK' | 'AUDIT' | 'PASS';
}

export class IBANAccountNumberDetector {
  public readonly detectorName = 'IBANAccountNumberDetector';

  public analyze(input: string): IBANAccountNumberDetectorResult {
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

export const iBANAccountNumberDetector = new IBANAccountNumberDetector();
