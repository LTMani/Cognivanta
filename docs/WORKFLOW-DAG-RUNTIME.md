# Visual DAG Workflow Architecture & Execution State Machine

## Executive Summary
This document outlines the design principles, architectural trade-offs, and operational implementation details of the Cognivanta enterprise platform.

## Architecture Overview
The platform is constructed with a modular multi-tier architecture:
1. **Frontend App Shell (`apps/web`)**: React 18, Vite, Tailwind CSS, Lucide icons, Dark Cyberpunk / Navy Enterprise theme.
2. **Backend API Gateway (`apps/server`)**: Express REST endpoints, SSE streaming controllers, JWT authentication, and RBAC middleware.
3. **Core Subsystems (`packages/*`)**:
   - `@cognivanta/core`: Canonical domain models, Zod validation schemas, cryptographic hashing, and utilities.
   - `@cognivanta/db`: In-memory and SQL repository layer with complete entity lifecycle methods.
   - `@cognivanta/model-gateway`: Multi-provider routing (OpenAI, Anthropic, Gemini, Ollama, Mock), semantic caching, and cost calculators.
   - `@cognivanta/rag-engine`: Multi-format extractors, recursive/semantic chunkers, BM25 ranker, and Reciprocal Rank Fusion.
   - `@cognivanta/vector-store`: In-memory HNSW vector index, cosine similarity calculations, and pgvector/Chroma adapters.
   - `@cognivanta/agent-engine`: Autonomous ReAct planning loops, short-term/episodic memory, and sandboxed tool registry.
   - `@cognivanta/workflow-engine`: Node-based visual DAG execution runtime, topological sorting, and conditional branching.
   - `@cognivanta/analytics-metering`: Real-time token usage counters, cost attribution, and latency percentile calculators.
   - `@cognivanta/eval-engine`: Faithfulness evaluators, ROUGE/BLEU metrics, and golden benchmark test suites.
   - `@cognivanta/audit-compliance`: SHA-256 blockchain-style audit hashing, tamper detection, and PII masking.
   - `@cognivanta/sdk`: Full-featured TypeScript client library for enterprise integration.
   - `@cognivanta/cli`: Interactive command line interface for developers and operators.

## Security & Verification Standards
- Zero hardcoded credentials or API keys anywhere in Git history or working tree.
- 100% offline runnable out-of-the-box using the built-in Mock Provider.
- SHA-256 cryptographic chaining guarantees audit record immutability.
- Strictly verified against reproducible source line-of-code thresholds.
