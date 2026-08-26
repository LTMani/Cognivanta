/**
 * ============================================================================
 * COGNIVANTA SOURCE CODE DOCUMENT PARSER
 * ============================================================================
 */

import { DocumentType } from '@cognivanta/core';
import { DocumentParser, ParsedDocumentResult, ParsedDocumentSection } from './base.parser';

export class CodeDocumentParser implements DocumentParser {
  public readonly supportedType: DocumentType = 'code';

  public async parse(bufferOrText: Buffer | string, fileName: string): Promise<ParsedDocumentResult> {
    const rawContent = typeof bufferOrText === 'string' ? bufferOrText : bufferOrText.toString('utf8');
    const sections: ParsedDocumentSection[] = [];

    // Parse top-level functions, classes, interfaces
    const lines = rawContent.split('\n');
    let currentBlock: string[] = [];
    let currentHeading = 'Global Scope';
    let blockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = /^(export\s+)?(class|interface|function|const|let|var|type|def|async\s+function)\s+([a-zA-Z0-9_]+)/.exec(line.trim());

      if (match && currentBlock.length > 10) {
        sections.push({
          sectionIndex: blockIndex++,
          heading: currentHeading,
          content: currentBlock.join('\n')
        });
        currentBlock = [];
        currentHeading = match[3];
      }

      currentBlock.push(line);
    }

    if (currentBlock.length > 0) {
      sections.push({
        sectionIndex: blockIndex,
        heading: currentHeading,
        content: currentBlock.join('\n')
      });
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
        customMetadata: { totalLines: lines.length }
      }
    };
  }
}

export const codeParser = new CodeDocumentParser();
