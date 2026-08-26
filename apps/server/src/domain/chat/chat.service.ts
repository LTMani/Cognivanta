/**
 * ============================================================================
 * COGNIVANTA AI CHAT & CONVERSATION SERVICE
 * ============================================================================
 */

import {
  Conversation,
  ChatMessage,
  generateUUID,
  NotFoundError,
  SendMessageRequestSchema,
  Citation
} from '@cognivanta/core';
import { conversationRepository, auditRepository } from '@cognivanta/db';
import { modelGateway, StreamChunk } from '@cognivanta/model-gateway';

export class ChatService {
  public async createConversation(params: {
    workspaceId: string;
    userId: string;
    title?: string;
    modelId?: string;
    systemPrompt?: string;
  }): Promise<Conversation> {
    const id = generateUUID();
    const conv: Conversation = {
      id,
      workspaceId: params.workspaceId,
      userId: params.userId,
      title: params.title || 'New Conversation',
      modelId: params.modelId || 'gpt-4o',
      systemPrompt: params.systemPrompt,
      temperature: 0.7,
      topP: 1.0,
      contextKnowledgeSpaceIds: [],
      pinnedMessageIds: [],
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return conversationRepository.create(conv);
  }

  public async listConversations(workspaceId: string): Promise<Conversation[]> {
    return conversationRepository.findByWorkspace(workspaceId);
  }

  public async getMessages(conversationId: string): Promise<ChatMessage[]> {
    return conversationRepository.getMessages(conversationId);
  }

  public async sendMessage(params: {
    conversationId?: string;
    workspaceId: string;
    userId: string;
    userEmail: string;
    message: string;
    modelId?: string;
    systemPromptOverride?: string;
    temperature?: number;
    knowledgeSpaceIds?: string[];
  }): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
    let conversationId = params.conversationId;

    if (!conversationId) {
      const newConv = await this.createConversation({
        workspaceId: params.workspaceId,
        userId: params.userId,
        title: params.message.slice(0, 40) + '...',
        modelId: params.modelId
      });
      conversationId = newConv.id;
    }

    // Save user message
    const userMsgId = generateUUID();
    const userMessage: ChatMessage = {
      id: userMsgId,
      conversationId,
      role: 'user',
      content: params.message,
      createdAt: new Date().toISOString()
    };
    await conversationRepository.addMessage(userMessage);

    // Retrieve previous history for context
    const history = await conversationRepository.getMessages(conversationId);

    // Call Model Gateway
    const response = await modelGateway.complete({
      modelId: params.modelId || 'gpt-4o',
      messages: history.map((m) => ({
        role: m.role as 'system' | 'user' | 'assistant' | 'tool',
        content: m.content
      })),
      temperature: params.temperature || 0.7
    });

    const assistantMsgId = generateUUID();
    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      conversationId,
      role: 'assistant',
      content: response.content,
      tokenUsage: {
        promptTokens: response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
        totalTokens: response.usage.totalTokens,
        costUSD: response.usage.estimatedCostUSD
      },
      latencyMs: response.latencyMs,
      modelUsed: response.modelId,
      createdAt: new Date().toISOString()
    };

    await conversationRepository.addMessage(assistantMessage);

    return { userMessage, assistantMessage };
  }

  public async streamMessage(
    params: {
      conversationId?: string;
      workspaceId: string;
      userId: string;
      message: string;
      modelId?: string;
    },
    onChunk: (chunk: StreamChunk) => void
  ): Promise<ChatMessage> {
    let conversationId = params.conversationId;
    if (!conversationId) {
      const newConv = await this.createConversation({
        workspaceId: params.workspaceId,
        userId: params.userId,
        title: params.message.slice(0, 40) + '...',
        modelId: params.modelId
      });
      conversationId = newConv.id;
    }

    const userMsgId = generateUUID();
    const userMessage: ChatMessage = {
      id: userMsgId,
      conversationId,
      role: 'user',
      content: params.message,
      createdAt: new Date().toISOString()
    };
    await conversationRepository.addMessage(userMessage);

    const history = await conversationRepository.getMessages(conversationId);

    const completion = await modelGateway.streamComplete(
      {
        modelId: params.modelId || 'gpt-4o',
        messages: history.map((m) => ({
          role: m.role as 'system' | 'user' | 'assistant' | 'tool',
          content: m.content
        }))
      },
      onChunk
    );

    const assistantMessage: ChatMessage = {
      id: generateUUID(),
      conversationId,
      role: 'assistant',
      content: completion.content,
      tokenUsage: {
        promptTokens: completion.usage.promptTokens,
        completionTokens: completion.usage.completionTokens,
        totalTokens: completion.usage.totalTokens,
        costUSD: completion.usage.estimatedCostUSD
      },
      latencyMs: completion.latencyMs,
      modelUsed: completion.modelId,
      createdAt: new Date().toISOString()
    };

    await conversationRepository.addMessage(assistantMessage);
    return assistantMessage;
  }
}

export const chatService = new ChatService();
