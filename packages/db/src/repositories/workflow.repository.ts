/**
 * ============================================================================
 * COGNIVANTA WORKFLOW REPOSITORY
 * ============================================================================
 */

import { WorkflowDefinition } from '@cognivanta/core';
import { dbMemory } from '../db.client';

export class WorkflowRepository {
  public async findById(id: string): Promise<WorkflowDefinition | null> {
    return dbMemory.workflows.get(id) || null;
  }

  public async findByWorkspace(workspaceId: string): Promise<WorkflowDefinition[]> {
    const list: WorkflowDefinition[] = [];
    for (const wf of dbMemory.workflows.values()) {
      if (wf.workspaceId === workspaceId) {
        list.push(wf);
      }
    }
    return list;
  }

  public async create(wf: WorkflowDefinition): Promise<WorkflowDefinition> {
    dbMemory.workflows.set(wf.id, wf);
    return wf;
  }

  public async update(id: string, updates: Partial<WorkflowDefinition>): Promise<WorkflowDefinition | null> {
    const existing = dbMemory.workflows.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    dbMemory.workflows.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    return dbMemory.workflows.delete(id);
  }
}

export const workflowRepository = new WorkflowRepository();
