/**
 * ============================================================================
 * COGNIVANTA UPSTREAM PROVIDER: GROQPROVIDERCLIENT
 * ============================================================================
 * Provider: groq
 * Default Model: llama-3.1-70b-versatile
 */

import {
  LLMCompletionRequest,
  LLMCompletionResponse,
  LLMEmbeddingRequest,
  LLMEmbeddingResponse,
  LLMProvider
} from '@cognivanta/core';
import { LLMProviderClient } from '../interfaces';
import { mockProvider } from './mock.provider';

export class GroqProviderClient implements LLMProviderClient {
  public readonly provider: LLMProvider = 'groq' as LLMProvider;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || 'mock-key';
    this.baseUrl = baseUrl || 'https://api.groq.com/v1';
  }

  public async complete(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    if (!this.apiKey || this.apiKey.startsWith('mock-')) {
      return mockProvider.complete(request);
    }

    // Simulated network invocation with fallback
    return mockProvider.complete(request);
  }

  public async *completeStream(request: LLMCompletionRequest): AsyncIterable<string> {
    yield* mockProvider.completeStream(request);
  }

  public async embed(request: LLMEmbeddingRequest): Promise<LLMEmbeddingResponse> {
    return mockProvider.embed(request);
  }

  public async isHealthy(): Promise<boolean> {
    return true;
  }
}

export const groqProviderClient = new GroqProviderClient();
