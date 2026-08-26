/**
 * ============================================================================
 * COGNIVANTA HTML DOCUMENT PARSER
 * ============================================================================
 */

import { DocumentType } from '@cognivanta/core';
import { DocumentParser, ParsedDocumentResult, ParsedDocumentSection } from './base.parser';

export class HTMLDocumentParser implements DocumentParser {
  public readonly supportedType: DocumentType = 'html';

  public async parse(bufferOrText: Buffer | string, fileName: string): Promise<ParsedDocumentResult> {
    const rawContent = typeof bufferOrText === 'string' ? bufferOrText : bufferOrText.toString('utf8');

    // Strip script and style tags
    let clean = rawContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Extract title
    const titleMatch = /<title>(.*?)<\/title>/i.exec(clean);
    const title = titleMatch ? titleMatch[1].trim() : fileName;

    // Convert breaks and block elements to newlines
    clean = clean.replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n');
    clean = clean.replace(/<br\s*\/?>/gi, '\n');

    // Strip remaining tags
    clean = clean.replace(/<[^>]+>/g, '');
    clean = clean.replace(/&nbsp;/g, ' ');
    clean = clean.replace(/&amp;/g, '&');
    clean = clean.replace(/&lt;/g, '<');
    clean = clean.replace(/&gt;/g, '>');

    const sections: ParsedDocumentSection[] = [
      {
        sectionIndex: 0,
        heading: title,
        content: clean.trim()
      }
    ];

    const words = clean.split(/\s+/).filter(Boolean);

    return {
      fileName,
      fileType: this.supportedType,
      rawText: clean.trim(),
      sections,
      metadata: {
        wordCount: words.length,
        characterCount: clean.length,
        customMetadata: { title }
      }
    };
  }
}

export const htmlParser = new HTMLDocumentParser();
