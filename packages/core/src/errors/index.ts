/**
 * ============================================================================
 * COGNIVANTA DOMAIN ERROR HIERARCHY
 * ============================================================================
 * Standardized typed errors with HTTP status codes and machine-readable error codes.
 */

export abstract class CognivantaError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly isOperational: boolean = true;
  public readonly timestamp: string;
  public readonly context?: Record<string, unknown>;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      success: false,
      error: {
        code: this.errorCode,
        name: this.name,
        message: this.message,
        statusCode: this.statusCode,
        timestamp: this.timestamp,
        context: this.context
      }
    };
  }
}

export class ValidationError extends CognivantaError {
  public readonly statusCode = 400;
  public readonly errorCode = 'VALIDATION_FAILED';
}

export class AuthenticationError extends CognivantaError {
  public readonly statusCode = 401;
  public readonly errorCode = 'AUTHENTICATION_REQUIRED';
}

export class AuthorizationError extends CognivantaError {
  public readonly statusCode = 403;
  public readonly errorCode = 'INSUFFICIENT_PERMISSIONS';
}

export class NotFoundError extends CognivantaError {
  public readonly statusCode = 404;
  public readonly errorCode = 'RESOURCE_NOT_FOUND';
}

export class ConflictError extends CognivantaError {
  public readonly statusCode = 409;
  public readonly errorCode = 'RESOURCE_CONFLICT';
}

export class RateLimitError extends CognivantaError {
  public readonly statusCode = 429;
  public readonly errorCode = 'RATE_LIMIT_EXCEEDED';
}

export class QuotaExceededError extends CognivantaError {
  public readonly statusCode = 402;
  public readonly errorCode = 'MONTHLY_QUOTA_EXCEEDED';
}

export class ProviderGatewayError extends CognivantaError {
  public readonly statusCode = 502;
  public readonly errorCode = 'AI_PROVIDER_GATEWAY_FAILURE';
}

export class RAGRetrievalError extends CognivantaError {
  public readonly statusCode = 500;
  public readonly errorCode = 'RAG_RETRIEVAL_FAILED';
}

export class AgentExecutionError extends CognivantaError {
  public readonly statusCode = 500;
  public readonly errorCode = 'AGENT_EXECUTION_FAILED';
}

export class WorkflowDAGError extends CognivantaError {
  public readonly statusCode = 422;
  public readonly errorCode = 'WORKFLOW_DAG_INVALID';
}

export class SecurityComplianceError extends CognivantaError {
  public readonly statusCode = 403;
  public readonly errorCode = 'SECURITY_POLICY_VIOLATION';
}
