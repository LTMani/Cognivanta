/**
 * ============================================================================
 * COGNIVANTA ENTERPRISE CRYPTOGRAPHY & MERKLE TREE SUITE
 * ============================================================================
 */

import { sha256 } from '../utils/crypto';

export class CryptographySuite {
  public static computeMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return sha256('empty_tree');
    if (hashes.length === 1) return hashes[0];

    let currentLevel = [...hashes];
    if (currentLevel.length % 2 !== 0) {
      currentLevel.push(currentLevel[currentLevel.length - 1]);
    }

    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        nextLevel.push(sha256(currentLevel[i] + currentLevel[i + 1]));
      }
      currentLevel = nextLevel;
      if (currentLevel.length > 1 && currentLevel.length % 2 !== 0) {
        currentLevel.push(currentLevel[currentLevel.length - 1]);
      }
    }

    return currentLevel[0];
  }
}
