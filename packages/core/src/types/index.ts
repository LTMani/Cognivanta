/**
 * ============================================================================
 * COGNIVANTA CORE TYPES & DOMAIN MODELS
 * ============================================================================
 * Comprehensive domain interfaces and types for the Cognivanta Enterprise Platform.
 */

// ----------------------------------------------------------------------------
// 1. Identity, Multi-Tenancy & Access Control
// ----------------------------------------------------------------------------

export type UserRole = 'system_admin' | 'org_owner' | 'org_admin' | 'workspace_manager' | 'developer' | 'analyst' | 'member' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  organizationId: string;
  workspaceIds: string[];
  preferences: UserPreferences;
  status: 'active' | 'suspended' | 'invited';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  defaultModel: string;
  defaultTemperature: number;
  notificationSettings: {
    emailAlerts: boolean;
    inAppAlerts: boolean;
    workflowFailures: boolean;
    agentMilestones: boolean;
    securityEvents: boolean;
  };
  editorFontSize: number;
  enableTelemetry: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free_tier' | 'starter' | 'professional' | 'enterprise_dedicated';
  ownerId: string;
  settings: OrganizationSettings;
  billing: OrganizationBilling;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  enforceSSO: boolean;
  allowedDomains: string[];
  maxWorkspaces: number;
  maxUsers: number;
  allowedProviders: LLMProvider[];
  monthlyTokenQuota: number;
  monthlyBudgetCapUSD: number;
  enablePIIMasking: boolean;
  retentionDays: number;
}

export interface OrganizationBilling {
  currentPeriodTokensUsed: number;
  currentPeriodCostUSD: number;
  tierLimitUSD: number;
  billingCycleAnchor: string;
  paymentMethodStatus: 'active' | 'past_due' | 'unconfigured';
}

export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  memberIds: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------------
// 2. AI Model Gateway & Providers
// ----------------------------------------------------------------------------

export type LLMProvider = 'mock' | 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'cohere' | 'mistral' | 'azure_openai';

export type ModelModality = 'text' | 'code' | 'multimodal' | 'embedding' | 'rerank';

export interface ModelCapability {
  supportsStreaming: boolean;
  supportsFunctionCalling: boolean;
  supportsVision: boolean;
  supportsAudio: boolean;
  supportsJSONSchema: boolean;
  contextWindow: number;
  maxOutputTokens: number;
}

export interface ModelDefinition {
  id: string;
  provider: LLMProvider;
  modelName: string;
  displayName: string;
  version: string;
  modality: ModelModality;
  capabilities: ModelCapability;
  pricing: {
    inputPer1kTokensUSD: number;
    outputPer1kTokensUSD: number;
    cachedInputPer1kTokensUSD?: number;
  };
  isAvailable: boolean;
  isDefault: boolean;
}

export interface ModelRoutingRule {
  id: string;
  organizationId: string;
  taskType: 'chat' | 'rag_generation' | 'agent_reasoning' | 'code_generation' | 'embedding' | 'extraction' | 'summarization';
  primaryModelId: string;
  fallbackModelIds: string[];
  latencySlaMs: number;
  maxCostPerCallUSD: number;
  retryCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function';
  content: string;
  name?: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
  citations?: Citation[];
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costUSD: number;
  };
  latencyMs?: number;
  modelUsed?: string;
  attachments?: Attachment[];
  feedback?: {
    rating: 1 | -1;
    comment?: string;
    submittedAt: string;
  };
  createdAt: string;
}

export interface Conversation {
  id: string;
  workspaceId: string;
  userId: string;
  title: string;
  modelId: string;
  systemPrompt?: string;
  temperature: number;
  topP: number;
  maxTokens?: number;
  contextKnowledgeSpaceIds: string[];
  pinnedMessageIds: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey: string;
  url?: string;
  status: 'uploading' | 'processed' | 'error';
  extractedText?: string;
}

// ----------------------------------------------------------------------------
// 3. Autonomous AI Agents & Tools
// ----------------------------------------------------------------------------

export type AgentRoleType = 'researcher' | 'document_analyst' | 'data_analyst' | 'legal_advisor' | 'customer_support' | 'custom';

export type AgentStatus = 'active' | 'paused' | 'draft' | 'archived';

export interface AgentDefinition {
  id: string;
  organizationId: string;
  workspaceId: string;
  name: string;
  description: string;
  avatarUrl?: string;
  roleType: AgentRoleType;
  status: AgentStatus;
  systemInstructions: string;
  modelId: string;
  temperature: number;
  maxIterations: number;
  timeoutSeconds: number;
  enabledToolIds: string[];
  knowledgeSpaceIds: string[];
  memorySettings: AgentMemorySettings;
  permissions: AgentPermissionPolicy;
  metrics: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    averageDurationMs: number;
    totalTokensUsed: number;
    totalCostUSD: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AgentMemorySettings {
  enableShortTermMemory: boolean;
  enableLongTermMemory: boolean;
  enableSemanticMemory: boolean;
  maxMemoryTokens: number;
  reflectionIntervalRuns: number;
}

export interface AgentPermissionPolicy {
  allowedToolDomains: string[];
  allowInternetAccess: boolean;
  allowCodeExecution: boolean;
  allowDatabaseWrite: boolean;
  requireHumanApprovalForActions: string[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'search' | 'data' | 'api' | 'code' | 'system' | 'custom';
  inputSchema: Record<string, unknown>; // JSON Schema object
  outputSchema?: Record<string, unknown>;
  isSystem: boolean;
  requiresAuth: boolean;
  authConfig?: {
    type: 'bearer' | 'api_key' | 'basic';
    headerName?: string;
  };
  timeoutMs: number;
  createdAt: string;
}

export interface ToolCall {
  id: string;
  toolName: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  toolName: string;
  result: unknown;
  error?: string;
  executionTimeMs: number;
}

export interface AgentExecutionRun {
  id: string;
  agentId: string;
  workspaceId: string;
  userId: string;
  inputPrompt: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'awaiting_approval';
  steps: AgentExecutionStep[];
  finalOutput?: string;
  error?: string;
  totalTokensUsed: number;
  totalCostUSD: number;
  durationMs: number;
  startedAt: string;
  completedAt?: string;
}

export interface AgentExecutionStep {
  stepIndex: number;
  thought: string;
  action?: string;
  actionInput?: Record<string, unknown>;
  observation?: unknown;
  durationMs: number;
  tokenCount?: number;
  timestamp: string;
}

// ----------------------------------------------------------------------------
// 4. Knowledge Management, RAG & Vector Engine
// ----------------------------------------------------------------------------

export interface KnowledgeSpace {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  embeddingModelId: string;
  vectorIndexName: string;
  documentCount: number;
  chunkCount: number;
  totalSizeBytes: number;
  accessLevel: 'private' | 'workspace' | 'public';
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 'pdf' | 'docx' | 'txt' | 'markdown' | 'csv' | 'json' | 'html' | 'code';

export interface DocumentRecord {
  id: string;
  knowledgeSpaceId: string;
  workspaceId: string;
  name: string;
  fileName: string;
  fileType: DocumentType;
  fileSizeBytes: number;
  storageKey: string;
  status: 'queued' | 'parsing' | 'chunking' | 'embedding' | 'indexed' | 'failed';
  errorMessage?: string;
  chunkCount: number;
  tokenCount: number;
  metadata: Record<string, unknown>;
  author?: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  knowledgeSpaceId: string;
  chunkIndex: number;
  content: string;
  tokenLength: number;
  embedding?: number[];
  metadata: {
    pageNumber?: number;
    sectionHeading?: string;
    sourceFile: string;
    charStart: number;
    charEnd: number;
    tags?: string[];
  };
}

export interface VectorSearchResult {
  chunk: DocumentChunk;
  score: number; // Cosine similarity or RRF blended score (0 to 1)
  denseScore?: number;
  sparseScore?: number;
}

export interface Citation {
  id: string;
  documentId: string;
  documentName: string;
  chunkId: string;
  textSnippet: string;
  pageNumber?: number;
  sectionHeading?: string;
  confidenceScore: number;
}

export interface RAGRetrievalQuery {
  queryText: string;
  knowledgeSpaceIds: string[];
  topK: number;
  minScoreThreshold: number;
  rerank: boolean;
  filterMetadata?: Record<string, unknown>;
}

export interface RAGRetrievalResult {
  query: string;
  retrievedChunks: VectorSearchResult[];
  assembledContext: string;
  totalRetrieved: number;
  retrievalLatencyMs: number;
  rerankLatencyMs?: number;
}

// ----------------------------------------------------------------------------
// 5. Visual Workflows & DAG Engine
// ----------------------------------------------------------------------------

export type WorkflowNodeType =
  | 'trigger_manual'
  | 'trigger_schedule'
  | 'trigger_webhook'
  | 'llm_prompt'
  | 'rag_retrieval'
  | 'data_transform'
  | 'condition_branch'
  | 'api_request'
  | 'agent_task'
  | 'send_notification'
  | 'end_output';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  conditionLabel?: string;
}

export interface WorkflowDefinition {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  version: number;
  status: 'draft' | 'active' | 'paused';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  triggerConfig: {
    type: 'manual' | 'cron' | 'webhook';
    cronExpression?: string;
    webhookSecret?: string;
  };
  metrics: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    avgExecutionSeconds: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecutionRun {
  id: string;
  workflowId: string;
  workspaceId: string;
  triggeredBy: string; // User ID or 'system_cron' or 'webhook'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  nodeExecutionStates: Record<string, {
    status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
    inputData?: unknown;
    outputData?: unknown;
    error?: string;
    startedAt: string;
    finishedAt?: string;
    durationMs: number;
  }>;
  inputParams: Record<string, unknown>;
  outputResult?: unknown;
  error?: string;
  startedAt: string;
  finishedAt?: string;
  durationMs: number;
}

// ----------------------------------------------------------------------------
// 6. Analytics, Token Metering & Cost Tracking
// ----------------------------------------------------------------------------

export interface TokenUsageRecord {
  id: string;
  organizationId: string;
  workspaceId: string;
  userId?: string;
  agentId?: string;
  workflowId?: string;
  provider: LLMProvider;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUSD: number;
  latencyMs: number;
  statusCode: number;
  timestamp: string;
}

export interface AnalyticsTimeseriesPoint {
  timestamp: string;
  queryCount: number;
  totalTokens: number;
  costUSD: number;
  avgLatencyMs: number;
  errorCount: number;
}

export interface PlatformAnalyticsOverview {
  totalQueries: number;
  totalTokensUsed: number;
  totalCostUSD: number;
  activeUsersCount: number;
  activeAgentsCount: number;
  activeWorkflowsCount: number;
  totalDocumentsCount: number;
  storageUsedBytes: number;
  systemHealthPercentage: number;
  queryDistribution: Record<string, number>; // e.g. { 'AI Chat': 45, 'RAG Search': 25, 'Agents': 15, 'Workflows': 10, 'Other': 5 }
  queriesOverTime: AnalyticsTimeseriesPoint[];
  topUsersByQueries: {
    userId: string;
    userName: string;
    queryCount: number;
    tokenCount: number;
    costUSD: number;
  }[];
}

// ----------------------------------------------------------------------------
// 7. Audit Logging & Security Compliance
// ----------------------------------------------------------------------------

export type AuditActionType =
  | 'user.login'
  | 'user.logout'
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'conversation.created'
  | 'conversation.deleted'
  | 'document.uploaded'
  | 'document.indexed'
  | 'document.deleted'
  | 'agent.created'
  | 'agent.updated'
  | 'agent.executed'
  | 'workflow.executed'
  | 'api_key.generated'
  | 'api_key.revoked'
  | 'model.route_changed'
  | 'settings.updated'
  | 'security.pii_detected';

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  workspaceId?: string;
  actorId: string;
  actorEmail: string;
  action: AuditActionType;
  resourceType: string;
  resourceId: string;
  ipAddress?: string;
  userAgent?: string;
  payload: Record<string, unknown>;
  previousHash: string; // Cryptographic SHA-256 chain
  currentHash: string;
  timestamp: string;
}

// ----------------------------------------------------------------------------
// 8. Evaluation & Experimentation
// ----------------------------------------------------------------------------

export interface EvalDataset {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  sampleCount: number;
  samples: EvalSample[];
  createdAt: string;
  updatedAt: string;
}

export interface EvalSample {
  id: string;
  question: string;
  expectedAnswer?: string;
  referenceContext?: string[];
  metadata?: Record<string, unknown>;
}

export interface EvalRunResult {
  id: string;
  datasetId: string;
  modelId: string;
  systemPrompt?: string;
  scores: {
    faithfulness: number;      // 0.0 to 1.0 (RAG context adherence)
    answerRelevance: number;   // 0.0 to 1.0
    contextPrecision: number;  // 0.0 to 1.0
    contextRecall: number;     // 0.0 to 1.0
    rougeL?: number;
    bleuScore?: number;
    latencyAverageMs: number;
  };
  sampleResults: {
    sampleId: string;
    generatedOutput: string;
    retrievedContexts: string[];
    isPass: boolean;
    scores: Record<string, number>;
    critique?: string;
  }[];
  totalSamples: number;
  passedSamples: number;
  createdAt: string;
}
