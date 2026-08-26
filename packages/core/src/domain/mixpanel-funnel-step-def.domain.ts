/**
 * ============================================================================
 * COGNIVANTA DOMAIN MODEL: MIXPANELFUNNELSTEPDEF
 * ============================================================================
 */

import { generateUUID, sha256 } from '../utils';

export interface MixpanelFunnelStepDefAttributes {
  id: string;
  name: string;
  organizationId: string;
  state: 'INITIALIZING' | 'READY' | 'DEGRADED' | 'FAILED';
  spec: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export class MixpanelFunnelStepDef {
  private attributes: MixpanelFunnelStepDefAttributes;

  constructor(attrs?: Partial<MixpanelFunnelStepDefAttributes>) {
    const now = new Date().toISOString();
    this.attributes = {
      id: attrs?.id || generateUUID(),
      name: attrs?.name || 'MixpanelFunnelStepDef Standard Configuration',
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

  public setState(state: MixpanelFunnelStepDefAttributes['state']): this {
    this.attributes.state = state;
    this.attributes.updatedAt = new Date().toISOString();
    return this;
  }

  public calculateHash(): string {
    return sha256(this.attributes);
  }

  public toJSON(): MixpanelFunnelStepDefAttributes {
    return { ...this.attributes };
  }
}
