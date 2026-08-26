/**
 * ============================================================================
 * COGNIVANTA ADVANCED VECTOR & MATRIX MATHEMATICAL ALGORITHMS
 * ============================================================================
 */

export class VectorMath {
  public static dotProduct(a: number[], b: number[]): number {
    let sum = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) sum += a[i] * b[i];
    return sum;
  }

  public static euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) sum += Math.pow(a[i] - b[i], 2);
    return Math.sqrt(sum);
  }

  public static manhattanDistance(a: number[], b: number[]): number {
    let sum = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) sum += Math.abs(a[i] - b[i]);
    return sum;
  }

  public static normalize(vec: number[]): number[] {
    const norm = Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
    if (norm === 0) return vec.slice();
    return vec.map(val => Number((val / norm).toFixed(6)));
  }

  public static pca2DProjection(vectors: number[][]): Array<{ x: number; y: number }> {
    if (vectors.length === 0) return [];
    const dim = vectors[0].length;

    // Center vectors
    const mean = new Array(dim).fill(0);
    for (const v of vectors) {
      for (let d = 0; d < dim; d++) mean[d] += v[d];
    }
    for (let d = 0; d < dim; d++) mean[d] /= vectors.length;

    // Simulated 2-component principal projection
    return vectors.map(v => {
      const x = v.slice(0, Math.floor(dim / 2)).reduce((acc, val, idx) => acc + (val - mean[idx]), 0);
      const y = v.slice(Math.floor(dim / 2)).reduce((acc, val, idx) => acc + (val - mean[idx + Math.floor(dim / 2)]), 0);
      return {
        x: Number((x / (dim || 1)).toFixed(4)),
        y: Number((y / (dim || 1)).toFixed(4))
      };
    });
  }
}
