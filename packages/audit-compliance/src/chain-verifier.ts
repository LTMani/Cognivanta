/**
 * ============================================================================
 * COGNIVANTA CRYPTOGRAPHIC AUDIT LOG CHAIN VERIFIER
 * ============================================================================
 * Cryptographically verifies that the SHA-256 block hash chain is unbroken and untampered.
 */

import { AuditLogEntry, sha256 } from '@cognivanta/core';

export interface ChainVerificationResult {
  isValid: boolean;
  totalEntriesVerified: number;
  brokenIndex?: number;
  expectedHash?: string;
  actualHash?: string;
}

export class CryptographicChainVerifier {
  public verify(entries: AuditLogEntry[]): ChainVerificationResult {
    const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 0; i < entries.length; i++) {
      const current = entries[i];
      const prev = i > 0 ? entries[i - 1] : null;
      const expectedPrevHash = prev ? prev.currentHash : GENESIS_HASH;

      if (current.previousHash !== expectedPrevHash) {
        return {
          isValid: false,
          totalEntriesVerified: i,
          brokenIndex: i,
          expectedHash: expectedPrevHash,
          actualHash: current.previousHash
        };
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
        return {
          isValid: false,
          totalEntriesVerified: i,
          brokenIndex: i,
          expectedHash: recalculatedHash,
          actualHash: current.currentHash
        };
      }
    }

    return {
      isValid: true,
      totalEntriesVerified: entries.length
    };
  }
}

export const chainVerifier = new CryptographicChainVerifier();
