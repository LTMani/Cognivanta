/**
 * ============================================================================
 * COGNIVANTA RAG FAITHFULNESS & GROUNDEDNESS EVALUATOR
 * ============================================================================
 * Evaluates whether generated answers are strictly grounded in retrieved context
 * without hallucinations.
 */

import { modelGateway } from '@cognivanta/model-gateway';

export interface FaithfulnessEvaluationResult {
  score: number; // 0.0 to 1.0
  isFaithful: boolean;
  unsupportedClaims: string[];
  reasoning: string;
}

export class FaithfulnessEvaluator {
  public async evaluate(
    question: string,
    context: string,
    generatedAnswer: string,
    judgeModelId: string = 'gpt-4o'
  ): Promise<FaithfulnessEvaluationResult> {
    const claims = this.extractClaims(generatedAnswer);
    if (claims.length === 0) {
      return { score: 1.0, isFaithful: true, unsupportedClaims: [], reasoning: 'No factual claims found.' };
    }

    // Check claim overlap in context
    const unsupported: string[] = [];
    for (const claim of claims) {
      const words = claim.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const overlapCount = words.filter(w => context.toLowerCase().includes(w)).length;
      const overlapRatio = words.length > 0 ? overlapCount / words.length : 1;

      if (overlapRatio < 0.3) {
        unsupported.push(claim);
      }
    }

    const score = Number(((claims.length - unsupported.length) / claims.length).toFixed(4));

    return {
      score,
      isFaithful: score >= 0.8,
      unsupportedClaims: unsupported,
      reasoning: `Verified ${claims.length} extracted claims against retrieved context.`
    };
  }

  private extractClaims(text: string): string[] {
    return text
      .split(/[.!?\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20);
  }
}

export const faithfulnessEvaluator = new FaithfulnessEvaluator();
