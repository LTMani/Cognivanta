/**
 * ============================================================================
 * COGNIVANTA CORE RUNTIME SCHEMAS & VALIDATORS (ZOD)
 * ============================================================================
 * Strong runtime validation for all API inputs, DTOs, and configuration objects.
 */

import { z } from 'zod';

// ----------------------------------------------------------------------------
// User & Auth Schemas
// ----------------------------------------------------------------------------

export const UserRoleSchema = z.enum([
  'system_admin',
  'org_owner',
  'org_admin',
  'workspace_manager',
  'developer',
  'analyst',
  'member',
  'viewer'
]);

export const UserPreferencesSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']).default('dark'),
  defaultModel: z.string().default('gpt-4o'),
  defaultTemperature: z.number().min(0).max(2).default(0.7),
  notificationSettings: z.object({
    emailAlerts: z.boolean().default(true),
    inAppAlerts: z.boolean().default(true),
    workflowFailures: z.boolean().default(true),
    agentMilestones: z.boolean().default(true),
    securityEvents: z.boolean().default(true)
  }),
  editorFontSize: z.number().min(10).max(24).default(14),
  enableTelemetry: z.boolean().default(true)
});

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: UserRoleSchema.default('member'),
  organizationId: z.string().uuid().optional()
});

export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// ----------------------------------------------------------------------------
// Chat & Conversation Schemas
// ----------------------------------------------------------------------------

export const SendMessageRequestSchema = z.object({
  conversationId: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  modelId: z.string().default('gpt-4o'),
  message: z.string().min(1, 'Message content cannot be empty'),
  systemPromptOverride: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  topP: z.number().min(0).max(1).default(1.0),
  knowledgeSpaceIds: z.array(z.string().uuid()).default([]),
  stream: z.boolean().default(true),
  attachmentIds: z.array(z.string().uuid()).default([])
});

export const CreateConversationSchema = z.object({
  workspaceId: z.string().uuid(),
  title: z.string().min(1).max(200).default('New Conversation'),
  modelId: z.string().default('gpt-4o'),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  contextKnowledgeSpaceIds: z.array(z.string().uuid()).default([])
});

// ----------------------------------------------------------------------------
// Autonomous AI Agent Schemas
// ----------------------------------------------------------------------------

export const AgentRoleTypeSchema = z.enum([
  'researcher',
  'document_analyst',
  'data_analyst',
  'legal_advisor',
  'customer_support',
  'custom'
]);

export const AgentStatusSchema = z.enum(['active', 'paused', 'draft', 'archived']);

export const CreateAgentSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(2, 'Agent name must be at least 2 characters').max(100),
  description: z.string().max(500),
  roleType: AgentRoleTypeSchema.default('custom'),
  systemInstructions: z.string().min(10, 'System instructions must be detailed'),
  modelId: z.string().default('gpt-4o'),
  temperature: z.number().min(0).max(1.5).default(0.2),
  maxIterations: z.number().min(1).max(30).default(10),
  timeoutSeconds: z.number().min(10).max(600).default(120),
  enabledToolIds: z.array(z.string()).default([]),
  knowledgeSpaceIds: z.array(z.string().uuid()).default([]),
  memorySettings: z.object({
    enableShortTermMemory: z.boolean().default(true),
    enableLongTermMemory: z.boolean().default(true),
    enableSemanticMemory: z.boolean().default(true),
    maxMemoryTokens: z.number().default(4000),
    reflectionIntervalRuns: z.number().default(5)
  }).default({}),
  permissions: z.object({
    allowedToolDomains: z.array(z.string()).default(['*']),
    allowInternetAccess: z.boolean().default(true),
    allowCodeExecution: z.boolean().default(false),
    allowDatabaseWrite: z.boolean().default(false),
    requireHumanApprovalForActions: z.array(z.string()).default([])
  }).default({})
});

export const RunAgentTaskSchema = z.object({
  agentId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  inputPrompt: z.string().min(1, 'Task prompt cannot be empty'),
  contextVariables: z.record(z.unknown()).default({})
});

// ----------------------------------------------------------------------------
// Knowledge & RAG Retrieval Schemas
// ----------------------------------------------------------------------------

export const CreateKnowledgeSpaceSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  embeddingModelId: z.string().default('text-embedding-3-small'),
  accessLevel: z.enum(['private', 'workspace', 'public']).default('workspace')
});

export const RAGRetrievalQuerySchema = z.object({
  queryText: z.string().min(1, 'Query text is required'),
  knowledgeSpaceIds: z.array(z.string().uuid()).min(1, 'At least one knowledge space required'),
  topK: z.number().min(1).max(50).default(5),
  minScoreThreshold: z.number().min(0).max(1).default(0.4),
  rerank: z.boolean().default(true),
  filterMetadata: z.record(z.unknown()).optional()
});

// ----------------------------------------------------------------------------
// Visual Workflow Schemas
// ----------------------------------------------------------------------------

export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: z.enum([
    'trigger_manual',
    'trigger_schedule',
    'trigger_webhook',
    'llm_prompt',
    'rag_retrieval',
    'data_transform',
    'condition_branch',
    'api_request',
    'agent_task',
    'send_notification',
    'end_output'
  ]),
  title: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  config: z.record(z.unknown()).default({})
});

export const WorkflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  conditionLabel: z.string().optional()
});

export const SaveWorkflowSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  nodes: z.array(WorkflowNodeSchema).min(2, 'Workflow must contain at least 2 nodes'),
  edges: z.array(WorkflowEdgeSchema),
  triggerConfig: z.object({
    type: z.enum(['manual', 'cron', 'webhook']).default('manual'),
    cronExpression: z.string().optional(),
    webhookSecret: z.string().optional()
  }).default({ type: 'manual' })
});

export const ExecuteWorkflowSchema = z.object({
  workflowId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  inputParams: z.record(z.unknown()).default({})
});

// ----------------------------------------------------------------------------
// Evaluation Schemas
// ----------------------------------------------------------------------------

export const CreateEvalDatasetSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  samples: z.array(
    z.object({
      id: z.string().uuid().optional(),
      question: z.string().min(1),
      expectedAnswer: z.string().optional(),
      referenceContext: z.array(z.string()).default([])
    })
  ).min(1, 'Dataset must have at least 1 sample')
});

export const RunEvaluationSchema = z.object({
  datasetId: z.string().uuid(),
  modelId: z.string().default('gpt-4o'),
  systemPrompt: z.string().optional(),
  judgeModelId: z.string().default('gpt-4o')
});
