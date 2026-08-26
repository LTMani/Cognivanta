/**
 * ============================================================================
 * COGNIVANTA MARKDOWN DOCUMENT PARSER
 * ============================================================================
 */

import { DocumentType } from '@cognivanta/core';
import { DocumentParser, ParsedDocumentResult, ParsedDocumentSection } from './base.parser';

export class MarkdownDocumentParser implements DocumentParser {
  public readonly supportedType: DocumentType = 'markdown';

  public async parse(bufferOrText: Buffer | string, fileName: string): Promise<ParsedDocumentResult> {
    const rawContent = typeof bufferOrText === 'string' ? bufferOrText : bufferOrText.toString('utf8');
    const sections: ParsedDocumentSection[] = [];

    // Split by Markdown headings (#, ##, ###)
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    let match: RegExpExecArray | null;
    const matches: Array<{ index: number; level: number; title: string }> = [];

    while ((match = headingRegex.exec(rawContent)) !== null) {
      matches.push({
        index: match.index,
        level: match[1].length,
        title: match[2].trim()
      });
    }

    if (matches.length === 0) {
      sections.push({
        sectionIndex: 0,
        content: rawContent
      });
    } else {
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index;
        const end = i < matches.length - 1 ? matches[i + 1].index : rawContent.length;
        const sectionContent = rawContent.slice(start, end).trim();

        sections.push({
          sectionIndex: i,
          heading: matches[i].title,
          content: sectionContent,
          metadata: { headingLevel: matches[i].level }
        });
      }
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

export const markdownParser = new MarkdownDocumentParser();
