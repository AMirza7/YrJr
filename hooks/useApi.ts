import { useState, useEffect, useCallback, useRef } from "react";
import { Logger } from "@/utils/production";

// Generic API hook types
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

export interface ApiMutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export interface PaginatedApiState<T> extends ApiState<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  } | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

// Generic API hook
export function useApi<T>(
  apiFunction: () => Promise<{ data: T; success: boolean; message?: string }>,
  options: {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    dependencies?: any[];
  } = {},
): ApiState<T> {
  const { immediate = true, onSuccess, onError, dependencies = [] } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction();

      if (!isMountedRef.current) return;

      if (response.success) {
        setData(response.data);
        onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || "An error occurred";
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;

      const errorMessage = err.message || "Network error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
      Logger.error("API Hook Error:", err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, dependencies);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset,
  };
}

// API mutation hook
export function useApiMutation<TData, TVariables = void>(
  apiFunction: (
    variables: TVariables,
  ) => Promise<{ data: TData; success: boolean; message?: string }>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: string, variables: TVariables) => void;
  } = {},
): ApiMutationState<TData> {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(variables);

        if (response.success) {
          setData(response.data);
          onSuccess?.(response.data, variables);
          return response.data;
        } else {
          const errorMessage = response.message || "An error occurred";
          setError(errorMessage);
          onError?.(errorMessage, variables);
          throw new Error(errorMessage);
        }
      } catch (err: any) {
        const errorMessage = err.message || "Network error occurred";
        setError(errorMessage);
        onError?.(errorMessage, variables);
        Logger.error("API Mutation Error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

// Paginated API hook
export function usePaginatedApi<T>(
  apiFunction: (
    page: number,
    limit: number,
  ) => Promise<{
    data: T[];
    success: boolean;
    message?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>,
  options: {
    limit?: number;
    immediate?: boolean;
    onSuccess?: (data: T[], pagination: any) => void;
    onError?: (error: string) => void;
  } = {},
): PaginatedApiState<T> {
  const { limit = 20, immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] =
    useState<PaginatedApiState<T>["pagination"]>(null);

  const currentPageRef = useRef(1);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(page, limit);

        if (!isMountedRef.current) return;

        if (response.success) {
          const newData = append ? [...data, ...response.data] : response.data;
          setData(newData);

          if (response.pagination) {
            setPagination({
              ...response.pagination,
              hasMore: page < response.pagination.totalPages,
            });
          }

          currentPageRef.current = page;
          onSuccess?.(response.data, response.pagination);
        } else {
          const errorMessage = response.message || "An error occurred";
          setError(errorMessage);
          onError?.(errorMessage);
        }
      } catch (err: any) {
        if (!isMountedRef.current) return;

        const errorMessage = err.message || "Network error occurred";
        setError(errorMessage);
        onError?.(errorMessage);
        Logger.error("Paginated API Hook Error:", err);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [apiFunction, data, limit, onSuccess, onError],
  );

  const loadMore = useCallback(async () => {
    if (pagination && pagination.hasMore && !loading) {
      await fetchData(currentPageRef.current + 1, true);
    }
  }, [fetchData, pagination, loading]);

  const refresh = useCallback(async () => {
    currentPageRef.current = 1;
    setData([]);
    await fetchData(1, false);
  }, [fetchData]);

  const reset = useCallback(() => {
    setData([]);
    setError(null);
    setLoading(false);
    setPagination(null);
    currentPageRef.current = 1;
  }, []);

  const refetch = useCallback(async () => {
    await fetchData(currentPageRef.current, false);
  }, [fetchData]);

  useEffect(() => {
    if (immediate) {
      fetchData(1, false);
    }
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    loadMore,
    refresh,
    refetch,
    reset,
  };
}

// Optimistic update hook
export function useOptimisticMutation<TData, TVariables = void>(
  apiFunction: (
    variables: TVariables,
  ) => Promise<{ data: TData; success: boolean; message?: string }>,
  options: {
    onMutate?: (variables: TVariables) => TData | void;
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (
      error: string,
      variables: TVariables,
      rollbackData?: TData,
    ) => void;
    onSettled?: (
      data: TData | null,
      error: string | null,
      variables: TVariables,
    ) => void;
  } = {},
): ApiMutationState<TData> & { rollback: () => void } {
  const { onMutate, onSuccess, onError, onSettled } = options;

  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previousDataRef = useRef<TData | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      try {
        setLoading(true);
        setError(null);

        // Store previous data for rollback
        previousDataRef.current = data;

        // Apply optimistic update
        const optimisticData = onMutate?.(variables);
        if (optimisticData) {
          setData(optimisticData);
        }

        const response = await apiFunction(variables);

        if (response.success) {
          setData(response.data);
          onSuccess?.(response.data, variables);
          onSettled?.(response.data, null, variables);
          return response.data;
        } else {
          const errorMessage = response.message || "An error occurred";
          setError(errorMessage);
          // Rollback optimistic update
          setData(previousDataRef.current);
          onError?.(
            errorMessage,
            variables,
            previousDataRef.current || undefined,
          );
          onSettled?.(null, errorMessage, variables);
          throw new Error(errorMessage);
        }
      } catch (err: any) {
        const errorMessage = err.message || "Network error occurred";
        setError(errorMessage);
        // Rollback optimistic update
        setData(previousDataRef.current);
        onError?.(
          errorMessage,
          variables,
          previousDataRef.current || undefined,
        );
        onSettled?.(null, errorMessage, variables);
        Logger.error("Optimistic Mutation Error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, data, onMutate, onSuccess, onError, onSettled],
  );

  const rollback = useCallback(() => {
    setData(previousDataRef.current);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    previousDataRef.current = null;
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    rollback,
    reset,
  };
}

// Debounced API hook
export function useDebouncedApi<T>(
  apiFunction: (
    query: string,
  ) => Promise<{ data: T; success: boolean; message?: string }>,
  query: string,
  options: {
    delay?: number;
    minLength?: number;
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {},
): ApiState<T> {
  const {
    delay = 500,
    minLength = 1,
    immediate = false,
    onSuccess,
    onError,
  } = options;

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  // Debounce the query
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, delay]);

  const fetchData = useCallback(async () => {
    if (debouncedQuery.length < minLength) {
      setData(null);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction(debouncedQuery);

      if (!isMountedRef.current) return;

      if (response.success) {
        setData(response.data);
        onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || "An error occurred";
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;

      const errorMessage = err.message || "Network error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
      Logger.error("Debounced API Hook Error:", err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, debouncedQuery, minLength, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate || debouncedQuery.length >= minLength) {
      fetchData();
    }
  }, [debouncedQuery, fetchData, immediate, minLength]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset,
  };
}

// Infinite scroll hook
export function useInfiniteApi<T>(
  apiFunction: (
    page: number,
    limit: number,
  ) => Promise<{
    data: T[];
    success: boolean;
    message?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>,
  options: {
    limit?: number;
    threshold?: number;
    onSuccess?: (data: T[]) => void;
    onError?: (error: string) => void;
  } = {},
): PaginatedApiState<T> & { isLoadingMore: boolean } {
  const paginatedState = usePaginatedApi(apiFunction, options);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreWithLoading = useCallback(async () => {
    if (paginatedState.pagination?.hasMore && !paginatedState.loading) {
      setIsLoadingMore(true);
      await paginatedState.loadMore();
      setIsLoadingMore(false);
    }
  }, [
    paginatedState.loadMore,
    paginatedState.pagination?.hasMore,
    paginatedState.loading,
  ]);

  return {
    ...paginatedState,
    isLoadingMore,
    loadMore: loadMoreWithLoading,
  };
}

export default {
  useApi,
  useApiMutation,
  usePaginatedApi,
  useOptimisticMutation,
  useDebouncedApi,
  useInfiniteApi,
};
