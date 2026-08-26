/**
 * ============================================================================
 * COGNIVANTA WORKSPACE SERVICE
 * ============================================================================
 */

import { Workspace, generateUUID, NotFoundError } from '@cognivanta/core';
import { workspaceRepository, auditRepository } from '@cognivanta/db';

export class WorkspaceService {
  public async getWorkspace(id: string): Promise<Workspace> {
    const ws = await workspaceRepository.findById(id);
    if (!ws) throw new NotFoundError(`Workspace ${id} not found.`);
    return ws;
  }

  public async listForOrg(orgId: string): Promise<Workspace[]> {
    return workspaceRepository.findByOrganization(orgId);
  }

  public async createWorkspace(params: {
    organizationId: string;
    actorId: string;
    actorEmail: string;
    name: string;
    description?: string;
  }): Promise<Workspace> {
    const id = generateUUID();
    const ws: Workspace = {
      id,
      organizationId: params.organizationId,
      name: params.name,
      description: params.description,
      slug: params.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      memberIds: [params.actorId],
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await workspaceRepository.create(ws);

    await auditRepository.log({
      id: generateUUID(),
      organizationId: params.organizationId,
      workspaceId: id,
      actorId: params.actorId,
      actorEmail: params.actorEmail,
      action: 'user.created',
      resourceType: 'workspace',
      resourceId: id,
      payload: { name: params.name }
    });

    return created;
  }
}

export const workspaceService = new WorkspaceService();
