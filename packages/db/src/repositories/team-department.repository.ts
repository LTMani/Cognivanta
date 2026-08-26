/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: TEAMDEPARTMENTREPOSITORY
 * ============================================================================
 * Entity: TeamDepartment
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { TeamDepartment, TeamDepartmentAttributes } from '@cognivanta/core';

export class TeamDepartmentRepository {
  private entities = new Map<string, TeamDepartment>();

  public async findById(id: string): Promise<TeamDepartment | null> {
    const item = this.entities.get(id);
    return item ? new TeamDepartment(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<TeamDepartmentAttributes>): Promise<TeamDepartment[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new TeamDepartment(item.toJSON()));
  }

  public async create(entity: TeamDepartment | TeamDepartmentAttributes): Promise<TeamDepartment> {
    const instance = entity instanceof TeamDepartment ? entity : new TeamDepartment(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<TeamDepartmentAttributes>): Promise<TeamDepartment | null> {
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

export const teamDepartmentRepository = new TeamDepartmentRepository();
