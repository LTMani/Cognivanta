/**
 * ============================================================================
 * COGNIVANTA SDK RESOURCE: TEAMCONTROLLER
 * ============================================================================
 * Description: Team and department management endpoints
 */

export class TeamControllerClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  public async list(): Promise<Array<Record<string, unknown>>> {
    const res = await fetch(`${this.baseUrl}/teams`, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    });
    if (!res.ok) throw new Error(`Failed to list teams: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  }

  public async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}/teams`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Failed to create teams: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  }
}
