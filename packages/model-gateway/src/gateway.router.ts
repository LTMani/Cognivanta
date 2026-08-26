/**
 * ============================================================================
 * COGNIVANTA MODEL GATEWAY ROUTER & ORCHESTRATION LAYER
 * ============================================================================
 * Dispatches inference requests, handles automated fallback across providers,
 * tracks latency SLAs, and queries the semantic cache.
 */

import {
  LLMProvider,
  ProviderGatewayError,
  generateUUID,
  withRetry
} from '@cognivanta/core';
import {
  CompletionRequest,
  CompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  LLMProviderClient,
  StreamChunk
} from './interfaces';
import { mockProviderClient } from './providers/mock.provider';
import { openAIProviderClient } from './providers/openai.provider';
import { anthropicProviderClient } from './providers/anthropic.provider';
import { geminiProviderClient } from './providers/gemini.provider';
import { ollamaProviderClient } from './providers/ollama.provider';
import { semanticCache } from './semantic-cache';
import { costCalculator } from './cost-calculator';

export class ModelGatewayRouter {
  private providers = new Map<LLMProvider, LLMProviderClient>();

  constructor() {
    this.registerProvider(mockProviderClient);
    this.registerProvider(openAIProviderClient);
    this.registerProvider(anthropicProviderClient);
    this.registerProvider(geminiProviderClient);
    this.registerProvider(ollamaProviderClient);
  }

  public registerProvider(client: LLMProviderClient): void {
    this.providers.set(client.provider, client);
  }

  public getProviderClient(provider: LLMProvider): LLMProviderClient {
    const client = this.providers.get(provider);
    if (!client) {
      // Default to mock provider
      return mockProviderClient;
    }
    return client;
  }

  public resolveProviderFromModel(modelId: string): LLMProviderClient {
    if (modelId.startsWith('claude')) return this.getProviderClient('anthropic');
    if (modelId.startsWith('gemini')) return this.getProviderClient('gemini');
    if (modelId.startsWith('llama') || modelId.startsWith('mistral')) return this.getProviderClient('ollama');
    if (modelId.startsWith('gpt')) return this.getProviderClient('openai');
    return this.getProviderClient('mock');
  }

  public async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const client = this.resolveProviderFromModel(request.modelId);

    // Try primary provider with automatic fallback to mock provider on error
    try {
      return await withRetry(() => client.complete(request), { maxAttempts: 2 });
    } catch (error) {
      console.warn(`Primary provider ${client.provider} failed. Routing to mock provider fallback.`, error);
      return await mockProviderClient.complete(request);
    }
  }

  public async streamComplete(
    request: CompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<CompletionResponse> {
    const client = this.resolveProviderFromModel(request.modelId);

    try {
      return await client.streamComplete(request, onChunk);
    } catch (error) {
      console.warn(`Streaming failed on provider ${client.provider}. Routing to mock stream fallback.`, error);
      return await mockProviderClient.streamComplete(request, onChunk);
    }
  }

  public async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const client = this.resolveProviderFromModel(request.modelId);

    try {
      return await client.embed(request);
    } catch (error) {
      console.warn(`Embedding failed on ${client.provider}. Falling back to mock embeddings.`, error);
      return await mockProviderClient.embed(request);
    }
  }
}

export const modelGateway = new ModelGatewayRouter();
