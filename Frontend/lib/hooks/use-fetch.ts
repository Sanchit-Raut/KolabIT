"use client"

import { useState, useEffect, useCallback } from "react"

interface UseFetchOptions {
  immediate?: boolean
  cache?: boolean
}

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions = { immediate: true, cache: true },
): FetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fetchFn()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      }))
    }
  }, [fetchFn])

  useEffect(() => {
    if (options.immediate) {
      refetch()
    }
  }, [])

  return { ...state, refetch }
}
