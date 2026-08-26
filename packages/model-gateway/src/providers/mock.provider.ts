/**
 * ============================================================================
 * COGNIVANTA BUILT-IN MOCK AI PROVIDER (OFFLINE / LOCAL ZERO-KEY RUNNER)
 * ============================================================================
 * Generates deterministic, highly intelligent responses, reasoning steps,
 * tool calls, and high-dimensional embeddings for local standalone testing.
 */

import {
  LLMProvider,
  generateUUID,
  estimateTokenCount,
  sha256
} from '@cognivanta/core';
import {
  CompletionRequest,
  CompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  LLMProviderClient,
  StreamChunk
} from '../interfaces';

export class MockProviderClient implements LLMProviderClient {
  public readonly provider: LLMProvider = 'mock';

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  public async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const startTime = Date.now();
    const lastUserMessage = [...request.messages].reverse().find((m) => m.role === 'user');
    const prompt = lastUserMessage?.content || 'Hello';

    const content = this.generateResponseContent(prompt, request);
    const promptTokens = estimateTokenCount(request.messages.map((m) => m.content).join(' '));
    const completionTokens = estimateTokenCount(content);
    const latencyMs = Math.max(120, Date.now() - startTime);

    return {
      id: `mock-resp-${generateUUID()}`,
      modelId: request.modelId,
      provider: this.provider,
      content,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        estimatedCostUSD: 0.0
      },
      latencyMs,
      finishReason: 'stop'
    };
  }

  public async streamComplete(
    request: CompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<CompletionResponse> {
    const startTime = Date.now();
    const lastUserMessage = [...request.messages].reverse().find((m) => m.role === 'user');
    const prompt = lastUserMessage?.content || 'Hello';

    const fullContent = this.generateResponseContent(prompt, request);
    const words = fullContent.split(' ');
    const id = `mock-stream-${generateUUID()}`;

    for (let i = 0; i < words.length; i++) {
      const deltaText = (i === 0 ? '' : ' ') + words[i];
      onChunk({
        id,
        deltaText,
        isComplete: i === words.length - 1
      });
      // Minimal simulated network latency
      await new Promise((resolve) => setTimeout(resolve, 8));
    }

    const promptTokens = estimateTokenCount(request.messages.map((m) => m.content).join(' '));
    const completionTokens = estimateTokenCount(fullContent);
    const latencyMs = Math.max(150, Date.now() - startTime);

    return {
      id,
      modelId: request.modelId,
      provider: this.provider,
      content: fullContent,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        estimatedCostUSD: 0.0
      },
      latencyMs,
      finishReason: 'stop'
    };
  }

  public async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const startTime = Date.now();
    const inputs = Array.isArray(request.input) ? request.input : [request.input];
    const embeddings: number[][] = [];
    const dimension = 384;

    for (const text of inputs) {
      embeddings.push(this.generateDeterministicEmbedding(text, dimension));
    }

    const promptTokens = estimateTokenCount(inputs.join(' '));

    return {
      modelId: request.modelId,
      provider: this.provider,
      embeddings,
      usage: {
        promptTokens,
        totalTokens: promptTokens,
        estimatedCostUSD: 0.0
      },
      latencyMs: Date.now() - startTime
    };
  }

  private generateResponseContent(prompt: string, request: CompletionRequest): string {
    const lower = prompt.toLowerCase();

    if (lower.includes('financial') || lower.includes('q1') || lower.includes('revenue')) {
      return `Here are the synthesized highlights from the Q1 Financial Report:

• **Total Revenue**: Reached **$42.8M**, reflecting an **18.6%** increase year-over-year.
• **Gross Margin**: Sustained at **74.2%** due to optimization of AI inference pipelines.
• **Operating Income**: **$11.4M**, with EBITDA margins expanding by **320 bps**.
• **Free Cash Flow**: Strong liquidity with **$16.5M** cash generated from core enterprise contracts.

All data points have been verified and cross-referenced against official balance sheet filings.`;
    }

    if (lower.includes('summary') || lower.includes('summarize')) {
      return `Executive Summary & Core Takeaways:

1. **Strategic Overview**: The enterprise intelligence platform is orchestrating hybrid RAG, autonomous agents, and model gateways seamlessly.
2. **Key Metrics**: System health is maintained at 99.9% uptime with sub-1.5s p95 latency.
3. **Action Items**: Workflows can now be triggered on scheduled intervals or via authenticated webhooks.`;
    }

    if (lower.includes('code') || lower.includes('function') || lower.includes('typescript')) {
      return `Here is the requested implementation with strict typing:

\`\`\`typescript
export async function executeEnterpriseTask(payload: { taskId: string; priority: number }): Promise<boolean> {
  console.log(\`Processing task: \${payload.taskId} with priority \${payload.priority}\`);
  // Structured execution logic
  return true;
}
\`\`\`

This code adheres to enterprise safety guidelines and includes error handling.`;
    }

    return `I have processed your request: "${prompt}".

The Cognivanta Enterprise AI Platform has analyzed the query using active workspace models and knowledge spaces.
• Context Grounding: Verified against indexed knowledge repositories.
• Reasoning Pipeline: Validated through multi-step agent verification.
• Next Steps: You can export this intelligence, attach it to a visual workflow, or delegate follow-up tasks to specialized agents.`;
  }

  private generateDeterministicEmbedding(text: string, dimension: number): number[] {
    const vector: number[] = new Array(dimension).fill(0);
    const hash = sha256(text);

    // Populate vector pseudo-randomly based on hash bytes
    for (let i = 0; i < dimension; i++) {
      const charCode = hash.charCodeAt(i % hash.length);
      const val = (charCode - 64) / 64.0 + Math.sin(i * 0.1);
      vector[i] = val;
    }

    // Normalize vector to unit length
    let norm = 0;
    for (let i = 0; i < dimension; i++) {
      norm += vector[i] * vector[i];
    }
    norm = Math.sqrt(norm) || 1;

    for (let i = 0; i < dimension; i++) {
      vector[i] = vector[i] / norm;
    }

    return vector;
  }
}

export const mockProviderClient = new MockProviderClient();
