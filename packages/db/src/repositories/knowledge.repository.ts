/**
 * ============================================================================
 * COGNIVANTA KNOWLEDGE SPACE & DOCUMENT REPOSITORY
 * ============================================================================
 */

import { KnowledgeSpace, DocumentRecord, DocumentChunk } from '@cognivanta/core';
import { dbMemory } from '../db.client';

export class KnowledgeRepository {
  // Knowledge Spaces
  public async findSpaceById(id: string): Promise<KnowledgeSpace | null> {
    return dbMemory.knowledgeSpaces.get(id) || null;
  }

  public async findSpacesByWorkspace(workspaceId: string): Promise<KnowledgeSpace[]> {
    const list: KnowledgeSpace[] = [];
    for (const ks of dbMemory.knowledgeSpaces.values()) {
      if (ks.workspaceId === workspaceId) {
        list.push(ks);
      }
    }
    return list;
  }

  public async createSpace(space: KnowledgeSpace): Promise<KnowledgeSpace> {
    dbMemory.knowledgeSpaces.set(space.id, space);
    return space;
  }

  public async updateSpace(id: string, updates: Partial<KnowledgeSpace>): Promise<KnowledgeSpace | null> {
    const existing = dbMemory.knowledgeSpaces.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    dbMemory.knowledgeSpaces.set(id, updated);
    return updated;
  }

  public async deleteSpace(id: string): Promise<boolean> {
    // Delete documents in this space
    for (const doc of dbMemory.documents.values()) {
      if (doc.knowledgeSpaceId === id) {
        await this.deleteDocument(doc.id);
      }
    }
    return dbMemory.knowledgeSpaces.delete(id);
  }

  // Documents
  public async findDocumentById(id: string): Promise<DocumentRecord | null> {
    return dbMemory.documents.get(id) || null;
  }

  public async findDocumentsBySpace(spaceId: string): Promise<DocumentRecord[]> {
    const list: DocumentRecord[] = [];
    for (const doc of dbMemory.documents.values()) {
      if (doc.knowledgeSpaceId === spaceId) {
        list.push(doc);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async createDocument(doc: DocumentRecord): Promise<DocumentRecord> {
    dbMemory.documents.set(doc.id, doc);
    const space = dbMemory.knowledgeSpaces.get(doc.knowledgeSpaceId);
    if (space) {
      space.documentCount++;
      space.totalSizeBytes += doc.fileSizeBytes;
      space.updatedAt = new Date().toISOString();
    }
    return doc;
  }

  public async updateDocument(id: string, updates: Partial<DocumentRecord>): Promise<DocumentRecord | null> {
    const existing = dbMemory.documents.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    dbMemory.documents.set(id, updated);
    return updated;
  }

  public async deleteDocument(id: string): Promise<boolean> {
    const doc = dbMemory.documents.get(id);
    if (doc) {
      const space = dbMemory.knowledgeSpaces.get(doc.knowledgeSpaceId);
      if (space) {
        space.documentCount = Math.max(0, space.documentCount - 1);
        space.totalSizeBytes = Math.max(0, space.totalSizeBytes - doc.fileSizeBytes);
        space.chunkCount = Math.max(0, space.chunkCount - doc.chunkCount);
      }
      // Delete chunks
      for (const chunk of dbMemory.documentChunks.values()) {
        if (chunk.documentId === id) {
          dbMemory.documentChunks.delete(chunk.id);
        }
      }
    }
    return dbMemory.documents.delete(id);
  }

  // Chunks
  public async addChunks(chunks: DocumentChunk[]): Promise<void> {
    for (const chunk of chunks) {
      dbMemory.documentChunks.set(chunk.id, chunk);
    }
  }

  public async getChunksByDocument(documentId: string): Promise<DocumentChunk[]> {
    const list: DocumentChunk[] = [];
    for (const chunk of dbMemory.documentChunks.values()) {
      if (chunk.documentId === documentId) {
        list.push(chunk);
      }
    }
    return list.sort((a, b) => a.chunkIndex - b.chunkIndex);
  }

  public async getChunksBySpace(spaceId: string): Promise<DocumentChunk[]> {
    const list: DocumentChunk[] = [];
    for (const chunk of dbMemory.documentChunks.values()) {
      if (chunk.knowledgeSpaceId === spaceId) {
        list.push(chunk);
      }
    }
    return list;
  }
}

export const knowledgeRepository = new KnowledgeRepository();
