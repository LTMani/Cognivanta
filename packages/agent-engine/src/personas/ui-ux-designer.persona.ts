/**
 * ============================================================================
 * COGNIVANTA AGENT PERSONA: UIUXDESIGNERAGENT
 * ============================================================================
 * Role: Principal Design Systems Architect
 * Description: Designs accessible WCAG-compliant design tokens, wireframes, and color palettes.
 */

import { generateUUID } from '@cognivanta/core';

export interface PersonaConfig {
  agentId?: string;
  customSystemPrompt?: string;
  temperature?: number;
  allowedTools?: string[];
  maxThoughtSteps?: number;
}

export class UIUXDesignerAgent {
  public readonly personaId = 'ui-ux-designer';
  public readonly roleTitle = 'Principal Design Systems Architect';
  public readonly defaultDescription = 'Designs accessible WCAG-compliant design tokens, wireframes, and color palettes.';

  public getSystemPrompt(): string {
    return `You are the ${this.roleTitle} at Cognivanta.
Your mission is to perform enterprise tasks with high precision, grounded factual citations, and rigorous safety compliance.
Core Responsibilities: ${this.defaultDescription}
Always provide structured reasoning (Thought, Action, Observation) before final answers.`;
  }

  public getRecommendedTools(): string[] {
    return ['web_search', 'rag_query', 'sql_query', 'python_sandbox', 'chart_generator'];
  }

  public createInstance(config?: PersonaConfig) {
    return {
      id: config?.agentId || 'agent-' + generateUUID(),
      name: this.roleTitle,
      personaId: this.personaId,
      systemPrompt: config?.customSystemPrompt || this.getSystemPrompt(),
      temperature: config?.temperature || 0.3,
      allowedTools: config?.allowedTools || this.getRecommendedTools(),
      maxThoughtSteps: config?.maxThoughtSteps || 10,
      createdAt: new Date().toISOString()
    };
  }
}

export const ui_ux_designerPersona = new UIUXDesignerAgent();
