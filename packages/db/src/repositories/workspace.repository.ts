/**
 * ============================================================================
 * COGNIVANTA WORKSPACE REPOSITORY
 * ============================================================================
 */

import { Workspace } from '@cognivanta/core';
import { dbMemory } from '../db.client';

export class WorkspaceRepository {
  public async findById(id: string): Promise<Workspace | null> {
    return dbMemory.workspaces.get(id) || null;
  }

  public async findByOrganization(orgId: string): Promise<Workspace[]> {
    const list: Workspace[] = [];
    for (const ws of dbMemory.workspaces.values()) {
      if (ws.organizationId === orgId) {
        list.push(ws);
      }
    }
    return list;
  }

  public async findByUser(userId: string): Promise<Workspace[]> {
    const list: Workspace[] = [];
    for (const ws of dbMemory.workspaces.values()) {
      if (ws.memberIds.includes(userId)) {
        list.push(ws);
      }
    }
    return list;
  }

  public async create(ws: Workspace): Promise<Workspace> {
    dbMemory.workspaces.set(ws.id, ws);
    return ws;
  }

  public async update(id: string, updates: Partial<Workspace>): Promise<Workspace | null> {
    const existing = dbMemory.workspaces.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    dbMemory.workspaces.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    return dbMemory.workspaces.delete(id);
  }
}

export const workspaceRepository = new WorkspaceRepository();
