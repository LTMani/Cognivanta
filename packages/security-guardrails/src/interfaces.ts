/**
 * ============================================================================
 * COGNIVANTA GUARDRAIL INTERFACES & RISK SCORING CONTRACTS
 * ============================================================================
 */

export type GuardrailAction = 'allow' | 'mask' | 'block' | 'flag_for_review';
export type ThreatCategory = 'prompt_injection' | 'jailbreak' | 'toxicity' | 'pii_leak' | 'hallucination' | 'system_override';

export interface GuardrailCheckResult {
  passed: boolean;
  action: GuardrailAction;
  threatCategory?: ThreatCategory;
  riskScore: number;
  reason?: string;
  sanitizedContent?: string;
  matchedRules: string[];
  executionTimeMs: number;
}

export interface GuardrailPolicy {
  id: string;
  name: string;
  enabledThreats: ThreatCategory[];
  riskThreshold: number;
  blockAction: GuardrailAction;
  customKeywordBlacklist: string[];
  customRegexPatterns: string[];
}
