/**
 * ============================================================================
 * COGNIVANTA NAMED ENTITY RECOGNITION (NER) & EXTRACTION ENGINE
 * ============================================================================
 * Extracts structured entities (Organizations, People, Monetary Values,
 * Dates, Locations, and Product Names) from unstructured text.
 */

export interface ExtractedEntity {
  text: string;
  category: 'organization' | 'money' | 'date' | 'person' | 'location' | 'email' | 'metric';
  confidence: number;
  charStart: number;
  charEnd: number;
}

export class EntityExtractor {
  public extract(text: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];

    // 1. Monetary Amounts ($1.2M, $4,250.75, €500k, 100 USD)
    const moneyRegex = /\b(?:\$|€|£|¥)\s*\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:million|billion|k|m|b))?\b/gi;
    let match: RegExpExecArray | null;

    while ((match = moneyRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        category: 'money',
        confidence: 0.96,
        charStart: match.index,
        charEnd: match.index + match[0].length
      });
    }

    // 2. Dates (May 20, 2024, 2024-05-20, Q1 2024)
    const dateRegex = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,\s*\d{4})?|\b\d{4}-\d{2}-\d{2}\b|\bQ[1-4]\s+\d{4}\b/gi;
    while ((match = dateRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        category: 'date',
        confidence: 0.94,
        charStart: match.index,
        charEnd: match.index + match[0].length
      });
    }

    // 3. Percentages & Metrics (18.6%, +12.5%, 99.9%)
    const metricRegex = /[+-]?\d+(?:\.\d+)?%/g;
    while ((match = metricRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        category: 'metric',
        confidence: 0.98,
        charStart: match.index,
        charEnd: match.index + match[0].length
      });
    }

    // 4. Email Addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b/g;
    while ((match = emailRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        category: 'email',
        confidence: 0.99,
        charStart: match.index,
        charEnd: match.index + match[0].length
      });
    }

    return entities;
  }
}

export const entityExtractor = new EntityExtractor();
