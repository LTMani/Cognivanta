/**
 * ============================================================================
 * COGNIVANTA JSON DOCUMENT PARSER
 * ============================================================================
 */

import { DocumentType } from '@cognivanta/core';
import { DocumentParser, ParsedDocumentResult, ParsedDocumentSection } from './base.parser';

export class JSONDocumentParser implements DocumentParser {
  public readonly supportedType: DocumentType = 'json';

  public async parse(bufferOrText: Buffer | string, fileName: string): Promise<ParsedDocumentResult> {
    const rawContent = typeof bufferOrText === 'string' ? bufferOrText : bufferOrText.toString('utf8');
    const sections: ParsedDocumentSection[] = [];

    try {
      const parsed = JSON.parse(rawContent);

      if (Array.isArray(parsed)) {
        parsed.forEach((item, idx) => {
          sections.push({
            sectionIndex: idx,
            heading: `Record [${idx + 1}]`,
            content: JSON.stringify(item, null, 2),
            metadata: { recordIndex: idx }
          });
        });
      } else if (typeof parsed === 'object' && parsed !== null) {
        Object.entries(parsed).forEach(([key, value], idx) => {
          sections.push({
            sectionIndex: idx,
            heading: `Key: ${key}`,
            content: typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value),
            metadata: { key }
          });
        });
      } else {
        sections.push({ sectionIndex: 0, content: rawContent });
      }
    } catch {
      sections.push({ sectionIndex: 0, content: rawContent });
    }

    const words = rawContent.split(/\s+/).filter(Boolean);

    return {
      fileName,
      fileType: this.supportedType,
      rawText: rawContent,
      sections,
      metadata: {
        wordCount: words.length,
        characterCount: rawContent.length,
        creationDate: new Date().toISOString()
      }
    };
  }
}

export const jsonParser = new JSONDocumentParser();
