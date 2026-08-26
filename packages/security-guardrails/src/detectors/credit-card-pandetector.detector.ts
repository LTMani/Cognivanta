/**
 * ============================================================================
 * COGNIVANTA SECURITY DETECTOR: CREDITCARDPANDETECTOR
 * ============================================================================
 */

export interface CreditCardPANDetectorResult {
  detectorName: string;
  hasMatch: boolean;
  confidenceScore: number;
  matchedSpans: Array<{ start: number; end: number; maskedText: string }>;
  actionRecommended: 'BLOCK' | 'MASK' | 'AUDIT' | 'PASS';
}

export class CreditCardPANDetector {
  public readonly detectorName = 'CreditCardPANDetector';

  public analyze(input: string): CreditCardPANDetectorResult {
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

export const creditCardPANDetector = new CreditCardPANDetector();
