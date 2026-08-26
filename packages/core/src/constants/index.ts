/**
 * ============================================================================
 * COGNIVANTA PLATFORM SYSTEM CONSTANTS & CONFIGURATION DEFAULTS
 * ============================================================================
 */

import { LLMProvider, ModelDefinition } from '../types';

export const PLATFORM_NAME = 'Cognivanta';
export const PLATFORM_VERSION = '1.0.0';
export const API_VERSION = 'v1';

// ----------------------------------------------------------------------------
// Built-in AI Model Registry Definitions
// ----------------------------------------------------------------------------

export const DEFAULT_MODELS: ModelDefinition[] = [
  {
    id: 'gpt-4o',
    provider: 'openai',
    modelName: 'gpt-4o',
    displayName: 'GPT-4o (Omni)',
    version: '2024-05-13',
    modality: 'multimodal',
    capabilities: {
      supportsStreaming: true,
      supportsFunctionCalling: true,
      supportsVision: true,
      supportsAudio: false,
      supportsJSONSchema: true,
      contextWindow: 128000,
      maxOutputTokens: 4096
    },
    pricing: {
      inputPer1kTokensUSD: 0.005,
      outputPer1kTokensUSD: 0.015,
      cachedInputPer1kTokensUSD: 0.0025
    },
    isAvailable: true,
    isDefault: true
  },
  {
    id: 'claude-3-5-sonnet',
    provider: 'anthropic',
    modelName: 'claude-3-5-sonnet-20240620',
    displayName: 'Claude 3.5 Sonnet',
    version: '20240620',
    modality: 'multimodal',
    capabilities: {
      supportsStreaming: true,
      supportsFunctionCalling: true,
      supportsVision: true,
      supportsAudio: false,
      supportsJSONSchema: true,
      contextWindow: 200000,
      maxOutputTokens: 8192
    },
    pricing: {
      inputPer1kTokensUSD: 0.003,
      outputPer1kTokensUSD: 0.015
    },
    isAvailable: true,
    isDefault: false
  },
  {
    id: 'gemini-1-5-pro',
    provider: 'gemini',
    modelName: 'gemini-1.5-pro-latest',
    displayName: 'Gemini 1.5 Pro',
    version: 'latest',
    modality: 'multimodal',
    capabilities: {
      supportsStreaming: true,
      supportsFunctionCalling: true,
      supportsVision: true,
      supportsAudio: true,
      supportsJSONSchema: true,
      contextWindow: 1000000,
      maxOutputTokens: 8192
    },
    pricing: {
      inputPer1kTokensUSD: 0.0035,
      outputPer1kTokensUSD: 0.0105
    },
    isAvailable: true,
    isDefault: false
  },
  {
    id: 'llama-3-70b-instruct',
    provider: 'ollama',
    modelName: 'llama3:70b-instruct',
    displayName: 'Llama 3 70B (Local)',
    version: 'latest',
    modality: 'text',
    capabilities: {
      supportsStreaming: true,
      supportsFunctionCalling: true,
      supportsVision: false,
      supportsAudio: false,
      supportsJSONSchema: true,
      contextWindow: 32000,
      maxOutputTokens: 4096
    },
    pricing: {
      inputPer1kTokensUSD: 0.0,
      outputPer1kTokensUSD: 0.0
    },
    isAvailable: true,
    isDefault: false
  },
  {
    id: 'mock-llm-local',
    provider: 'mock',
    modelName: 'mock-enterprise-llm',
    displayName: 'Cognivanta Mock Local LLM',
    version: '1.0.0',
    modality: 'text',
    capabilities: {
      supportsStreaming: true,
      supportsFunctionCalling: true,
      supportsVision: false,
      supportsAudio: false,
      supportsJSONSchema: true,
      contextWindow: 64000,
      maxOutputTokens: 4096
    },
    pricing: {
      inputPer1kTokensUSD: 0.0,
      outputPer1kTokensUSD: 0.0
    },
    isAvailable: true,
    isDefault: false
  }
];

export const DEFAULT_EMBEDDING_MODELS: ModelDefinition[] = [
  {
    id: 'text-embedding-3-small',
    provider: 'openai',
    modelName: 'text-embedding-3-small',
    displayName: 'OpenAI Embedding 3 Small (1536d)',
    version: 'latest',
    modality: 'embedding',
    capabilities: {
      supportsStreaming: false,
      supportsFunctionCalling: false,
      supportsVision: false,
      supportsAudio: false,
      supportsJSONSchema: false,
      contextWindow: 8191,
      maxOutputTokens: 1536
    },
    pricing: {
      inputPer1kTokensUSD: 0.00002,
      outputPer1kTokensUSD: 0.0
    },
    isAvailable: true,
    isDefault: true
  },
  {
    id: 'mock-embedding-local',
    provider: 'mock',
    modelName: 'mock-embedding-384',
    displayName: 'Cognivanta Mock Embedding (384d)',
    version: '1.0.0',
    modality: 'embedding',
    capabilities: {
      supportsStreaming: false,
      supportsFunctionCalling: false,
      supportsVision: false,
      supportsAudio: false,
      supportsJSONSchema: false,
      contextWindow: 8191,
      maxOutputTokens: 384
    },
    pricing: {
      inputPer1kTokensUSD: 0.0,
      outputPer1kTokensUSD: 0.0
    },
    isAvailable: true,
    isDefault: false
  }
];

// ----------------------------------------------------------------------------
// Role-Based Permissions Matrix
// ----------------------------------------------------------------------------

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  system_admin: ['*'],
  org_owner: [
    'org:manage',
    'workspace:*',
    'user:*',
    'billing:*',
    'model:*',
    'knowledge:*',
    'agent:*',
    'workflow:*',
    'audit:read',
    'analytics:read'
  ],
  org_admin: [
    'workspace:*',
    'user:read',
    'user:invite',
    'model:read',
    'knowledge:*',
    'agent:*',
    'workflow:*',
    'audit:read',
    'analytics:read'
  ],
  workspace_manager: [
    'workspace:update',
    'knowledge:*',
    'agent:*',
    'workflow:*',
    'conversation:*',
    'analytics:read'
  ],
  developer: [
    'knowledge:read',
    'knowledge:create',
    'agent:*',
    'workflow:*',
    'conversation:*',
    'api_key:create',
    'api_key:read'
  ],
  analyst: [
    'knowledge:read',
    'agent:read',
    'agent:execute',
    'workflow:read',
    'workflow:execute',
    'conversation:*',
    'analytics:read'
  ],
  member: [
    'knowledge:read',
    'agent:read',
    'agent:execute',
    'workflow:read',
    'workflow:execute',
    'conversation:*'
  ],
  viewer: [
    'knowledge:read',
    'conversation:read',
    'analytics:read'
  ]
};
