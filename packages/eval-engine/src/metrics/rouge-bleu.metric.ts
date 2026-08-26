/**
 * ============================================================================
 * COGNIVANTA ROUGE & BLEU ALGORITHMIC SCORERS
 * ============================================================================
 * Algorithmic implementation of ROUGE-1, ROUGE-2, ROUGE-L, and BLEU metrics.
 */

export interface RougeScores {
  rouge1: number;
  rouge2: number;
  rougeL: number;
}

export class RougeBleuEvaluator {
  public calculateRouge(reference: string, candidate: string): RougeScores {
    const refTokens = this.tokenize(reference);
    const candTokens = this.tokenize(candidate);

    const r1 = this.calculateNgramOverlap(refTokens, candTokens, 1);
    const r2 = this.calculateNgramOverlap(refTokens, candTokens, 2);
    const rL = this.calculateLCS(refTokens, candTokens);

    return {
      rouge1: Number(r1.toFixed(4)),
      rouge2: Number(r2.toFixed(4)),
      rougeL: Number(rL.toFixed(4))
    };
  }

  public calculateBleu(reference: string, candidate: string): number {
    const refTokens = this.tokenize(reference);
    const candTokens = this.tokenize(candidate);

    if (candTokens.length === 0 || refTokens.length === 0) return 0;

    const p1 = this.calculateNgramPrecision(refTokens, candTokens, 1);
    const p2 = this.calculateNgramPrecision(refTokens, candTokens, 2);

    // Brevity penalty
    const bp = candTokens.length > refTokens.length ? 1 : Math.exp(1 - refTokens.length / candTokens.length);
    const geomMean = Math.sqrt((p1 || 0.01) * (p2 || 0.01));

    return Number((bp * geomMean).toFixed(4));
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  }

  private calculateNgramOverlap(ref: string[], cand: string[], n: number): number {
    if (ref.length < n || cand.length < n) return 0;

    const refNgrams = this.getNgrams(ref, n);
    const candNgrams = this.getNgrams(cand, n);

    const refSet = new Set(refNgrams);
    let matchCount = 0;

    for (const ng of candNgrams) {
      if (refSet.has(ng)) matchCount++;
    }

    const precision = matchCount / candNgrams.length;
    const recall = matchCount / refNgrams.length;

    if (precision + recall === 0) return 0;
    return (2 * precision * recall) / (precision + recall);
  }

  private calculateNgramPrecision(ref: string[], cand: string[], n: number): number {
    if (cand.length < n) return 0;
    const refSet = new Set(this.getNgrams(ref, n));
    const candNgrams = this.getNgrams(cand, n);
    const matches = candNgrams.filter(ng => refSet.has(ng)).length;
    return matches / candNgrams.length;
  }

  private getNgrams(tokens: string[], n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n).join(' '));
    }
    return ngrams;
  }

  private calculateLCS(seq1: string[], seq2: string[]): number {
    const m = seq1.length;
    const n = seq2.length;
    if (m === 0 || n === 0) return 0;

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (seq1[i - 1] === seq2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const lcsLen = dp[m][n];
    const precision = lcsLen / n;
    const recall = lcsLen / m;

    if (precision + recall === 0) return 0;
    return (2 * precision * recall) / (precision + recall);
  }
}

export const rougeBleuEvaluator = new RougeBleuEvaluator();
