/**
 * ============================================================================
 * COGNIVANTA MULTI-LAYER PROMPT INJECTION & JAILBREAK DETECTOR
 * ============================================================================
 */

import { GuardrailCheckResult } from './interfaces';

export class PromptInjectionDetector {
  private injectionPatterns: Array<{ name: string; pattern: RegExp; severity: number }> = [
    { name: 'System Override Instruction', pattern: /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts|rules)/i, severity: 0.95 },
    { name: 'Role Reassignment', pattern: /you\s+are\s+now\s+(in\s+)?(developer\s+mode|dan|unfiltered|jailbroken)/i, severity: 0.92 },
    { name: 'System Prompt Extraction', pattern: /(repeat|print|show|output|reveal)\s+(your\s+)?(initial|system|base|hidden)\s+(instructions|prompt|rules)/i, severity: 0.88 },
    { name: 'Delimiter Breaking Attack', pattern: /---+\s*(system|admin|root|override)\s*---+/i, severity: 0.90 },
    { name: 'Base64 Encoded Injection', pattern: /(?:eval|execute|run)\s*\(\s*(?:atob|base64_decode)/i, severity: 0.85 },
    { name: 'Markdown Tag Hijacking', pattern: /<\|\s*(im_start|im_end|system|user|assistant)\s*\|>/i, severity: 0.98 }
  ];

  public inspect(text: string): GuardrailCheckResult {
    const startTime = Date.now();
    const matchedRules: string[] = [];
    let maxRisk = 0;

    for (const { name, pattern, severity } of this.injectionPatterns) {
      if (pattern.test(text)) {
        matchedRules.push(name);
        if (severity > maxRisk) maxRisk = severity;
      }
    }

    const passed = maxRisk < 0.80;
    const action = passed ? 'allow' : 'block';

    return {
      passed,
      action,
      threatCategory: matchedRules.length > 0 ? 'prompt_injection' : undefined,
      riskScore: maxRisk,
      reason: passed ? 'No adversarial prompt injection patterns detected.' : 'Adversarial prompt injection detected: ' + matchedRules.join(', '),
      matchedRules,
      executionTimeMs: Date.now() - startTime
    };
  }
}

export const promptInjectionDetector = new PromptInjectionDetector();
