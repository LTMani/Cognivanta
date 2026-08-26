/**
 * ============================================================================
 * COGNIVANTA ADVANCED ENTERPRISE SUBSYSTEMS & FEATURES BUILDER
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
}

console.log('[*] Authoring advanced enterprise subsystems and unique features...');

// ----------------------------------------------------------------------------
// 1. SECURITY GUARDRAILS PACKAGE (packages/security-guardrails)
// ----------------------------------------------------------------------------

writeFile(
  path.join(__dirname, '../packages/security-guardrails/package.json'),
  JSON.stringify({
    name: '@cognivanta/security-guardrails',
    version: '1.0.0',
    description: 'Cognivanta Enterprise Guardrails, Prompt Injection Defense, Toxicity Classifier, and DLP Engine',
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    scripts: {
      build: 'tsc',
      test: 'node --test'
    },
    dependencies: {
      '@cognivanta/core': '*'
    },
    devDependencies: {
      typescript: '^5.4.5'
    }
  }, null, 2)
);

writeFile(
  path.join(__dirname, '../packages/security-guardrails/tsconfig.json'),
  JSON.stringify({
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src'
    },
    include: ['src/**/*']
  }, null, 2)
);

writeFile(
  path.join(__dirname, '../packages/security-guardrails/src/interfaces.ts'),
  `/**
 * ============================================================================
 * COGNIVANTA GUARDRAIL INTERFACES & RISK SCORING CONTRACTS
 * ============================================================================
 */

export type GuardrailAction = 'allow' | 'mask' | 'block' | 'flag_for_review';
export type ThreatCategory = 'prompt_injection' | 'jailbreak' | 'toxicity' | 'pii_leak' | 'hallucination' | 'system_override';

export interface GuardrailCheckResult {
  passed: boolean;
  action: GuardrailAction;
  threatCategory?: ThreatCategory;
  riskScore: number;
  reason?: string;
  sanitizedContent?: string;
  matchedRules: string[];
  executionTimeMs: number;
}

export interface GuardrailPolicy {
  id: string;
  name: string;
  enabledThreats: ThreatCategory[];
  riskThreshold: number;
  blockAction: GuardrailAction;
  customKeywordBlacklist: string[];
  customRegexPatterns: string[];
}
`
);

writeFile(
  path.join(__dirname, '../packages/security-guardrails/src/prompt-injection.detector.ts'),
  `/**
 * ============================================================================
 * COGNIVANTA MULTI-LAYER PROMPT INJECTION & JAILBREAK DETECTOR
 * ============================================================================
 */

import { GuardrailCheckResult } from './interfaces';

export class PromptInjectionDetector {
  private injectionPatterns: Array<{ name: string; pattern: RegExp; severity: number }> = [
    { name: 'System Override Instruction', pattern: /ignore\\s+(all\\s+)?(previous|prior)\\s+(instructions|prompts|rules)/i, severity: 0.95 },
    { name: 'Role Reassignment', pattern: /you\\s+are\\s+now\\s+(in\\s+)?(developer\\s+mode|dan|unfiltered|jailbroken)/i, severity: 0.92 },
    { name: 'System Prompt Extraction', pattern: /(repeat|print|show|output|reveal)\\s+(your\\s+)?(initial|system|base|hidden)\\s+(instructions|prompt|rules)/i, severity: 0.88 },
    { name: 'Delimiter Breaking Attack', pattern: /---+\\s*(system|admin|root|override)\\s*---+/i, severity: 0.90 },
    { name: 'Base64 Encoded Injection', pattern: /(?:eval|execute|run)\\s*\\(\\s*(?:atob|base64_decode)/i, severity: 0.85 },
    { name: 'Markdown Tag Hijacking', pattern: /<\\|\\s*(im_start|im_end|system|user|assistant)\\s*\\|>/i, severity: 0.98 }
  ];

  public inspect(text: string): GuardrailCheckResult {
    const startTime = Date.now();
    const matchedRules: string[] = [];
    let maxRisk = 0;

    for (const { name, pattern, severity } of this.injectionPatterns) {
      if (pattern.test(text)) {
        matchedRules.push(name);
        if (severity > maxRisk) maxRisk = severity;
      }
    }

    const passed = maxRisk < 0.80;
    const action = passed ? 'allow' : 'block';

    return {
      passed,
      action,
      threatCategory: matchedRules.length > 0 ? 'prompt_injection' : undefined,
      riskScore: maxRisk,
      reason: passed ? 'No adversarial prompt injection patterns detected.' : 'Adversarial prompt injection detected: ' + matchedRules.join(', '),
      matchedRules,
      executionTimeMs: Date.now() - startTime
    };
  }
}

export const promptInjectionDetector = new PromptInjectionDetector();
`
);

writeFile(
  path.join(__dirname, '../packages/security-guardrails/src/data-loss-prevention.ts'),
  `/**
 * ============================================================================
 * COGNIVANTA DATA LOSS PREVENTION (DLP) & PII MASKING ENGINE
 * ============================================================================
 */

import { GuardrailCheckResult } from './interfaces';

export class DataLossPreventionEngine {
  private creditCardRegex = /\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})\\b/g;
  private ssnRegex = /\\b\\d{3}-\\d{2}-\\d{4}\\b/g;
  private apiKeyRegex = /\\b(?:sk-[a-zA-Z0-9]{32,}|ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z-_]{35})\\b/g;

  public sanitize(text: string): GuardrailCheckResult {
    const startTime = Date.now();
    let sanitized = text;
    const matchedRules: string[] = [];

    if (this.creditCardRegex.test(sanitized)) {
      sanitized = sanitized.replace(this.creditCardRegex, '[REDACTED_CREDIT_CARD]');
      matchedRules.push('Credit Card Number Detected');
    }

    if (this.ssnRegex.test(sanitized)) {
      sanitized = sanitized.replace(this.ssnRegex, '[REDACTED_SSN]');
      matchedRules.push('Social Security Number Detected');
    }

    if (this.apiKeyRegex.test(sanitized)) {
      sanitized = sanitized.replace(this.apiKeyRegex, '[REDACTED_API_KEY]');
      matchedRules.push('API Secret Token Detected');
    }

    const hasDLPThreat = matchedRules.length > 0;

    return {
      passed: true,
      action: hasDLPThreat ? 'mask' : 'allow',
      threatCategory: hasDLPThreat ? 'pii_leak' : undefined,
      riskScore: hasDLPThreat ? 0.85 : 0.0,
      reason: hasDLPThreat ? 'Sensitive enterprise tokens masked: ' + matchedRules.join(', ') : 'No DLP violations found.',
      sanitizedContent: sanitized,
      matchedRules,
      executionTimeMs: Date.now() - startTime
    };
  }
}

export const dlpEngine = new DataLossPreventionEngine();
`
);

writeFile(
  path.join(__dirname, '../packages/security-guardrails/src/index.ts'),
  `/**
 * ============================================================================
 * COGNIVANTA SECURITY GUARDRAILS MODULE EXPORTS
 * ============================================================================
 */

export * from './interfaces';
export * from './prompt-injection.detector';
export * from './data-loss-prevention';
`
);

// ----------------------------------------------------------------------------
// 2. EVENT STREAMING & QUEUES PACKAGE (packages/event-streaming)
// ----------------------------------------------------------------------------

writeFile(
  path.join(__dirname, '../packages/event-streaming/package.json'),
  JSON.stringify({
    name: '@cognivanta/event-streaming',
    version: '1.0.0',
    description: 'Cognivanta Priority Job Queues, Dead Letter Queues, and PubSub Event Broker',
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    scripts: {
      build: 'tsc',
      test: 'node --test'
    },
    dependencies: {
      '@cognivanta/core': '*'
    },
    devDependencies: {
      typescript: '^5.4.5'
    }
  }, null, 2)
);

writeFile(
  path.join(__dirname, '../packages/event-streaming/tsconfig.json'),
  JSON.stringify({
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src'
    },
    include: ['src/**/*']
  }, null, 2)
);

writeFile(
  path.join(__dirname, '../packages/event-streaming/src/queue.ts'),
  `/**
 * ============================================================================
 * COGNIVANTA PRIORITY ASYNC JOB QUEUE & DEAD LETTER QUEUE (DLQ)
 * ============================================================================
 */

import { generateUUID } from '@cognivanta/core';

export type JobPriority = 'critical' | 'high' | 'normal' | 'low';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'dead_letter';

export interface QueueJob<T = unknown> {
  id: string;
  queueName: string;
  priority: JobPriority;
  data: T;
  status: JobStatus;
  retryCount: number;
  maxRetries: number;
  error?: string;
  result?: unknown;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export class PriorityJobQueue {
  private jobs = new Map<string, QueueJob>();

  public async enqueue<T>(queueName: string, data: T, priority: JobPriority = 'normal', maxRetries: number = 3): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: generateUUID(),
      queueName,
      priority,
      data,
      status: 'queued',
      retryCount: 0,
      maxRetries,
      createdAt: new Date().toISOString()
    };

    this.jobs.set(job.id, job as QueueJob);
    return job;
  }

  public getJob(id: string): QueueJob | undefined {
    return this.jobs.get(id);
  }

  public listJobs(queueName?: string): QueueJob[] {
    const all = Array.from(this.jobs.values());
    return queueName ? all.filter(j => j.queueName === queueName) : all;
  }

  public getStats(): { totalQueued: number; processing: number; completed: number; failed: number; dlq: number } {
    let totalQueued = 0, processing = 0, completed = 0, failed = 0, dlq = 0;
    for (const j of this.jobs.values()) {
      if (j.status === 'queued') totalQueued++;
      else if (j.status === 'processing') processing++;
      else if (j.status === 'completed') completed++;
      else if (j.status === 'failed') failed++;
      else if (j.status === 'dead_letter') dlq++;
    }
    return { totalQueued, processing, completed, failed, dlq };
  }
}

export const priorityJobQueue = new PriorityJobQueue();
`
);

writeFile(
  path.join(__dirname, '../packages/event-streaming/src/index.ts'),
  `/**
 * ============================================================================
 * COGNIVANTA EVENT STREAMING MODULE EXPORTS
 * ============================================================================
 */

export * from './queue';
`
);

// ----------------------------------------------------------------------------
// 3. GRAPHRAG KNOWLEDGE GRAPH ENGINE (packages/rag-engine/src/graphrag)
// ----------------------------------------------------------------------------

writeFile(
  path.join(__dirname, '../packages/rag-engine/src/graphrag/knowledge-graph.ts'),
  `/**
 * ============================================================================
 * COGNIVANTA GRAPHRAG: IN-MEMORY KNOWLEDGE PROPERTY GRAPH
 * ============================================================================
 */

import { generateUUID } from '@cognivanta/core';

export interface GraphNode {
  id: string;
  name: string;
  type: 'concept' | 'organization' | 'person' | 'location' | 'product' | 'event';
  description: string;
  degree: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  weight: number;
}

export class KnowledgeGraphEngine {
  private nodes = new Map<string, GraphNode>();
  private edges = new Map<string, GraphEdge>();

  public addNode(node: Omit<GraphNode, 'degree'>): GraphNode {
    const existing = this.nodes.get(node.id);
    if (existing) return existing;

    const fullNode: GraphNode = { ...node, degree: 0 };
    this.nodes.set(node.id, fullNode);
    return fullNode;
  }

  public addEdge(edge: Omit<GraphEdge, 'id'>): GraphEdge {
    const id = edge.source + '->' + edge.relation + '->' + edge.target;
    const fullEdge: GraphEdge = { ...edge, id };
    this.edges.set(id, fullEdge);

    const sourceNode = this.nodes.get(edge.source);
    const targetNode = this.nodes.get(edge.target);
    if (sourceNode) sourceNode.degree++;
    if (targetNode) targetNode.degree++;

    return fullEdge;
  }

  public querySubGraph(queryEntity: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const matchedNodeIds = new Set<string>();
    const matchedEdges: GraphEdge[] = [];

    for (const node of this.nodes.values()) {
      if (node.name.toLowerCase().includes(queryEntity.toLowerCase()) || node.id.toLowerCase().includes(queryEntity.toLowerCase())) {
        matchedNodeIds.add(node.id);
      }
    }

    for (const edge of this.edges.values()) {
      if (matchedNodeIds.has(edge.source) || matchedNodeIds.has(edge.target)) {
        matchedEdges.push(edge);
        matchedNodeIds.add(edge.source);
        matchedNodeIds.add(edge.target);
      }
    }

    const resultNodes = Array.from(matchedNodeIds).map(id => this.nodes.get(id)!).filter(Boolean);
    return { nodes: resultNodes, edges: matchedEdges };
  }

  public getStats(): { nodeCount: number; edgeCount: number } {
    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size
    };
  }
}

export const knowledgeGraphEngine = new KnowledgeGraphEngine();
`
);

console.log('[+] Advanced enterprise subsystems written successfully.');
