import { useCallback, useState } from 'react'

import { putRecruit } from '@/apis/recruit.api'
import type { PutRecruit as PutRecruitTypes } from '@/types/apis/recruit/recruit.api.types'

type UpdateRecruitInput = {
  postId: number
  mainCategory: PutRecruitTypes['Body']['mainCategory']
  subCategory: PutRecruitTypes['Body']['subCategory']
  title: string
  content: string
  deadline: string
  projectDuration: PutRecruitTypes['Body']['projectDuration']
  recruits: Array<{
    position: number
    stacks: number[]
  }>
}

type UpdateRecruitResult = PutRecruitTypes['Response']

type UseUpdateRecruitReturn = {
  updateRecruit: (input: UpdateRecruitInput) => Promise<UpdateRecruitResult>
  isSubmitting: boolean
}

export default function useUpdateRecruit(): UseUpdateRecruitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateRecruit = useCallback(
    async ({
      postId,
      mainCategory,
      subCategory,
      title,
      content,
      deadline,
      projectDuration,
      recruits,
    }: UpdateRecruitInput): Promise<UpdateRecruitResult> => {
      setIsSubmitting(true)
      try {
        const payload = {
          mainCategory,
          subCategory,
          title: title.trim(),
          content,
          deadline,
          projectDuration,
          recruits: recruits.map((item) => ({
            position: item.position,
            stacks: item.stacks.filter((stackId) => Number.isInteger(stackId)),
          })),
        } satisfies PutRecruitTypes['Body']

        const response = await putRecruit({ postId }, payload)

        if (!response.success) {
          throw new Error(response.message ?? '모집글 수정에 실패했습니다.')
        }

        return response
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error
        }
        throw new Error('알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  return {
    updateRecruit,
    isSubmitting,
  }
}
