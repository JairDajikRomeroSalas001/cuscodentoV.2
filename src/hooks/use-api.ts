'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions {
  autoFetch?: boolean;
}

export function useApi<T = unknown>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const { autoFetch = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include', // Enviar cookies HttpOnly
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `API error: ${response.status}`
        );
      }

      const json = await response.json();
      setData(json.data || json);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [endpoint, autoFetch, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
