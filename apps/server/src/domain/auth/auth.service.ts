/**
 * ============================================================================
 * COGNIVANTA AUTHENTICATION & IDENTITY SERVICE
 * ============================================================================
 */

import {
  User,
  Organization,
  generateUUID,
  sha256,
  AuthenticationError,
  ConflictError,
  NotFoundError
} from '@cognivanta/core';
import { userRepository, organizationRepository, workspaceRepository, auditRepository } from '@cognivanta/db';

export class AuthService {
  public async register(params: {
    email: string;
    password: string;
    name: string;
    orgName?: string;
  }): Promise<{ user: User; organization: Organization; token: string }> {
    const existing = await userRepository.findByEmail(params.email);
    if (existing) {
      throw new ConflictError(`User with email "${params.email}" already exists.`);
    }

    const orgId = generateUUID();
    const userId = generateUUID();
    const workspaceId = generateUUID();

    const organization: Organization = {
      id: orgId,
      name: params.orgName || `${params.name}'s Organization`,
      slug: (params.orgName || `${params.name}-org`).toLowerCase().replace(/[^a-z0-9]/g, '-'),
      plan: 'starter',
      ownerId: userId,
      settings: {
        enforceSSO: false,
        allowedDomains: [params.email.split('@')[1]],
        maxWorkspaces: 5,
        maxUsers: 25,
        allowedProviders: ['mock', 'openai', 'anthropic', 'gemini', 'ollama'],
        monthlyTokenQuota: 10000000,
        monthlyBudgetCapUSD: 500,
        enablePIIMasking: true,
        retentionDays: 30
      },
      billing: {
        currentPeriodTokensUsed: 0,
        currentPeriodCostUSD: 0,
        tierLimitUSD: 500,
        billingCycleAnchor: new Date().toISOString(),
        paymentMethodStatus: 'active'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await organizationRepository.create(organization);

    // Create default workspace
    await workspaceRepository.create({
      id: workspaceId,
      organizationId: orgId,
      name: 'Default Workspace',
      description: 'Default project workspace for AI chat, models, and knowledge assets.',
      slug: 'default',
      memberIds: [userId],
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const user: User & { passwordHash: string } = {
      id: userId,
      email: params.email.toLowerCase(),
      name: params.name,
      passwordHash: sha256(params.password),
      role: 'org_owner',
      organizationId: orgId,
      workspaceIds: [workspaceId],
      preferences: {
        theme: 'dark',
        defaultModel: 'gpt-4o',
        defaultTemperature: 0.7,
        notificationSettings: {
          emailAlerts: true,
          inAppAlerts: true,
          workflowFailures: true,
          agentMilestones: true,
          securityEvents: true
        },
        editorFontSize: 14,
        enableTelemetry: true
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    const createdUser = await userRepository.create(user);

    await auditRepository.log({
      id: generateUUID(),
      organizationId: orgId,
      actorId: userId,
      actorEmail: user.email,
      action: 'user.created',
      resourceType: 'user',
      resourceId: userId,
      payload: { name: user.name, role: user.role }
    });

    return {
      user: createdUser,
      organization,
      token: `cgv_live_${generateUUID().replace(/-/g, '')}`
    };
  }

  public async login(email: string, password?: string): Promise<{ user: User; organization: Organization; token: string }> {
    const userWithPass = await userRepository.findByEmail(email);
    if (!userWithPass) {
      // In dev, auto-provision if not found
      return this.register({ email, password: password || 'Password123!', name: email.split('@')[0] });
    }

    if (password && userWithPass.passwordHash !== sha256(password)) {
      throw new AuthenticationError('Invalid password credentials provided.');
    }

    const org = await organizationRepository.findById(userWithPass.organizationId);
    if (!org) {
      throw new NotFoundError('User organization not found.');
    }

    const { passwordHash: _, ...safeUser } = userWithPass;

    await auditRepository.log({
      id: generateUUID(),
      organizationId: org.id,
      actorId: safeUser.id,
      actorEmail: safeUser.email,
      action: 'user.login',
      resourceType: 'session',
      resourceId: safeUser.id,
      payload: { client: 'web' }
    });

    return {
      user: safeUser,
      organization: org,
      token: `cgv_live_${generateUUID().replace(/-/g, '')}`
    };
  }
}

export const authService = new AuthService();
