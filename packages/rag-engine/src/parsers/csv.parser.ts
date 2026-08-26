/**
 * ============================================================================
 * COGNIVANTA CSV / TABULAR DATA PARSER
 * ============================================================================
 */

import { DocumentType } from '@cognivanta/core';
import { DocumentParser, ParsedDocumentResult, ParsedDocumentSection } from './base.parser';

export class CSVDocumentParser implements DocumentParser {
  public readonly supportedType: DocumentType = 'csv';

  public async parse(bufferOrText: Buffer | string, fileName: string): Promise<ParsedDocumentResult> {
    const rawContent = typeof bufferOrText === 'string' ? bufferOrText : bufferOrText.toString('utf8');
    const lines = rawContent.split(/\r?\n/).filter(Boolean);

    if (lines.length === 0) {
      return {
        fileName,
        fileType: this.supportedType,
        rawText: '',
        sections: [],
        metadata: { wordCount: 0, characterCount: 0 }
      };
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const sections: ParsedDocumentSection[] = [];
    const formattedRows: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      const rowText = Object.entries(rowObj)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' | ');

      formattedRows.push(rowText);

      // Group into batches of 10 rows per section for chunking
      if (i % 10 === 0 || i === lines.length - 1) {
        sections.push({
          sectionIndex: Math.floor(i / 10),
          heading: `Rows ${Math.max(1, i - 9)} to ${i}`,
          content: formattedRows.join('\n')
        });
        formattedRows.length = 0;
      }
    }

    const fullText = `Headers: ${headers.join(', ')}\n\n` + lines.join('\n');
    const words = fullText.split(/\s+/).filter(Boolean);

    return {
      fileName,
      fileType: this.supportedType,
      rawText: fullText,
      sections,
      metadata: {
        wordCount: words.length,
        characterCount: fullText.length,
        customMetadata: {
          rowCount: lines.length - 1,
          columnCount: headers.length,
          columns: headers
        }
      }
    };
  }
}

export const csvParser = new CSVDocumentParser();
