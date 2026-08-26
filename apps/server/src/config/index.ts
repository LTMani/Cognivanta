/**
 * ============================================================================
 * COGNIVANTA SERVER CONFIGURATION MANAGER
 * ============================================================================
 */

export interface ServerConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  apiPrefix: string;
  corsOrigin: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  encryptionKey: string;
  defaultLLMProvider: string;
  defaultModel: string;
  enableAuditLogChaining: boolean;
  enablePIIMasking: boolean;
}

export const config: ServerConfig = {
  env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'demo-dev-jwt-secret-do-not-use-in-production-min-32-chars-long',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  encryptionKey: process.env.ENCRYPTION_KEY || 'demo-dev-encryption-key-32-bytes-placeholder!',
  defaultLLMProvider: process.env.DEFAULT_LLM_PROVIDER || 'mock',
  defaultModel: process.env.DEFAULT_LLM_MODEL || 'gpt-4o',
  enableAuditLogChaining: process.env.ENABLE_AUDIT_LOG_CHAINING !== 'false',
  enablePIIMasking: process.env.ENABLE_PII_MASKING !== 'false'
};
