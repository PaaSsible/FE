import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getUserPortfolios } from '@/apis/user.api'

interface UseUserPortfoliosParams {
  userId?: number | null
  page?: number
  size?: number
  enabled?: boolean
}

interface UseUserPortfoliosResult {
  data: {
    portfolios: Awaited<ReturnType<typeof getUserPortfolios>>['data']['portfolios']
    pagination: {
      currentPage: number
      totalPages: number
      totalElements: number
      hasNext: boolean
      hasPrevious: boolean
    }
  } | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useUserPortfolios({
  userId,
  page = 0,
  size = 12,
  enabled = true,
}: UseUserPortfoliosParams): UseUserPortfoliosResult {
  const [data, setData] = useState<UseUserPortfoliosResult['data']>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const shouldFetch = enabled && typeof userId === 'number'
  const abortControllerRef = useRef<AbortController | null>(null)
  const paramsRef = useRef({ page, size, userId })

  const fetchData = useCallback(async () => {
    if (!shouldFetch) {
      setData(null)
      setIsLoading(false)
      setIsError(false)
      setError(null)
      return
    }

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const response = await getUserPortfolios({
        userId,
        page,
        size,
      })

      if (!response.success) {
        throw new Error(response.message ?? '포트폴리오를 불러오지 못했습니다.')
      }

      const normalized = {
        portfolios: response.data.portfolios,
        pagination: {
          currentPage: response.data.currentPage + 1,
          totalPages: response.data.totalPages || 1,
          totalElements: response.data.totalElements,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious,
        },
      }

      if (!controller.signal.aborted) {
        setData(normalized)
      }
    } catch (err) {
      if ((err as Error).name === 'CanceledError' || (err as Error).name === 'AbortError') {
        return
      }

      setIsError(true)
      setError(err instanceof Error ? err : new Error('포트폴리오를 불러오지 못했습니다.'))
      setData(null)
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [shouldFetch, userId, page, size])

  useEffect(() => {
    paramsRef.current = { page, size, userId }

    if (!shouldFetch) {
      setData(null)
      setIsLoading(false)
      setIsError(false)
      setError(null)
      return
    }

    void fetchData()

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [fetchData, page, shouldFetch, size, userId])

  const refetch = useCallback(() => {
    if (shouldFetch) {
      void fetchData()
    }
  }, [fetchData, shouldFetch])

  return useMemo(
    () => ({
      data,
      isLoading,
      isError,
      error,
      refetch,
    }),
    [data, isLoading, isError, error, refetch],
  )
}

export default useUserPortfolios
