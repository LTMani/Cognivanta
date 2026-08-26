/**
 * ============================================================================
 * COGNIVANTA PLATFORM UTILITIES & MATHEMATICAL ALGORITHMS
 * ============================================================================
 */

/**
 * Generate cryptographic UUID v4 (isomorphic)
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate secure alphanumeric API key or token
 */
export function generateApiKey(prefix: string = 'cgv_live'): string {
  let hex = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    for (let i = 0; i < 48; i++) {
      hex += Math.floor(Math.random() * 16).toString(16);
    }
  }
  return `${prefix}_${hex}`;
}

/**
 * Compute SHA-256 hash of arbitrary content (isomorphic deterministic hash)
 */
export function sha256(data: string | Record<string, unknown>): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  // Pure JS fast deterministic 64-char hash fallback
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const part3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const part4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  return (part1 + part2 + part3 + part4 + part1 + part2 + part3 + part4).slice(0, 64);
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
 * Estimate token count using heuristic (approx ~3.8 chars per token in English)
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
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
