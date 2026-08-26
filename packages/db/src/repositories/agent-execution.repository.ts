/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: AGENTEXECUTIONLOGREPOSITORY
 * ============================================================================
 * Entity: AgentExecutionLog
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { AgentExecutionLog, AgentExecutionLogAttributes } from '@cognivanta/core';

export class AgentExecutionLogRepository {
  private entities = new Map<string, AgentExecutionLog>();

  public async findById(id: string): Promise<AgentExecutionLog | null> {
    const item = this.entities.get(id);
    return item ? new AgentExecutionLog(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<AgentExecutionLogAttributes>): Promise<AgentExecutionLog[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new AgentExecutionLog(item.toJSON()));
  }

  public async create(entity: AgentExecutionLog | AgentExecutionLogAttributes): Promise<AgentExecutionLog> {
    const instance = entity instanceof AgentExecutionLog ? entity : new AgentExecutionLog(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<AgentExecutionLogAttributes>): Promise<AgentExecutionLog | null> {
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

export const agentExecutionLogRepository = new AgentExecutionLogRepository();
