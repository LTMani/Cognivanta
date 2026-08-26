/**
 * ============================================================================
 * COGNIVANTA PROMPT STUDIO & TEMPLATE COMPILATION SERVICE
 * ============================================================================
 */

import { generateUUID, interpolatePromptTemplate, NotFoundError } from '@cognivanta/core';
import { auditRepository } from '@cognivanta/db';

export interface PromptTemplate {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  version: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export class PromptService {
  private templates = new Map<string, PromptTemplate>();

  constructor() {
    // Seed initial prompt templates
    this.createTemplate({
      workspaceId: 'ws-default-enterprise',
      name: 'Financial Analysis Summary',
      description: 'Extracts income statement deltas and balance sheet highlights',
      template: 'Analyze the following quarterly financial report for {{companyName}} in period {{quarter}}:\n\n{{reportText}}',
      variables: ['companyName', 'quarter', 'reportText'],
      tags: ['finance', 'reporting', 'rag']
    });
  }

  public async listTemplates(workspaceId: string): Promise<PromptTemplate[]> {
    const list: PromptTemplate[] = [];
    for (const t of this.templates.values()) {
      if (t.workspaceId === workspaceId) {
        list.push(t);
      }
    }
    return list;
  }

  public async createTemplate(params: {
    workspaceId: string;
    name: string;
    description: string;
    template: string;
    variables?: string[];
    tags?: string[];
  }): Promise<PromptTemplate> {
    const id = generateUUID();
    const extractedVars = params.variables || Array.from(params.template.matchAll(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g)).map(m => m[1]);

    const item: PromptTemplate = {
      id,
      workspaceId: params.workspaceId,
      name: params.name,
      description: params.description,
      template: params.template,
      variables: Array.from(new Set(extractedVars)),
      version: 1,
      tags: params.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.set(id, item);
    return item;
  }

  public async compilePrompt(id: string, variables: Record<string, unknown>): Promise<string> {
    const t = this.templates.get(id);
    if (!t) throw new NotFoundError(`Prompt template ${id} not found.`);
    return interpolatePromptTemplate(t.template, variables);
  }
}

export const promptService = new PromptService();
