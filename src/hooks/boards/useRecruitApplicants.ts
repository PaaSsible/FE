import { useCallback, useEffect, useState } from 'react'

import { getRecruitApplicants } from '@/apis/recruit.api'
import type { GetRecruitApplicants } from '@/types/apis/recruit/recruit.api.types'

type UseRecruitApplicantsResult = {
  applicants: GetRecruitApplicants['Response']['data']
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export default function useRecruitApplicants(postId?: number | null): UseRecruitApplicantsResult {
  const [applicants, setApplicants] = useState<GetRecruitApplicants['Response']['data']>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    if (postId === undefined || postId === null || Number.isNaN(postId)) {
      setApplicants([])
      setIsLoading(false)
      setError(postId === undefined || postId === null ? null : '유효하지 않은 모집글 ID입니다.')
      return
    }

    let cancelled = false

    const fetchApplicants = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getRecruitApplicants({ postId })

        if (!response.success) {
          throw new Error(response.message ?? '지원자 정보를 불러오지 못했습니다.')
        }

        if (cancelled) {
          return
        }

        setApplicants(response.data)
      } catch (fetchError) {
        console.error('Failed to load recruit applicants', fetchError)

        if (cancelled) {
          return
        }

        setApplicants([])
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : '지원자 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchApplicants()

    return () => {
      cancelled = true
    }
  }, [postId, refreshToken])

  const refetch = useCallback(() => {
    setRefreshToken((prev) => prev + 1)
  }, [])

  return {
    applicants,
    isLoading,
    error,
    refetch,
  }
}
