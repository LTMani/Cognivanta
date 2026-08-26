/**
 * ============================================================================
 * COGNIVANTA KNOWLEDGE BASE & DOCUMENT INGESTION SERVICE
 * ============================================================================
 */

import {
  KnowledgeSpace,
  DocumentRecord,
  DocumentChunk,
  generateUUID,
  NotFoundError,
  DocumentType
} from '@cognivanta/core';
import { knowledgeRepository, auditRepository } from '@cognivanta/db';
import { DocumentParserFactory } from '@cognivanta/rag-engine';
import { recursiveChunker } from '@cognivanta/rag-engine';
import { modelGateway } from '@cognivanta/model-gateway';

export class KnowledgeService {
  public async createSpace(params: {
    workspaceId: string;
    name: string;
    description?: string;
    embeddingModelId?: string;
  }): Promise<KnowledgeSpace> {
    const id = generateUUID();
    const space: KnowledgeSpace = {
      id,
      workspaceId: params.workspaceId,
      name: params.name,
      description: params.description,
      embeddingModelId: params.embeddingModelId || 'text-embedding-3-small',
      vectorIndexName: `idx_${id.replace(/-/g, '_')}`,
      documentCount: 0,
      chunkCount: 0,
      totalSizeBytes: 0,
      accessLevel: 'workspace',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return knowledgeRepository.createSpace(space);
  }

  public async listSpaces(workspaceId: string): Promise<KnowledgeSpace[]> {
    return knowledgeRepository.findSpacesByWorkspace(workspaceId);
  }

  public async ingestDocument(params: {
    knowledgeSpaceId: string;
    workspaceId: string;
    actorId: string;
    actorEmail: string;
    fileName: string;
    content: string | Buffer;
    fileSizeBytes: number;
    fileType?: DocumentType;
  }): Promise<DocumentRecord> {
    const space = await knowledgeRepository.findSpaceById(params.knowledgeSpaceId);
    if (!space) throw new NotFoundError(`Knowledge space ${params.knowledgeSpaceId} not found.`);

    const docId = generateUUID();
    const detectedType = params.fileType || DocumentParserFactory.detectTypeFromFilename(params.fileName);

    const doc: DocumentRecord = {
      id: docId,
      knowledgeSpaceId: params.knowledgeSpaceId,
      workspaceId: params.workspaceId,
      name: params.fileName,
      fileName: params.fileName,
      fileType: detectedType,
      fileSizeBytes: params.fileSizeBytes,
      storageKey: `docs/${params.knowledgeSpaceId}/${docId}/${params.fileName}`,
      status: 'parsing',
      chunkCount: 0,
      tokenCount: 0,
      metadata: {},
      author: params.actorEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await knowledgeRepository.createDocument(doc);

    // 1. Parse document
    const parser = DocumentParserFactory.getParser(detectedType);
    const parsed = await parser.parse(params.content, params.fileName);

    // 2. Chunk document
    const textChunks = recursiveChunker.chunkText(parsed.rawText);
    const totalTokens = textChunks.reduce((acc, c) => acc + c.tokenCount, 0);

    // 3. Generate Embeddings via Model Gateway
    const embedRes = await modelGateway.embed({
      modelId: space.embeddingModelId,
      input: textChunks.map(c => c.content)
    });

    // 4. Save Chunks
    const documentChunks: DocumentChunk[] = textChunks.map((chunk, idx) => ({
      id: generateUUID(),
      documentId: docId,
      knowledgeSpaceId: params.knowledgeSpaceId,
      chunkIndex: idx,
      content: chunk.content,
      tokenLength: chunk.tokenCount,
      embedding: embedRes.embeddings[idx],
      metadata: {
        sourceFile: params.fileName,
        charStart: chunk.charStart,
        charEnd: chunk.charEnd
      }
    }));

    await knowledgeRepository.addChunks(documentChunks);

    // 5. Update Document Status
    const updatedDoc = await knowledgeRepository.updateDocument(docId, {
      status: 'indexed',
      chunkCount: documentChunks.length,
      tokenCount: totalTokens,
      metadata: parsed.metadata
    });

    await auditRepository.log({
      id: generateUUID(),
      organizationId: 'org-cognivanta-inc',
      workspaceId: params.workspaceId,
      actorId: params.actorId,
      actorEmail: params.actorEmail,
      action: 'document.indexed',
      resourceType: 'document',
      resourceId: docId,
      payload: { fileName: params.fileName, chunkCount: documentChunks.length, tokens: totalTokens }
    });

    return updatedDoc || doc;
  }

  public async listDocuments(spaceId: string): Promise<DocumentRecord[]> {
    return knowledgeRepository.findDocumentsBySpace(spaceId);
  }
}

export const knowledgeService = new KnowledgeService();
