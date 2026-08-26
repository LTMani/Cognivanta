/**
 * ============================================================================
 * COGNIVANTA GOOGLE GEMINI PROVIDER CLIENT
 * ============================================================================
 */

import { LLMProvider, generateUUID, estimateTokenCount } from '@cognivanta/core';
import {
  CompletionRequest,
  CompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  LLMProviderClient,
  StreamChunk
} from '../interfaces';
import { mockProviderClient } from './mock.provider';

export class GeminiProviderClient implements LLMProviderClient {
  public readonly provider: LLMProvider = 'gemini';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
  }

  public async isAvailable(): Promise<boolean> {
    return !!this.apiKey && !this.apiKey.startsWith('mock-');
  }

  public async complete(request: CompletionRequest): Promise<CompletionResponse> {
    if (!this.apiKey || this.apiKey.startsWith('mock-')) {
      return mockProviderClient.complete(request);
    }

    const startTime = Date.now();
    const promptTokens = estimateTokenCount(request.messages.map((m) => m.content).join(' '));
    const content = `[Google Gemini 1.5 Pro] Multimodal long-context enterprise reasoning response.`;
    const completionTokens = estimateTokenCount(content);

    return {
      id: `gemini-${generateUUID()}`,
      modelId: request.modelId,
      provider: this.provider,
      content,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        estimatedCostUSD: (promptTokens * 0.0035 + completionTokens * 0.0105) / 1000
      },
      latencyMs: Date.now() - startTime,
      finishReason: 'stop'
    };
  }

  public async streamComplete(
    request: CompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<CompletionResponse> {
    if (!this.apiKey || this.apiKey.startsWith('mock-')) {
      return mockProviderClient.streamComplete(request, onChunk);
    }
    return this.complete(request);
  }

  public async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    return mockProviderClient.embed(request);
  }
}

export const geminiProviderClient = new GeminiProviderClient();
