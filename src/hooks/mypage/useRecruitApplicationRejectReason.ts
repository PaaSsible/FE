import { useCallback, useState } from 'react'

import { getRecruitApplicationRejectReason } from '@/apis/recruit.api'

type UseRecruitApplicationRejectReasonOptions = {
  onError?: (error: Error) => void
}

type UseRecruitApplicationRejectReasonResult = {
  fetchRejectReason: (applicationId?: number | null) => Promise<string | null>
  isLoading: boolean
}

export default function useRecruitApplicationRejectReason(
  options?: UseRecruitApplicationRejectReasonOptions,
): UseRecruitApplicationRejectReasonResult {
  const [isLoading, setIsLoading] = useState(false)

  const fetchRejectReason = useCallback(
    async (applicationId?: number | null) => {
      if (applicationId === undefined || applicationId === null || Number.isNaN(applicationId)) {
        const error = new Error('거절 사유를 확인하기 위한 정보가 부족합니다.')
        options?.onError?.(error)
        return null
      }

      if (isLoading) {
        return null
      }

      setIsLoading(true)

      try {
        const response = await getRecruitApplicationRejectReason({ applicationId })

        if (!response.success) {
          throw new Error(response.message ?? '거절 사유를 불러오지 못했습니다.')
        }

        const rejectReason = response.data?.rejectReason ?? ''
        return rejectReason
      } catch (error) {
        console.error('Failed to fetch recruit application reject reason', error)
        const fallbackError =
          error instanceof Error
            ? error
            : new Error('거절 사유를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
        options?.onError?.(fallbackError)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, options],
  )

  return {
    fetchRejectReason,
    isLoading,
  }
}
