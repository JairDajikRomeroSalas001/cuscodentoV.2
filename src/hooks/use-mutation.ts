'use client';

import { useState, useCallback } from 'react';

interface UseMutationOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

type HttpMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export function useMutation<TData = unknown, TPayload = unknown>(
  endpoint: string,
  method: HttpMethod = 'POST',
  options: UseMutationOptions = {}
) {
  const { onSuccess, onError } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = useCallback(
    async (payload?: TPayload): Promise<TData | null> => {
      try {
        setLoading(true);
        setError(null);
        setData(null);

        const response = await fetch(endpoint, {
          method,
          credentials: 'include', // Enviar cookies HttpOnly
          headers: {
            'Content-Type': 'application/json',
          },
          body: payload ? JSON.stringify(payload) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || `API error: ${response.status}`;
          throw new Error(errorMessage);
        }

        const json = await response.json();
        const result = (json.data || json) as TData;

        setData(result);
        setError(null);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        setData(null);

        if (onError) {
          onError(message);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, data, reset };
}
