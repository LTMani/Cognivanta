/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: AGENTBLUEPRINTREPOSITORY
 * ============================================================================
 * Entity: AgentBlueprint
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { AgentBlueprint, AgentBlueprintAttributes } from '@cognivanta/core';

export class AgentBlueprintRepository {
  private entities = new Map<string, AgentBlueprint>();

  public async findById(id: string): Promise<AgentBlueprint | null> {
    const item = this.entities.get(id);
    return item ? new AgentBlueprint(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<AgentBlueprintAttributes>): Promise<AgentBlueprint[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new AgentBlueprint(item.toJSON()));
  }

  public async create(entity: AgentBlueprint | AgentBlueprintAttributes): Promise<AgentBlueprint> {
    const instance = entity instanceof AgentBlueprint ? entity : new AgentBlueprint(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<AgentBlueprintAttributes>): Promise<AgentBlueprint | null> {
    const existing = this.entities.get(id);
    if (!existing) return null;

    Object.assign(existing, updates);
    existing.touch();
    this.entities.set(id, existing);
    return existing;
  }

  public async delete(id: string): Promise<boolean> {
    return this.entities.delete(id);
  }

  public async count(): Promise<number> {
    return this.entities.size;
  }

  public async clear(): Promise<void> {
    this.entities.clear();
  }
}

export const agentBlueprintRepository = new AgentBlueprintRepository();
