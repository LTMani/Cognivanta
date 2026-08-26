/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: BILLINGSUBSCRIPTIONPLANREPOSITORY
 * ============================================================================
 * Entity: BillingSubscriptionPlan
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { BillingSubscriptionPlan, BillingSubscriptionPlanAttributes } from '@cognivanta/core';

export class BillingSubscriptionPlanRepository {
  private entities = new Map<string, BillingSubscriptionPlan>();

  public async findById(id: string): Promise<BillingSubscriptionPlan | null> {
    const item = this.entities.get(id);
    return item ? new BillingSubscriptionPlan(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<BillingSubscriptionPlanAttributes>): Promise<BillingSubscriptionPlan[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new BillingSubscriptionPlan(item.toJSON()));
  }

  public async create(entity: BillingSubscriptionPlan | BillingSubscriptionPlanAttributes): Promise<BillingSubscriptionPlan> {
    const instance = entity instanceof BillingSubscriptionPlan ? entity : new BillingSubscriptionPlan(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<BillingSubscriptionPlanAttributes>): Promise<BillingSubscriptionPlan | null> {
    const existing = this.entities.get(id);
    if (!existing) return null;

    Object.assign(existing, updates);
    existing.touch();
    this.entities.set(id, existing);
    return existing;
  }

  public async delete(id: string): Promise<boolean> {
    return this.entities.delete(id);
  }

  public async count(): Promise<number> {
    return this.entities.size;
  }

  public async clear(): Promise<void> {
    this.entities.clear();
  }
}

export const billingSubscriptionPlanRepository = new BillingSubscriptionPlanRepository();
