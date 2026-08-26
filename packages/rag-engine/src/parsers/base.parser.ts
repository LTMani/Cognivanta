/**
 * ============================================================================
 * COGNIVANTA BASE DOCUMENT PARSER CONTRACT
 * ============================================================================
 */

import { DocumentType } from '@cognivanta/core';

export interface ParsedDocumentSection {
  sectionIndex: number;
  heading?: string;
  pageNumber?: number;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ParsedDocumentResult {
  fileName: string;
  fileType: DocumentType;
  rawText: string;
  sections: ParsedDocumentSection[];
  metadata: {
    pageCount?: number;
    wordCount: number;
    characterCount: number;
    author?: string;
    creationDate?: string;
    customMetadata?: Record<string, unknown>;
  };
}

export interface DocumentParser {
  readonly supportedType: DocumentType;
  parse(bufferOrText: Buffer | string, fileName: string): Promise<ParsedDocumentResult>;
}
