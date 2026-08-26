/**
 * ============================================================================
 * COGNIVANTA SDK RESOURCE: APIKEYCONTROLLER
 * ============================================================================
 * Description: Developer API token provisioning and rotation endpoints
 */

export class ApiKeyControllerClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  public async list(): Promise<Array<Record<string, unknown>>> {
    const res = await fetch(`${this.baseUrl}/api-keys`, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    });
    if (!res.ok) throw new Error(`Failed to list api-keys: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  }

  public async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}/api-keys`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Failed to create api-keys: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  }
}
