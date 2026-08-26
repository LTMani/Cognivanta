/**
 * ============================================================================
 * COGNIVANTA REPOSITORY: DOCUMENTMETADATARECORDREPOSITORY
 * ============================================================================
 * Entity: DocumentMetadataRecord
 * Description: Data access methods, queries, filtering, pagination, and persistence.
 */

import { DocumentMetadataRecord, DocumentMetadataRecordAttributes } from '@cognivanta/core';

export class DocumentMetadataRecordRepository {
  private entities = new Map<string, DocumentMetadataRecord>();

  public async findById(id: string): Promise<DocumentMetadataRecord | null> {
    const item = this.entities.get(id);
    return item ? new DocumentMetadataRecord(item.toJSON()) : null;
  }

  public async findAll(filter?: Partial<DocumentMetadataRecordAttributes>): Promise<DocumentMetadataRecord[]> {
    let list = Array.from(this.entities.values());

    if (filter) {
      list = list.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }

    return list.map(item => new DocumentMetadataRecord(item.toJSON()));
  }

  public async create(entity: DocumentMetadataRecord | DocumentMetadataRecordAttributes): Promise<DocumentMetadataRecord> {
    const instance = entity instanceof DocumentMetadataRecord ? entity : new DocumentMetadataRecord(entity);
    this.entities.set(instance.id, instance);
    return instance;
  }

  public async update(id: string, updates: Partial<DocumentMetadataRecordAttributes>): Promise<DocumentMetadataRecord | null> {
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

export const documentMetadataRecordRepository = new DocumentMetadataRecordRepository();
