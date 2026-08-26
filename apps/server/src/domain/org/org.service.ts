/**
 * ============================================================================
 * COGNIVANTA ORGANIZATION & TENANT MANAGEMENT SERVICE
 * ============================================================================
 */

import { Organization, generateUUID, NotFoundError } from '@cognivanta/core';
import { organizationRepository, userRepository, auditRepository } from '@cognivanta/db';

export class OrgService {
  public async getOrganization(id: string): Promise<Organization> {
    const org = await organizationRepository.findById(id);
    if (!org) throw new NotFoundError(`Organization ${id} not found.`);
    return org;
  }

  public async updateSettings(
    orgId: string,
    actorId: string,
    actorEmail: string,
    settings: Partial<Organization['settings']>
  ): Promise<Organization> {
    const org = await this.getOrganization(orgId);
    const updated = await organizationRepository.update(orgId, {
      settings: { ...org.settings, ...settings }
    });

    if (!updated) throw new NotFoundError('Failed to update organization settings.');

    await auditRepository.log({
      id: generateUUID(),
      organizationId: orgId,
      actorId,
      actorEmail,
      action: 'settings.updated',
      resourceType: 'organization',
      resourceId: orgId,
      payload: settings as Record<string, unknown>
    });

    return updated;
  }
}

export const orgService = new OrgService();
