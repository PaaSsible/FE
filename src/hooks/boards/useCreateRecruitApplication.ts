import { useCallback, useState } from 'react'

import { postRecruitApplication } from '@/apis/recruit.api'
import type { PostRecruitApplication as PostRecruitApplicationType } from '@/types/apis/recruit/recruit.api.types'

type UseCreateRecruitApplicationOptions = {
  onSuccess?: (response: PostRecruitApplicationType['Response']) => void | Promise<void>
}

type UseCreateRecruitApplicationResult = {
  applyRecruit: (postId?: number | null) => Promise<PostRecruitApplicationType['Response'] | null>
  isApplying: boolean
}

export default function useCreateRecruitApplication(
  options?: UseCreateRecruitApplicationOptions,
): UseCreateRecruitApplicationResult {
  const [isApplying, setIsApplying] = useState(false)
  const onSuccess = options?.onSuccess

  const applyRecruit = useCallback(
    async (postId?: number | null): Promise<PostRecruitApplicationType['Response'] | null> => {
      if (postId === undefined || postId === null || Number.isNaN(postId)) {
        return null
      }

      if (isApplying) {
        return null
      }

      setIsApplying(true)

      try {
        const response = await postRecruitApplication({ postId })

        if (!response.success) {
          throw new Error(response.message ?? '모집글 지원에 실패했습니다.')
        }

        if (onSuccess) {
          await onSuccess(response)
        }

        return response
      } catch (error) {
        throw error
      } finally {
        setIsApplying(false)
      }
    },
    [isApplying, onSuccess],
  )

  return {
    applyRecruit,
    isApplying,
  }
}
