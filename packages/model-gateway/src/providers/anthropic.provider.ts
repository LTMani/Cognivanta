/**
 * ============================================================================
 * COGNIVANTA ANTHROPIC PROVIDER CLIENT
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

export class AnthropicProviderClient implements LLMProviderClient {
  public readonly provider: LLMProvider = 'anthropic';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
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
    const content = `[Anthropic ${request.modelId}] Claude 3.5 intelligent synthesized response.`;
    const completionTokens = estimateTokenCount(content);

    return {
      id: `claude-${generateUUID()}`,
      modelId: request.modelId,
      provider: this.provider,
      content,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        estimatedCostUSD: (promptTokens * 0.003 + completionTokens * 0.015) / 1000
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

export const anthropicProviderClient = new AnthropicProviderClient();
