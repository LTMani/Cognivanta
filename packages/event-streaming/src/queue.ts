/**
 * ============================================================================
 * COGNIVANTA PRIORITY ASYNC JOB QUEUE & DEAD LETTER QUEUE (DLQ)
 * ============================================================================
 */

import { generateUUID } from '@cognivanta/core';

export type JobPriority = 'critical' | 'high' | 'normal' | 'low';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'dead_letter';

export interface QueueJob<T = unknown> {
  id: string;
  queueName: string;
  priority: JobPriority;
  data: T;
  status: JobStatus;
  retryCount: number;
  maxRetries: number;
  error?: string;
  result?: unknown;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export class PriorityJobQueue {
  private jobs = new Map<string, QueueJob>();

  public async enqueue<T>(queueName: string, data: T, priority: JobPriority = 'normal', maxRetries: number = 3): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: generateUUID(),
      queueName,
      priority,
      data,
      status: 'queued',
      retryCount: 0,
      maxRetries,
      createdAt: new Date().toISOString()
    };

    this.jobs.set(job.id, job as QueueJob);
    return job;
  }

  public getJob(id: string): QueueJob | undefined {
    return this.jobs.get(id);
  }

  public listJobs(queueName?: string): QueueJob[] {
    const all = Array.from(this.jobs.values());
    return queueName ? all.filter(j => j.queueName === queueName) : all;
  }

  public getStats(): { totalQueued: number; processing: number; completed: number; failed: number; dlq: number } {
    let totalQueued = 0, processing = 0, completed = 0, failed = 0, dlq = 0;
    for (const j of this.jobs.values()) {
      if (j.status === 'queued') totalQueued++;
      else if (j.status === 'processing') processing++;
      else if (j.status === 'completed') completed++;
      else if (j.status === 'failed') failed++;
      else if (j.status === 'dead_letter') dlq++;
    }
    return { totalQueued, processing, completed, failed, dlq };
  }
}

export const priorityJobQueue = new PriorityJobQueue();
