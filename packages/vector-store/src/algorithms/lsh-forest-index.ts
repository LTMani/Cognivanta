/**
 * ============================================================================
 * COGNIVANTA LOCALITY-SENSITIVE HASHING (LSH) FOREST
 * ============================================================================
 */

export class LSHForestIndex {
  private buckets = new Map<string, string[]>();
  private numTrees: number = 8;
  private hashLength: number = 16;

  public insert(id: string, vector: number[]): void {
    const hash = this.computeHash(vector);
    if (!this.buckets.has(hash)) {
      this.buckets.set(hash, []);
    }
    this.buckets.get(hash)!.push(id);
  }

  public query(vector: number[]): string[] {
    const hash = this.computeHash(vector);
    return this.buckets.get(hash) || [];
  }

  private computeHash(vector: number[]): string {
    let binary = '';
    for (let i = 0; i < this.hashLength; i++) {
      const dot = vector.slice(i * 2, i * 2 + 2).reduce((a, b) => a + b, 0);
      binary += dot >= 0 ? '1' : '0';
    }
    return binary;
  }
}
