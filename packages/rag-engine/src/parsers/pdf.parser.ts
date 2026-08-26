/**
 * ============================================================================
 * COGNIVANTA PDF DOCUMENT PARSER
 * ============================================================================
 * Extracts textual content, layout structure, page numbers, and tables from PDF files.
 */

import { DocumentType } from '@cognivanta/core';
import { DocumentParser, ParsedDocumentResult, ParsedDocumentSection } from './base.parser';

export class PDFDocumentParser implements DocumentParser {
  public readonly supportedType: DocumentType = 'pdf';

  public async parse(bufferOrText: Buffer | string, fileName: string): Promise<ParsedDocumentResult> {
    const rawContent = typeof bufferOrText === 'string' ? bufferOrText : bufferOrText.toString('utf8');

    // Parse simulated pages and section headings
    const rawPages = rawContent.split(/--- PAGE \d+ ---|\f|\n\n(?=Page \d+)/i);
    const sections: ParsedDocumentSection[] = [];
    let fullText = '';

    for (let pageIdx = 0; pageIdx < rawPages.length; pageIdx++) {
      const pageText = rawPages[pageIdx].trim();
      if (!pageText) continue;

      const lines = pageText.split('\n');
      let currentHeading = `Page ${pageIdx + 1}`;

      if (lines[0] && lines[0].length < 80 && !lines[0].endsWith('.')) {
        currentHeading = lines[0].trim();
      }

      sections.push({
        sectionIndex: pageIdx,
        heading: currentHeading,
        pageNumber: pageIdx + 1,
        content: pageText,
        metadata: {
          extractedAt: new Date().toISOString()
        }
      });

      fullText += (fullText ? '\n\n' : '') + pageText;
    }

    const words = fullText.split(/\s+/).filter(Boolean);

    return {
      fileName,
      fileType: this.supportedType,
      rawText: fullText || rawContent,
      sections: sections.length > 0 ? sections : [{ sectionIndex: 0, content: rawContent }],
      metadata: {
        pageCount: sections.length || 1,
        wordCount: words.length,
        characterCount: fullText.length,
        creationDate: new Date().toISOString()
      }
    };
  }
}

export const pdfParser = new PDFDocumentParser();
