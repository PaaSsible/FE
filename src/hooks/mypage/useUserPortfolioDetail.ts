import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getUserPortfolioDetail } from '@/apis/user.api'

type PortfolioDetailData = Awaited<ReturnType<typeof getUserPortfolioDetail>>['data']

interface UseUserPortfolioDetailParams {
  portfolioId?: number | null
  enabled?: boolean
}

interface UseUserPortfolioDetailResult {
  data: PortfolioDetailData | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useUserPortfolioDetail({
  portfolioId,
  enabled = true,
}: UseUserPortfolioDetailParams = {}): UseUserPortfolioDetailResult {
  const [data, setData] = useState<PortfolioDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const numericId = typeof portfolioId === 'number' ? portfolioId : null
  const shouldFetch = enabled && numericId !== null && Number.isInteger(numericId)

  const fetchData = useCallback(async () => {
    if (!shouldFetch || numericId === null) {
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
      const response = await getUserPortfolioDetail({
        portfolioId: numericId,
      })

      if (!response.success) {
        throw new Error(response.message ?? '포트폴리오를 불러오지 못했습니다.')
      }

      if (!controller.signal.aborted) {
        setData(response.data)
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
  }, [numericId, shouldFetch])

  useEffect(() => {
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
  }, [fetchData, shouldFetch])

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

export default useUserPortfolioDetail
