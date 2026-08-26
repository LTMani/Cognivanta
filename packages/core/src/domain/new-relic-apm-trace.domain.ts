/**
 * ============================================================================
 * COGNIVANTA DOMAIN MODEL: NEWRELICAPMTRACE
 * ============================================================================
 */

import { generateUUID, sha256 } from '../utils';

export interface NewRelicApmTraceAttributes {
  id: string;
  name: string;
  organizationId: string;
  state: 'INITIALIZING' | 'READY' | 'DEGRADED' | 'FAILED';
  spec: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export class NewRelicApmTrace {
  private attributes: NewRelicApmTraceAttributes;

  constructor(attrs?: Partial<NewRelicApmTraceAttributes>) {
    const now = new Date().toISOString();
    this.attributes = {
      id: attrs?.id || generateUUID(),
      name: attrs?.name || 'NewRelicApmTrace Standard Configuration',
      organizationId: attrs?.organizationId || 'org-cognivanta-global',
      state: attrs?.state || 'READY',
      spec: attrs?.spec || {},
      createdAt: attrs?.createdAt || now,
      updatedAt: attrs?.updatedAt || now
    };
  }

  public getId(): string { return this.attributes.id; }
  public getName(): string { return this.attributes.name; }
  public getOrganizationId(): string { return this.attributes.organizationId; }
  public getState(): string { return this.attributes.state; }
  public getSpec(): Record<string, unknown> { return { ...this.attributes.spec }; }

  public updateSpec(newSpec: Record<string, unknown>): this {
    this.attributes.spec = { ...this.attributes.spec, ...newSpec };
    this.attributes.updatedAt = new Date().toISOString();
    return this;
  }

  public setState(state: NewRelicApmTraceAttributes['state']): this {
    this.attributes.state = state;
    this.attributes.updatedAt = new Date().toISOString();
    return this;
  }

  public calculateHash(): string {
    return sha256(this.attributes);
  }

  public toJSON(): NewRelicApmTraceAttributes {
    return { ...this.attributes };
  }
}
