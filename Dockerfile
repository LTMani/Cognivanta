# =============================================================================
# COGNIVANTA MULTI-STAGE DOCKERFILE
# =============================================================================

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS dependencies
COPY package.json tsconfig.base.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/db/package.json ./packages/db/
COPY packages/model-gateway/package.json ./packages/model-gateway/
COPY packages/rag-engine/package.json ./packages/rag-engine/
COPY packages/vector-store/package.json ./packages/vector-store/
COPY packages/agent-engine/package.json ./packages/agent-engine/
COPY packages/workflow-engine/package.json ./packages/workflow-engine/
COPY packages/analytics-metering/package.json ./packages/analytics-metering/
COPY packages/eval-engine/package.json ./packages/eval-engine/
COPY packages/audit-compliance/package.json ./packages/audit-compliance/
COPY packages/sdk/package.json ./packages/sdk/
COPY packages/cli/package.json ./packages/cli/
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
RUN npm install

FROM dependencies AS builder
COPY . .
RUN npm run build || true

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app ./
EXPOSE 3000 5173

CMD ["node", "apps/server/src/server.ts"]
