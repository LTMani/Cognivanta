/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: WORKSPACEENVIRONMENTREPOSITORY
 * ============================================================================
 * Entity: WorkspaceEnvironment
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { WorkspaceEnvironment, WorkspaceEnvironmentAttributes } from '@cognivanta/core';

export class WorkspaceEnvironmentRepository {
  private entities = new Map<string, WorkspaceEnvironment>();

  public async findById(id: string): Promise<WorkspaceEnvironment | null> {
    const item = this.entities.get(id);
    return item ? new WorkspaceEnvironment(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<WorkspaceEnvironmentAttributes>): Promise<WorkspaceEnvironment[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new WorkspaceEnvironment(item.toJSON()));
  }

  public async create(entity: WorkspaceEnvironment | WorkspaceEnvironmentAttributes): Promise<WorkspaceEnvironment> {
    const instance = entity instanceof WorkspaceEnvironment ? entity : new WorkspaceEnvironment(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<WorkspaceEnvironmentAttributes>): Promise<WorkspaceEnvironment | null> {
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

export const workspaceEnvironmentRepository = new WorkspaceEnvironmentRepository();
