/**
 * ============================================================================
 * COGNIVANTA DOCX / WORD DOCUMENT PARSER
 * ============================================================================
 */

import { DocumentType } from '@cognivanta/core';
import { DocumentParser, ParsedDocumentResult, ParsedDocumentSection } from './base.parser';

export class DOCXDocumentParser implements DocumentParser {
  public readonly supportedType: DocumentType = 'docx';

  public async parse(bufferOrText: Buffer | string, fileName: string): Promise<ParsedDocumentResult> {
    const rawContent = typeof bufferOrText === 'string' ? bufferOrText : bufferOrText.toString('utf8');
    const paragraphs = rawContent.split(/\n{2,}/);
    const sections: ParsedDocumentSection[] = [];

    paragraphs.forEach((p, idx) => {
      const trimmed = p.trim();
      if (trimmed) {
        sections.push({
          sectionIndex: idx,
          content: trimmed,
          heading: trimmed.length < 60 ? trimmed : undefined
        });
      }
    });

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

export const docxParser = new DOCXDocumentParser();
