/**
 * ============================================================================
 * COGNIVANTA DOCUMENT PARSER FACTORY
 * ============================================================================
 */

import { DocumentType } from '@cognivanta/core';
import { DocumentParser } from './base.parser';
import { pdfParser } from './pdf.parser';
import { docxParser } from './docx.parser';
import { csvParser } from './csv.parser';
import { jsonParser } from './json.parser';
import { markdownParser } from './markdown.parser';
import { htmlParser } from './html.parser';
import { codeParser } from './code.parser';

export class DocumentParserFactory {
  private static parsers = new Map<DocumentType, DocumentParser>([
    ['pdf', pdfParser],
    ['docx', docxParser],
    ['csv', csvParser],
    ['json', jsonParser],
    ['markdown', markdownParser],
    ['txt', markdownParser],
    ['html', htmlParser],
    ['code', codeParser]
  ]);

  public static getParser(type: DocumentType): DocumentParser {
    const parser = this.parsers.get(type);
    if (!parser) {
      return markdownParser; // Default text fallback
    }
    return parser;
  }

  public static detectTypeFromFilename(fileName: string): DocumentType {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'pdf';
      case 'docx':
      case 'doc':
        return 'docx';
      case 'csv':
        return 'csv';
      case 'json':
        return 'json';
      case 'md':
      case 'markdown':
        return 'markdown';
      case 'html':
      case 'htm':
        return 'html';
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
      case 'py':
      case 'java':
      case 'cpp':
      case 'go':
      case 'rs':
      case 'sql':
        return 'code';
      default:
        return 'txt';
    }
  }
}
