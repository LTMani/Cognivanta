/**
 * ============================================================================
 * COGNIVANTA AGENT PERSONA: AIETHICSAUDITORAGENT
 * ============================================================================
 * Role: AI Safety & Governance Auditor
 * Description: Evaluates model bias, assesses hallucination rates, and verifies explainability.
 */

import { generateUUID } from '@cognivanta/core';

export interface PersonaConfig {
  agentId?: string;
  customSystemPrompt?: string;
  temperature?: number;
  allowedTools?: string[];
  maxThoughtSteps?: number;
}

export class AIEthicsAuditorAgent {
  public readonly personaId = 'ai-ethics-auditor';
  public readonly roleTitle = 'AI Safety & Governance Auditor';
  public readonly defaultDescription = 'Evaluates model bias, assesses hallucination rates, and verifies explainability.';

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

export const ai_ethics_auditorPersona = new AIEthicsAuditorAgent();
