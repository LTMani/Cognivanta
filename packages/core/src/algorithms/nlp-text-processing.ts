/**
 * ============================================================================
 * COGNIVANTA NLP & TEXT PROCESSING ALGORITHMS
 * ============================================================================
 */

export class NLPTextProcessor {
  public static extractNgrams(words: string[], n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n).join(' '));
    }
    return ngrams;
  }

  public static computeTFIDF(
    docTokens: string[],
    corpusDocTokens: string[][]
  ): Map<string, number> {
    const tfMap = new Map<string, number>();
    for (const t of docTokens) {
      tfMap.set(t, (tfMap.get(t) || 0) + 1);
    }

    const N = corpusDocTokens.length;
    const tfidfMap = new Map<string, number>();

    for (const [term, count] of tfMap.entries()) {
      const tf = count / docTokens.length;
      const docsWithTerm = corpusDocTokens.filter(doc => doc.includes(term)).length;
      const idf = Math.log((N + 1) / (docsWithTerm + 1)) + 1;
      tfidfMap.set(term, Number((tf * idf).toFixed(5)));
    }

    return tfidfMap;
  }
}
