import { useCallback, useState } from 'react'

import { postRecruitApplicantAccept } from '@/apis/recruit.api'

type UseAcceptRecruitApplicantOptions = {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

type UseAcceptRecruitApplicantResult = {
  acceptApplicant: (
    postId?: number | null,
    applicationId?: number | null,
    boardId?: number | null,
  ) => Promise<boolean>
  isAccepting: boolean
}

export default function useAcceptRecruitApplicant(
  options?: UseAcceptRecruitApplicantOptions,
): UseAcceptRecruitApplicantResult {
  const [isAccepting, setIsAccepting] = useState(false)

  const acceptApplicant = useCallback(
    async (postId?: number | null, applicationId?: number | null, boardId?: number | null) => {
      if (
        postId === undefined ||
        postId === null ||
        Number.isNaN(postId) ||
        applicationId === undefined ||
        applicationId === null ||
        Number.isNaN(applicationId) ||
        boardId === undefined ||
        boardId === null ||
        Number.isNaN(boardId)
      ) {
        options?.onError?.(new Error('지원자를 수락하기 위한 정보가 부족합니다.'))
        return false
      }

      if (isAccepting) {
        return false
      }

      setIsAccepting(true)

      try {
        const response = await postRecruitApplicantAccept({ postId, applicationId }, { boardId })

        if (!response.success) {
          throw new Error(response.message ?? '지원자 수락에 실패했습니다.')
        }

        if (options?.onSuccess) {
          await options.onSuccess()
        }

        return true
      } catch (err) {
        console.error('Failed to accept recruit applicant', err)
        options?.onError?.(
          err instanceof Error
            ? err
            : new Error('지원자 수락에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
        )
        return false
      } finally {
        setIsAccepting(false)
      }
    },
    [isAccepting, options],
  )

  return {
    acceptApplicant,
    isAccepting,
  }
}
