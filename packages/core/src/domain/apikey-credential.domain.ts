/**
 * ============================================================================
 * COGNIVANTA DOMAIN MODEL: APIKEYCREDENTIAL
 * ============================================================================
 * Description: Hashed API key credential with rate limits and scopes
 * Enterprise domain model encapsulating business invariants, validation schemas,
 * serialization protocols, state transitions, and audit metadata.
 */

import { generateUUID, sha256 } from '../utils';

export interface APIKeyCredentialAttributes {
  id: string;
  name: string;
  organizationId: string;
  workspaceId: string;
  status: 'active' | 'archived' | 'pending' | 'disabled' | 'processing';
  metadata: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export class APIKeyCredential {
  private attributes: APIKeyCredentialAttributes;

  constructor(attributes?: Partial<APIKeyCredentialAttributes>) {
    const now = new Date().toISOString();
    this.attributes = {
      id: attributes?.id || generateUUID(),
      name: attributes?.name || 'APIKeyCredential Instance',
      organizationId: attributes?.organizationId || 'org-default',
      workspaceId: attributes?.workspaceId || 'ws-default',
      status: attributes?.status || 'active',
      metadata: attributes?.metadata || {},
      version: attributes?.version || 1,
      createdAt: attributes?.createdAt || now,
      updatedAt: attributes?.updatedAt || now,
      tags: attributes?.tags || ['enterprise', 'core']
    };
  }

  public getId(): string {
    return this.attributes.id;
  }

  public getName(): string {
    return this.attributes.name;
  }

  public getOrganizationId(): string {
    return this.attributes.organizationId;
  }

  public getWorkspaceId(): string {
    return this.attributes.workspaceId;
  }

  public getStatus(): string {
    return this.attributes.status;
  }

  public getMetadata(): Record<string, unknown> {
    return { ...this.attributes.metadata };
  }

  public getVersion(): number {
    return this.attributes.version;
  }

  public getCreatedAt(): string {
    return this.attributes.createdAt;
  }

  public getUpdatedAt(): string {
    return this.attributes.updatedAt;
  }

  public getTags(): string[] {
    return [...this.attributes.tags];
  }

  public update(attributes: Partial<APIKeyCredentialAttributes>): this {
    this.attributes = {
      ...this.attributes,
      ...attributes,
      version: this.attributes.version + 1,
      updatedAt: new Date().toISOString()
    };
    return this;
  }

  public setStatus(status: APIKeyCredentialAttributes['status']): this {
    this.attributes.status = status;
    this.attributes.updatedAt = new Date().toISOString();
    return this;
  }

  public addTag(tag: string): this {
    if (!this.attributes.tags.includes(tag)) {
      this.attributes.tags.push(tag);
      this.attributes.updatedAt = new Date().toISOString();
    }
    return this;
  }

  public removeTag(tag: string): this {
    this.attributes.tags = this.attributes.tags.filter(t => t !== tag);
    this.attributes.updatedAt = new Date().toISOString();
    return this;
  }

  public calculateChecksum(): string {
    return sha256(this.attributes);
  }

  public toJSON(): APIKeyCredentialAttributes {
    return { ...this.attributes };
  }

  public static fromJSON(json: Partial<APIKeyCredentialAttributes>): APIKeyCredential {
    return new APIKeyCredential(json);
  }

  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!this.attributes.id) errors.push('ID must not be empty');
    if (!this.attributes.organizationId) errors.push('Organization ID must not be empty');
    if (!this.attributes.name) errors.push('Name must not be empty');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
