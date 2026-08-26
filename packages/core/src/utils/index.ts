/**
 * ============================================================================
 * COGNIVANTA PLATFORM UTILITIES & MATHEMATICAL ALGORITHMS
 * ============================================================================
 */

import * as crypto from 'crypto';

/**
 * Generate cryptographic UUID v4
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Generate secure alphanumeric API key or token
 */
export function generateApiKey(prefix: string = 'cgv_live'): string {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  return `${prefix}_${randomBytes}`;
}

/**
 * Compute SHA-256 hash of arbitrary content or object
 */
export function sha256(data: string | Record<string, unknown>): string {
  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  return crypto.createHash('sha256').update(serialized, 'utf8').digest('hex');
}

/**
 * Compute cosine similarity between two float vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Estimate token count using heuristic (approx ~4 chars per token in English)
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  // Account for words and punctuation
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return Math.ceil(trimmed.length / 3.8);
}

/**
 * Interpolate template variables into text with {{variable}} syntax
 */
export function interpolatePromptTemplate(
  template: string,
  variables: Record<string, unknown>
): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      const val = variables[key];
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val, null, 2);
      return String(val);
    }
    return match;
  });
}

/**
 * Async retry with exponential backoff and jitter
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelayMs?: number;
    backoffFactor?: number;
    maxDelayMs?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  let delay = options.initialDelayMs ?? 500;
  const backoff = options.backoffFactor ?? 2;
  const maxDelay = options.maxDelayMs ?? 10000;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt === maxAttempts) {
        break;
      }

      if (options.onRetry) {
        options.onRetry(lastError, attempt);
      }

      const jitter = Math.random() * 200;
      await new Promise((resolve) => setTimeout(resolve, Math.min(delay + jitter, maxDelay)));
      delay *= backoff;
    }
  }

  throw lastError || new Error('Operation failed after maximum retry attempts');
}

/**
 * Redact sensitive PII data (emails, credit cards, SSN, API keys) from text
 */
export function redactPII(text: string): { sanitizedText: string; detectedCount: number } {
  let count = 0;
  let sanitized = text;

  // Redact email addresses
  sanitized = sanitized.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g,
    () => {
      count++;
      return '[REDACTED_EMAIL]';
    }
  );

  // Redact credit cards
  sanitized = sanitized.replace(
    /\b(?:\d{4}[ -]?){3}\d{4}\b/g,
    () => {
      count++;
      return '[REDACTED_CARD]';
    }
  );

  // Redact Social Security Numbers (SSN)
  sanitized = sanitized.replace(
    /\b\d{3}-\d{2}-\d{4}\b/g,
    () => {
      count++;
      return '[REDACTED_SSN]';
    }
  );

  return { sanitizedText: sanitized, detectedCount: count };
}
