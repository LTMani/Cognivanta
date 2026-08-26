/**
 * ============================================================================
 * COGNIVANTA ORGANIZATION REPOSITORY
 * ============================================================================
 */

import { Organization } from '@cognivanta/core';
import { dbMemory } from '../db.client';

export class OrganizationRepository {
  public async findById(id: string): Promise<Organization | null> {
    return dbMemory.organizations.get(id) || null;
  }

  public async findBySlug(slug: string): Promise<Organization | null> {
    for (const org of dbMemory.organizations.values()) {
      if (org.slug === slug) return org;
    }
    return null;
  }

  public async create(org: Organization): Promise<Organization> {
    dbMemory.organizations.set(org.id, org);
    return org;
  }

  public async update(id: string, updates: Partial<Organization>): Promise<Organization | null> {
    const existing = dbMemory.organizations.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    dbMemory.organizations.set(id, updated);
    return updated;
  }

  public async listAll(): Promise<Organization[]> {
    return Array.from(dbMemory.organizations.values());
  }
}

export const organizationRepository = new OrganizationRepository();
