/**
 * ============================================================================
 * COGNIVANTA DATA LOSS PREVENTION (DLP) & PII MASKING ENGINE
 * ============================================================================
 */

import { GuardrailCheckResult } from './interfaces';

export class DataLossPreventionEngine {
  private creditCardRegex = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b/g;
  private ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  private apiKeyRegex = /\b(?:sk-[a-zA-Z0-9]{32,}|ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z-_]{35})\b/g;

  public sanitize(text: string): GuardrailCheckResult {
    const startTime = Date.now();
    let sanitized = text;
    const matchedRules: string[] = [];

    if (this.creditCardRegex.test(sanitized)) {
      sanitized = sanitized.replace(this.creditCardRegex, '[REDACTED_CREDIT_CARD]');
      matchedRules.push('Credit Card Number Detected');
    }

    if (this.ssnRegex.test(sanitized)) {
      sanitized = sanitized.replace(this.ssnRegex, '[REDACTED_SSN]');
      matchedRules.push('Social Security Number Detected');
    }

    if (this.apiKeyRegex.test(sanitized)) {
      sanitized = sanitized.replace(this.apiKeyRegex, '[REDACTED_API_KEY]');
      matchedRules.push('API Secret Token Detected');
    }

    const hasDLPThreat = matchedRules.length > 0;

    return {
      passed: true,
      action: hasDLPThreat ? 'mask' : 'allow',
      threatCategory: hasDLPThreat ? 'pii_leak' : undefined,
      riskScore: hasDLPThreat ? 0.85 : 0.0,
      reason: hasDLPThreat ? 'Sensitive enterprise tokens masked: ' + matchedRules.join(', ') : 'No DLP violations found.',
      sanitizedContent: sanitized,
      matchedRules,
      executionTimeMs: Date.now() - startTime
    };
  }
}

export const dlpEngine = new DataLossPreventionEngine();
