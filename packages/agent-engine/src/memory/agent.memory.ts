/**
 * ============================================================================
 * COGNIVANTA AGENT MEMORY ARCHITECTURE (SHORT-TERM, EPISODIC & SEMANTIC)
 * ============================================================================
 */

import { AgentExecutionStep, generateUUID } from '@cognivanta/core';

export interface MemoryRecord {
  id: string;
  agentId: string;
  type: 'short_term' | 'episodic' | 'semantic';
  content: string;
  importance: number;
  timestamp: string;
}

export class AgentMemoryManager {
  private memories = new Map<string, MemoryRecord[]>(); // agentId -> memories

  public addStepToMemory(agentId: string, step: AgentExecutionStep): void {
    const records = this.memories.get(agentId) || [];
    records.push({
      id: generateUUID(),
      agentId,
      type: 'short_term',
      content: `Thought: ${step.thought} | Action: ${step.action || 'None'} | Observation: ${JSON.stringify(step.observation || '')}`,
      importance: 0.8,
      timestamp: step.timestamp
    });
    this.memories.set(agentId, records);
  }

  public getRecentContext(agentId: string, limit: number = 6): string {
    const records = this.memories.get(agentId) || [];
    return records
      .slice(-limit)
      .map(r => r.content)
      .join('\n');
  }

  public clearMemory(agentId: string): void {
    this.memories.delete(agentId);
  }
}

export const agentMemoryManager = new AgentMemoryManager();
