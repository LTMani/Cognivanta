/**
 * ============================================================================
 * COGNIVANTA TABULAR STRUCTURE & KEYPHRASE EXTRACTOR
 * ============================================================================
 */

export interface ExtractedTable {
  headers: string[];
  rows: string[][];
  rowCount: number;
}

export class TableExtractor {
  public extractMarkdownTables(text: string): ExtractedTable[] {
    const tables: ExtractedTable[] = [];
    const lines = text.split('\n');
    let inTable = false;
    let currentHeaders: string[] = [];
    let currentRows: string[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('|') && line.endsWith('|')) {
        const cells = line.split('|').slice(1, -1).map(c => c.trim());

        if (!inTable) {
          inTable = true;
          currentHeaders = cells;
          currentRows = [];
        } else if (line.includes('---')) {
          // Separator row, skip
          continue;
        } else {
          currentRows.push(cells);
        }
      } else {
        if (inTable && currentRows.length > 0) {
          tables.push({
            headers: currentHeaders,
            rows: currentRows,
            rowCount: currentRows.length
          });
        }
        inTable = false;
      }
    }

    if (inTable && currentRows.length > 0) {
      tables.push({
        headers: currentHeaders,
        rows: currentRows,
        rowCount: currentRows.length
      });
    }

    return tables;
  }
}

export class KeyphraseExtractor {
  public extract(text: string, topN: number = 8): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);

    const stopwords = new Set([
      'this', 'that', 'with', 'from', 'have', 'were', 'which', 'their', 'there', 'about', 'would', 'could', 'should'
    ]);

    const freqMap = new Map<string, number>();
    for (const w of words) {
      if (!stopwords.has(w)) {
        freqMap.set(w, (freqMap.get(w) || 0) + 1);
      }
    }

    const sorted = Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, topN).map(item => item[0]);
  }
}

export const tableExtractor = new TableExtractor();
export const keyphraseExtractor = new KeyphraseExtractor();
