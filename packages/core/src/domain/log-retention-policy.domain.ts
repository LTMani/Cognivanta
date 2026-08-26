/**
 * ============================================================================
 * COGNIVANTA DOMAIN MODEL: LOGRETENTIONPOLICY
 * ============================================================================
 */

import { generateUUID, sha256 } from '../utils';

export interface LogRetentionPolicyAttributes {
  id: string;
  name: string;
  organizationId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'PENDING';
  configuration: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export class LogRetentionPolicy {
  private attributes: LogRetentionPolicyAttributes;

  constructor(attrs?: Partial<LogRetentionPolicyAttributes>) {
    const now = new Date().toISOString();
    this.attributes = {
      id: attrs?.id || generateUUID(),
      name: attrs?.name || 'LogRetentionPolicy Default Item',
      organizationId: attrs?.organizationId || 'org-cognivanta-global',
      status: attrs?.status || 'ACTIVE',
      configuration: attrs?.configuration || {},
      createdAt: attrs?.createdAt || now,
      updatedAt: attrs?.updatedAt || now
    };
  }

  public getId(): string { return this.attributes.id; }
  public getName(): string { return this.attributes.name; }
  public getOrganizationId(): string { return this.attributes.organizationId; }
  public getStatus(): string { return this.attributes.status; }
  public getConfiguration(): Record<string, unknown> { return { ...this.attributes.configuration }; }

  public updateConfig(newConfig: Record<string, unknown>): this {
    this.attributes.configuration = { ...this.attributes.configuration, ...newConfig };
    this.attributes.updatedAt = new Date().toISOString();
    return this;
  }

  public setStatus(status: LogRetentionPolicyAttributes['status']): this {
    this.attributes.status = status;
    this.attributes.updatedAt = new Date().toISOString();
    return this;
  }

  public calculateHash(): string {
    return sha256(this.attributes);
  }

  public toJSON(): LogRetentionPolicyAttributes {
    return { ...this.attributes };
  }
}
