/**
 * ============================================================================
 * COGNIVANTA USER REPOSITORY
 * ============================================================================
 */

import { User } from '@cognivanta/core';
import { dbMemory } from '../db.client';

export class UserRepository {
  public async findById(id: string): Promise<User | null> {
    const user = dbMemory.users.get(id);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public async findByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    for (const user of dbMemory.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  public async findByOrganization(orgId: string): Promise<User[]> {
    const result: User[] = [];
    for (const user of dbMemory.users.values()) {
      if (user.organizationId === orgId) {
        const { passwordHash: _, ...safeUser } = user;
        result.push(safeUser);
      }
    }
    return result;
  }

  public async create(user: User & { passwordHash: string }): Promise<User> {
    dbMemory.users.set(user.id, user);
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public async update(id: string, updates: Partial<User>): Promise<User | null> {
    const existing = dbMemory.users.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    dbMemory.users.set(id, updated);
    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }

  public async delete(id: string): Promise<boolean> {
    return dbMemory.users.delete(id);
  }

  public async listAll(): Promise<User[]> {
    const list: User[] = [];
    for (const user of dbMemory.users.values()) {
      const { passwordHash: _, ...safeUser } = user;
      list.push(safeUser);
    }
    return list;
  }
}

export const userRepository = new UserRepository();
