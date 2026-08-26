/**
 * ============================================================================
 * COGNIVANTA AUDIT LOG REPOSITORY WITH CRYPTOGRAPHIC CHAINING
 * ============================================================================
 */

import { AuditLogEntry, sha256 } from '@cognivanta/core';
import { dbMemory } from '../db.client';

export class AuditRepository {
  public async log(entry: Omit<AuditLogEntry, 'previousHash' | 'currentHash' | 'timestamp'>): Promise<AuditLogEntry> {
    const previousEntry = dbMemory.auditLogs[dbMemory.auditLogs.length - 1];
    const previousHash = previousEntry ? previousEntry.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const timestamp = new Date().toISOString();

    const dataToHash = {
      id: entry.id,
      organizationId: entry.organizationId,
      actorId: entry.actorId,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      payload: entry.payload,
      previousHash,
      timestamp
    };

    const currentHash = sha256(dataToHash);

    const fullEntry: AuditLogEntry = {
      ...entry,
      previousHash,
      currentHash,
      timestamp
    };

    dbMemory.auditLogs.push(fullEntry);
    return fullEntry;
  }

  public async getByOrganization(orgId: string, limit: number = 100): Promise<AuditLogEntry[]> {
    return dbMemory.auditLogs
      .filter(l => l.organizationId === orgId)
      .slice(-limit)
      .reverse();
  }

  public async verifyIntegrity(): Promise<{ isValid: boolean; brokenAtIndex?: number }> {
    for (let i = 0; i < dbMemory.auditLogs.length; i++) {
      const current = dbMemory.auditLogs[i];
      const prev = i > 0 ? dbMemory.auditLogs[i - 1] : null;
      const expectedPrevHash = prev ? prev.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';

      if (current.previousHash !== expectedPrevHash) {
        return { isValid: false, brokenAtIndex: i };
      }

      const recalculatedHash = sha256({
        id: current.id,
        organizationId: current.organizationId,
        actorId: current.actorId,
        action: current.action,
        resourceType: current.resourceType,
        resourceId: current.resourceId,
        payload: current.payload,
        previousHash: current.previousHash,
        timestamp: current.timestamp
      });

      if (current.currentHash !== recalculatedHash) {
        return { isValid: false, brokenAtIndex: i };
      }
    }

    return { isValid: true };
  }
}

export const auditRepository = new AuditRepository();
