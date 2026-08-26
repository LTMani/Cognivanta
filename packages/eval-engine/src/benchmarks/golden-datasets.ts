/**
 * ============================================================================
 * COGNIVANTA GOLDEN EVALUATION BENCHMARK DATASETS
 * ============================================================================
 */

import { EvalDataset } from '@cognivanta/core';

export const GOLDEN_BENCHMARK_DATASETS: EvalDataset[] = [
  {
    id: 'ds-finance-q1',
    workspaceId: 'ws-default-enterprise',
    name: 'Finance Q1 Financial Report Benchmark',
    description: 'Gold-standard Q&A pairs for validating financial extraction and metrics precision.',
    sampleCount: 3,
    samples: [
      {
        id: 's-1',
        question: 'What was the percentage increase in total revenue in Q1?',
        expectedAnswer: 'Total revenue increased by 18.6% compared to Q4.',
        referenceContext: ['Total revenue reached $42.8M, representing an 18.6% increase year-over-year.']
      },
      {
        id: 's-2',
        question: 'What was the reported operating cash flow in Q1?',
        expectedAnswer: 'Operating cash flow was $3.6M (or $16.5M operational cash from core contracts).',
        referenceContext: ['Cash flow from operations is strong at $3.6M.']
      },
      {
        id: 's-3',
        question: 'How did net profit grow in Q1?',
        expectedAnswer: 'Net profit stood at $4.2M, growing by 22.1%.',
        referenceContext: ['Net Profit stood at $4.2M, representing a growth of 22.1%.']
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
