/**
 * ============================================================================
 * COGNIVANTA AGENT REPOSITORY
 * ============================================================================
 */

import { AgentDefinition } from '@cognivanta/core';
import { dbMemory } from '../db.client';

export class AgentRepository {
  public async findById(id: string): Promise<AgentDefinition | null> {
    return dbMemory.agents.get(id) || null;
  }

  public async findByWorkspace(workspaceId: string): Promise<AgentDefinition[]> {
    const list: AgentDefinition[] = [];
    for (const agent of dbMemory.agents.values()) {
      if (agent.workspaceId === workspaceId) {
        list.push(agent);
      }
    }
    return list;
  }

  public async create(agent: AgentDefinition): Promise<AgentDefinition> {
    dbMemory.agents.set(agent.id, agent);
    return agent;
  }

  public async update(id: string, updates: Partial<AgentDefinition>): Promise<AgentDefinition | null> {
    const existing = dbMemory.agents.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    dbMemory.agents.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    return dbMemory.agents.delete(id);
  }
}

export const agentRepository = new AgentRepository();
