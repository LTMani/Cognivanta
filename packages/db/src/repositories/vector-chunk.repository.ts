/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: VECTORCHUNKRECORDREPOSITORY
 * ============================================================================
 * Entity: VectorChunkRecord
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { VectorChunkRecord, VectorChunkRecordAttributes } from '@cognivanta/core';

export class VectorChunkRecordRepository {
  private entities = new Map<string, VectorChunkRecord>();

  public async findById(id: string): Promise<VectorChunkRecord | null> {
    const item = this.entities.get(id);
    return item ? new VectorChunkRecord(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<VectorChunkRecordAttributes>): Promise<VectorChunkRecord[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new VectorChunkRecord(item.toJSON()));
  }

  public async create(entity: VectorChunkRecord | VectorChunkRecordAttributes): Promise<VectorChunkRecord> {
    const instance = entity instanceof VectorChunkRecord ? entity : new VectorChunkRecord(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<VectorChunkRecordAttributes>): Promise<VectorChunkRecord | null> {
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

export const vectorChunkRecordRepository = new VectorChunkRecordRepository();
