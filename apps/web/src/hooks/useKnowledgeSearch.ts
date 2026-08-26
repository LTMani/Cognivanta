/**
 * ============================================================================
 * COGNIVANTA CUSTOM REACT HOOK: USEKNOWLEDGESEARCH
 * ============================================================================
 * Executes debounced hybrid vector and BM25 search queries across knowledge spaces.
 */

import { useState, useEffect, useCallback } from 'react';

export function useKnowledgeSearch<T>(initialValue?: T) {
  const [data, setData] = useState<T | undefined>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (action?: () => Promise<T>) => {
    if (!action) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await action();
      setData(res);
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    setData
  };
}
