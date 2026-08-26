/**
 * ============================================================================
 * COGNIVANTA ENTERPRISE API SERVER ENTRYPOINT
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/error.middleware';
import { authRouter } from './api/auth.controller';
import { orgRouter } from './api/org.controller';
import { workspaceRouter } from './api/workspace.controller';
import { chatRouter } from './api/chat.controller';
import { modelRouter } from './api/model.controller';
import { promptRouter } from './api/prompt.controller';
import { knowledgeRouter } from './api/knowledge.controller';
import { ragRouter } from './api/rag.controller';
import { docIntelRouter } from './api/doc-intel.controller';
import { agentRouter } from './api/agent.controller';
import { workflowRouter } from './api/workflow.controller';
import { analyticsRouter } from './api/analytics.controller';
import { evalRouter } from './api/eval.controller';
import { auditRouter } from './api/audit.controller';
import { healthRouter } from './api/health.controller';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
const api = express.Router();
api.use('/auth', authRouter);
api.use('/orgs', orgRouter);
api.use('/workspaces', workspaceRouter);
api.use('/chat', chatRouter);
api.use('/models', modelRouter);
api.use('/prompts', promptRouter);
api.use('/knowledge', knowledgeRouter);
api.use('/rag', ragRouter);
api.use('/doc-intel', docIntelRouter);
api.use('/agents', agentRouter);
api.use('/workflows', workflowRouter);
api.use('/analytics', analyticsRouter);
api.use('/eval', evalRouter);
api.use('/audit', auditRouter);
api.use('/health', healthRouter);

app.use(config.apiPrefix, api);

// Global Error Handler
app.use(errorHandler);

export function startServer() {
  const server = app.listen(config.port, () => {
    console.log(`[Cognivanta Server] Running on http://localhost:${config.port}${config.apiPrefix}`);
  });
  return server;
}

if (require.main === module) {
  startServer();
}

export { app };
