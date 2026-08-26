/**
 * ============================================================================
 * COGNIVANTA GRAPHRAG: IN-MEMORY KNOWLEDGE PROPERTY GRAPH
 * ============================================================================
 */

import { generateUUID } from '@cognivanta/core';

export interface GraphNode {
  id: string;
  name: string;
  type: 'concept' | 'organization' | 'person' | 'location' | 'product' | 'event';
  description: string;
  degree: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  weight: number;
}

export class KnowledgeGraphEngine {
  private nodes = new Map<string, GraphNode>();
  private edges = new Map<string, GraphEdge>();

  public addNode(node: Omit<GraphNode, 'degree'>): GraphNode {
    const existing = this.nodes.get(node.id);
    if (existing) return existing;

    const fullNode: GraphNode = { ...node, degree: 0 };
    this.nodes.set(node.id, fullNode);
    return fullNode;
  }

  public addEdge(edge: Omit<GraphEdge, 'id'>): GraphEdge {
    const id = edge.source + '->' + edge.relation + '->' + edge.target;
    const fullEdge: GraphEdge = { ...edge, id };
    this.edges.set(id, fullEdge);

    const sourceNode = this.nodes.get(edge.source);
    const targetNode = this.nodes.get(edge.target);
    if (sourceNode) sourceNode.degree++;
    if (targetNode) targetNode.degree++;

    return fullEdge;
  }

  public querySubGraph(queryEntity: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const matchedNodeIds = new Set<string>();
    const matchedEdges: GraphEdge[] = [];

    for (const node of this.nodes.values()) {
      if (node.name.toLowerCase().includes(queryEntity.toLowerCase()) || node.id.toLowerCase().includes(queryEntity.toLowerCase())) {
        matchedNodeIds.add(node.id);
      }
    }

    for (const edge of this.edges.values()) {
      if (matchedNodeIds.has(edge.source) || matchedNodeIds.has(edge.target)) {
        matchedEdges.push(edge);
        matchedNodeIds.add(edge.source);
        matchedNodeIds.add(edge.target);
      }
    }

    const resultNodes = Array.from(matchedNodeIds).map(id => this.nodes.get(id)!).filter(Boolean);
    return { nodes: resultNodes, edges: matchedEdges };
  }

  public getStats(): { nodeCount: number; edgeCount: number } {
    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size
    };
  }
}

export const knowledgeGraphEngine = new KnowledgeGraphEngine();
