/**
 * ============================================================================
 * COGNIVANTA WORKFLOW DAG GRAPH SOLVER & TOPOLOGICAL SORTER
 * ============================================================================
 */

import { WorkflowDefinition, WorkflowNode, WorkflowEdge, WorkflowDAGError } from '@cognivanta/core';

export class DAGSolver {
  public static validateAndSort(workflow: WorkflowDefinition): WorkflowNode[] {
    const nodeMap = new Map<string, WorkflowNode>();
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    for (const node of workflow.nodes) {
      nodeMap.set(node.id, node);
      inDegree.set(node.id, 0);
      adjacency.set(node.id, []);
    }

    for (const edge of workflow.edges) {
      if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) {
        throw new WorkflowDAGError(`Edge references unknown node: ${edge.source} -> ${edge.target}`);
      }

      adjacency.get(edge.source)!.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }

    // Kahn's Algorithm for Topological Sort
    const queue: string[] = [];
    for (const [nodeId, deg] of inDegree.entries()) {
      if (deg === 0) {
        queue.push(nodeId);
      }
    }

    const sortedNodes: WorkflowNode[] = [];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      sortedNodes.push(nodeMap.get(currentId)!);

      for (const neighborId of adjacency.get(currentId) || []) {
        inDegree.set(neighborId, inDegree.get(neighborId)! - 1);
        if (inDegree.get(neighborId) === 0) {
          queue.push(neighborId);
        }
      }
    }

    if (sortedNodes.length !== workflow.nodes.length) {
      throw new WorkflowDAGError('Cycle detected in workflow graph definition.');
    }

    return sortedNodes;
  }
}
