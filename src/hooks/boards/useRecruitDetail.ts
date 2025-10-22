import { useCallback, useEffect, useState } from 'react'

import { getRecruitDetail } from '@/apis/recruit.api'
import type { GetRecruitDetail } from '@/types/apis/recruit/recruit.api.types'

type UseRecruitDetailResult = {
  data: GetRecruitDetail['Response']['data'] | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export default function useRecruitDetail(postId?: number | null): UseRecruitDetailResult {
  const [data, setData] = useState<GetRecruitDetail['Response']['data'] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    if (postId === undefined || postId === null || Number.isNaN(postId)) {
      setData(null)
      setIsLoading(false)
      setError(postId === undefined || postId === null ? null : '유효하지 않은 모집글 ID입니다.')
      return
    }

    let cancelled = false

    const fetchRecruitDetail = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getRecruitDetail({ postId })

        if (!response.success) {
          throw new Error(response.message ?? '모집글 상세 응답이 올바르지 않습니다.')
        }

        if (cancelled) {
          return
        }

        setData(response.data)
      } catch (fetchError) {
        console.error('Failed to load recruit detail', fetchError)

        if (cancelled) {
          return
        }

        setData(null)
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : '모집글 상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchRecruitDetail()

    return () => {
      cancelled = true
    }
  }, [postId, refreshToken])

  const refetch = useCallback(() => {
    setRefreshToken((prev) => prev + 1)
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch,
  }
}
