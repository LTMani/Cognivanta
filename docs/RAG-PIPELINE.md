# Hybrid Retrieval, Dense HNSW Indexing & BM25 Scoring Guide

## Overview
Cognivanta is an enterprise-grade AI intelligence platform designed for autonomous agents, hybrid RAG retrieval, visual DAG workflows, multi-provider model routing, and immutable audit logging.

## Core Capabilities
- **Modular Monorepo**: Separated into `apps/web`, `apps/server`, and 10 standalone core packages.
- **Hybrid Retrieval Engine**: Blends dense vector search with sparse Okapi BM25 ranking via Reciprocal Rank Fusion (RRF).
- **Autonomous Agent Runtime**: Implements ReAct planning loops with short-term, episodic, and semantic memory.
- **Cryptographic Audit Chaining**: Computes SHA-256 block hashes on all mutations for tamper-evident compliance.
- **Zero Real Credentials**: 100% offline runnable out-of-the-box using the built-in Mock Provider.

## Verification
All modules are tested, type-checked, and committed with standard conventional commit milestones.
