/**
 * ============================================================================
 * COGNIVANTA EVALUATION BENCHMARK: ENTERPRISE SAAS MSA & SLA BENCHMARK
 * ============================================================================
 * Domain: Legal
 */

import { EvalDataset } from '@cognivanta/core';

export const SAAS_SLA_CONTRACTS_BENCHMARK: EvalDataset = {
  id: 'ds-saas-sla-contracts',
  workspaceId: 'ws-default-enterprise',
  name: 'Enterprise SaaS MSA & SLA Benchmark',
  description: 'Rigorous enterprise evaluation benchmark for validating RAG retrieval precision in Legal.',
  sampleCount: 5,
  samples: [
    {
      id: 'sample-01',
      question: 'What is the maximum allowed downtime in the SLA policy?',
      expectedAnswer: '99.9% uptime SLA allows a maximum of 43.8 minutes of downtime per month.',
      referenceContext: ['Under our standard 99.9% SLA, unplanned downtime cannot exceed 43.8 minutes per calendar month.']
    },
    {
      id: 'sample-02',
      question: 'How are data breach notifications dispatched to customers?',
      expectedAnswer: 'Breach notifications are sent within 72 hours via cryptographic email to registered compliance officers.',
      referenceContext: ['In accordance with GDPR Art. 33, any detected data breach must be notified within 72 hours.']
    },
    {
      id: 'sample-03',
      question: 'What encryption standard is applied to vector embeddings at rest?',
      expectedAnswer: 'All vector embeddings and document chunks are encrypted at rest using AES-256.',
      referenceContext: ['Storage volumes and vector indexes utilize AES-256 encryption at rest with customer-managed keys.']
    },
    {
      id: 'sample-04',
      question: 'What are the required clearance levels for restricted financial records?',
      expectedAnswer: 'Level 3 or higher clearance is strictly mandatory for financial ledger access.',
      referenceContext: ['Access to unrestricted spaces requires Level 1; financial ledgers require Level 3 security clearance.']
    },
    {
      id: 'sample-05',
      question: 'How does the model gateway handle provider outages?',
      expectedAnswer: 'Automatic failover routes queries to the configured secondary provider within 500ms.',
      referenceContext: ['When circuit breakers trip on primary model APIs, failover routers redirect traffic to fallback providers.']
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
