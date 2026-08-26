/**
 * ============================================================================
 * COGNIVANTA TOKEN COST METERING & PRICING CALCULATOR
 * ============================================================================
 */

import { DEFAULT_MODELS } from '@cognivanta/core';

export class CostCalculator {
  private modelPricingMap = new Map<string, { inputPer1k: number; outputPer1k: number }>();

  constructor() {
    for (const m of DEFAULT_MODELS) {
      this.modelPricingMap.set(m.id, {
        inputPer1k: m.pricing.inputPer1kTokensUSD,
        outputPer1k: m.pricing.outputPer1kTokensUSD
      });
    }
  }

  public calculateCost(modelId: string, promptTokens: number, completionTokens: number): number {
    const pricing = this.modelPricingMap.get(modelId) || { inputPer1k: 0.005, outputPer1k: 0.015 };
    const inputCost = (promptTokens / 1000) * pricing.inputPer1k;
    const outputCost = (completionTokens / 1000) * pricing.outputPer1k;
    return Number((inputCost + outputCost).toFixed(6));
  }
}

export const costCalculator = new CostCalculator();
