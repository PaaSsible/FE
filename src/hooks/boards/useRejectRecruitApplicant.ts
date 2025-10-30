import { useCallback, useState } from 'react'

import { postRecruitApplicantReject } from '@/apis/recruit.api'

type UseRejectRecruitApplicantOptions = {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

type UseRejectRecruitApplicantResult = {
  rejectApplicant: (
    postId?: number | null,
    applicationId?: number | null,
    rejectReason?: string | null,
  ) => Promise<boolean>
  isRejecting: boolean
}

export default function useRejectRecruitApplicant(
  options?: UseRejectRecruitApplicantOptions,
): UseRejectRecruitApplicantResult {
  const [isRejecting, setIsRejecting] = useState(false)

  const rejectApplicant = useCallback(
    async (postId?: number | null, applicationId?: number | null, rejectReason?: string | null) => {
      if (
        postId === undefined ||
        postId === null ||
        Number.isNaN(postId) ||
        applicationId === undefined ||
        applicationId === null ||
        Number.isNaN(applicationId) ||
        typeof rejectReason !== 'string' ||
        rejectReason.trim().length === 0
      ) {
        options?.onError?.(new Error('지원자를 거절하기 위한 정보가 부족합니다.'))
        return false
      }

      if (isRejecting) {
        return false
      }

      setIsRejecting(true)

      try {
        const response = await postRecruitApplicantReject(
          { postId, applicationId },
          { rejectReason: rejectReason.trim() },
        )

        if (!response.success) {
          throw new Error(response.message ?? '지원자 거절에 실패했습니다.')
        }

        if (options?.onSuccess) {
          await options.onSuccess()
        }

        return true
      } catch (err) {
        console.error('Failed to reject recruit applicant', err)
        options?.onError?.(
          err instanceof Error
            ? err
            : new Error('지원자 거절에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
        )
        return false
      } finally {
        setIsRejecting(false)
      }
    },
    [isRejecting, options],
  )

  return {
    rejectApplicant,
    isRejecting,
  }
}
