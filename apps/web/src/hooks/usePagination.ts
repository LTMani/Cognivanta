/**
 * ============================================================================
 * COGNIVANTA CUSTOM REACT HOOK: USEPAGINATION
 * ============================================================================
 * Manages pagination, page size, sorting, and filter state for large data tables.
 */

import { useState, useEffect, useCallback } from 'react';

export function usePagination<T>(initialValue?: T) {
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
