/**
 * ============================================================================
 * COGNIVANTA SDK RESOURCE: BILLINGCONTROLLER
 * ============================================================================
 * Description: Enterprise subscription and token quota endpoints
 */

export class BillingControllerClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  public async list(): Promise<Array<Record<string, unknown>>> {
    const res = await fetch(`${this.baseUrl}/billing`, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    });
    if (!res.ok) throw new Error(`Failed to list billing: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  }

  public async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}/billing`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Failed to create billing: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  }
}
