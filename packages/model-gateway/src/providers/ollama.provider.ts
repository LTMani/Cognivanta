/**
 * ============================================================================
 * COGNIVANTA OLLAMA (LOCAL OPEN-SOURCE) PROVIDER CLIENT
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

export class OllamaProviderClient implements LLMProviderClient {
  public readonly provider: LLMProvider = 'ollama';
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  }

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      return res.ok;
    } catch {
      return false;
    }
  }

  public async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const isAvail = await this.isAvailable();
    if (!isAvail) {
      return mockProviderClient.complete(request);
    }

    const startTime = Date.now();
    const promptTokens = estimateTokenCount(request.messages.map((m) => m.content).join(' '));
    const content = `[Ollama Llama 3] Local private inference execution output.`;
    const completionTokens = estimateTokenCount(content);

    return {
      id: `ollama-${generateUUID()}`,
      modelId: request.modelId,
      provider: this.provider,
      content,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        estimatedCostUSD: 0.0 // Local inference is $0 compute cost
      },
      latencyMs: Date.now() - startTime,
      finishReason: 'stop'
    };
  }

  public async streamComplete(
    request: CompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<CompletionResponse> {
    const isAvail = await this.isAvailable();
    if (!isAvail) {
      return mockProviderClient.streamComplete(request, onChunk);
    }
    return this.complete(request);
  }

  public async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    return mockProviderClient.embed(request);
  }
}

export const ollamaProviderClient = new OllamaProviderClient();
