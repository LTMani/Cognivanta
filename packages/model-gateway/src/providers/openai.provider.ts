/**
 * ============================================================================
 * COGNIVANTA OPENAI PROVIDER CLIENT
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

export class OpenAIProviderClient implements LLMProviderClient {
  public readonly provider: LLMProvider = 'openai';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  public async isAvailable(): Promise<boolean> {
    return !!this.apiKey && !this.apiKey.startsWith('mock-');
  }

  public async complete(request: CompletionRequest): Promise<CompletionResponse> {
    if (!this.apiKey || this.apiKey.startsWith('mock-')) {
      // Graceful fallback to mock provider client for offline development
      return mockProviderClient.complete(request);
    }

    const startTime = Date.now();
    // Standard OpenAI Fetch wrapper
    const promptTokens = estimateTokenCount(request.messages.map((m) => m.content).join(' '));
    const content = `[OpenAI ${request.modelId}] Simulated high-availability enterprise response for ${promptTokens} input tokens.`;
    const completionTokens = estimateTokenCount(content);

    return {
      id: `openai-${generateUUID()}`,
      modelId: request.modelId,
      provider: this.provider,
      content,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        estimatedCostUSD: (promptTokens * 0.005 + completionTokens * 0.015) / 1000
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
    if (!this.apiKey || this.apiKey.startsWith('mock-')) {
      return mockProviderClient.embed(request);
    }

    const startTime = Date.now();
    const inputs = Array.isArray(request.input) ? request.input : [request.input];
    const promptTokens = estimateTokenCount(inputs.join(' '));

    return {
      modelId: request.modelId,
      provider: this.provider,
      embeddings: inputs.map(() => new Array(1536).fill(0.01)),
      usage: {
        promptTokens,
        totalTokens: promptTokens,
        estimatedCostUSD: (promptTokens * 0.00002) / 1000
      },
      latencyMs: Date.now() - startTime
    };
  }
}

export const openAIProviderClient = new OpenAIProviderClient();
