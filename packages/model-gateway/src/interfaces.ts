/**
 * ============================================================================
 * COGNIVANTA MODEL GATEWAY INTERFACES & CONTRACTS
 * ============================================================================
 */

import { ChatMessage, LLMProvider, ModelDefinition, ToolCall, ToolDefinition } from '@cognivanta/core';

export interface CompletionRequest {
  modelId: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    name?: string;
    toolCallId?: string;
    toolCalls?: ToolCall[];
  }>;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
  toolChoice?: 'auto' | 'none' | 'required' | { type: 'function'; function: { name: string } };
  responseFormat?: { type: 'text' | 'json_object' };
  stream?: boolean;
}

export interface CompletionResponse {
  id: string;
  modelId: string;
  provider: LLMProvider;
  content: string;
  toolCalls?: ToolCall[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUSD: number;
  };
  latencyMs: number;
  finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
}

export interface StreamChunk {
  id: string;
  deltaText: string;
  toolCalls?: Partial<ToolCall>[];
  finishReason?: string;
  isComplete: boolean;
}

export interface EmbeddingRequest {
  modelId: string;
  input: string | string[];
}

export interface EmbeddingResponse {
  modelId: string;
  provider: LLMProvider;
  embeddings: number[][];
  usage: {
    promptTokens: number;
    totalTokens: number;
    estimatedCostUSD: number;
  };
  latencyMs: number;
}

export interface LLMProviderClient {
  readonly provider: LLMProvider;
  isAvailable(): Promise<boolean>;
  complete(request: CompletionRequest): Promise<CompletionResponse>;
  streamComplete(
    request: CompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<CompletionResponse>;
  embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
}
