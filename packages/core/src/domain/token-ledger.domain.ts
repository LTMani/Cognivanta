/**
 * ============================================================================
 * COGNIVANTA DOMAIN MODEL: TOKENUSAGELEDGER
 * ============================================================================
 * Description: Financial metering record attributing token costs across organizations, workspaces, and users.
 */

import { z } from 'zod';
import { generateUUID } from '../utils/crypto';

export interface TokenUsageLedgerAttributes {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived' | 'pending';
  version: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const TokenUsageLedgerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived', 'pending']).default('active'),
  version: z.number().int().positive().default(1),
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export class TokenUsageLedger implements TokenUsageLedgerAttributes {
  public id: string;
  public name: string;
  public description?: string;
  public status: 'active' | 'inactive' | 'archived' | 'pending';
  public version: number;
  public metadata: Record<string, unknown>;
  public createdAt: string;
  public updatedAt: string;

  constructor(attrs: Partial<TokenUsageLedgerAttributes>) {
    this.id = attrs.id || generateUUID();
    this.name = attrs.name || 'Default TokenUsageLedger';
    this.description = attrs.description;
    this.status = attrs.status || 'active';
    this.version = attrs.version || 1;
    this.metadata = attrs.metadata || {};
    this.createdAt = attrs.createdAt || new Date().toISOString();
    this.updatedAt = attrs.updatedAt || new Date().toISOString();
  }

  public validate(): boolean {
    const parsed = TokenUsageLedgerSchema.safeParse(this);
    return parsed.success;
  }

  public touch(): void {
    this.updatedAt = new Date().toISOString();
    this.version += 1;
  }

  public toJSON(): TokenUsageLedgerAttributes {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      version: this.version,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
