/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: WORKFLOWEXECUTIONINSTANCEREPOSITORY
 * ============================================================================
 * Entity: WorkflowExecutionInstance
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { WorkflowExecutionInstance, WorkflowExecutionInstanceAttributes } from '@cognivanta/core';

export class WorkflowExecutionInstanceRepository {
  private entities = new Map<string, WorkflowExecutionInstance>();

  public async findById(id: string): Promise<WorkflowExecutionInstance | null> {
    const item = this.entities.get(id);
    return item ? new WorkflowExecutionInstance(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<WorkflowExecutionInstanceAttributes>): Promise<WorkflowExecutionInstance[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new WorkflowExecutionInstance(item.toJSON()));
  }

  public async create(entity: WorkflowExecutionInstance | WorkflowExecutionInstanceAttributes): Promise<WorkflowExecutionInstance> {
    const instance = entity instanceof WorkflowExecutionInstance ? entity : new WorkflowExecutionInstance(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<WorkflowExecutionInstanceAttributes>): Promise<WorkflowExecutionInstance | null> {
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

export const workflowExecutionInstanceRepository = new WorkflowExecutionInstanceRepository();
