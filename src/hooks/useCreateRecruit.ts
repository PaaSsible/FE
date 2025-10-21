import { format, startOfDay } from 'date-fns'
import { useCallback, useState } from 'react'

import { postRecruit } from '@/apis/recruit.api'
import type { PostRecruit as PostRecruitTypes } from '@/types/apis/recruit/recruit.api.types'

type RecruitmentDraft = {
  position: number | null
  stacks: number[]
}

type CreateRecruitInput = {
  mainCategory: string
  subCategory: string
  title: string
  content: string
  deadline: Date
  projectDuration: string
  recruitment: RecruitmentDraft[]
}

type CreateRecruitResult = PostRecruitTypes['Response']

export default function useCreateRecruit() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createRecruit = useCallback(
    async ({
      mainCategory,
      subCategory,
      title,
      content,
      deadline,
      projectDuration,
      recruitment,
    }: CreateRecruitInput): Promise<CreateRecruitResult> => {
      setIsSubmitting(true)
      try {
        const normalizedRecruitment = recruitment
          .filter((member) => member.position !== null)
          .map((member) => ({
            position: member.position as number,
            stacks: Array.isArray(member.stacks)
              ? member.stacks.filter((stackId): stackId is number => typeof stackId === 'number')
              : [],
          }))

        const deadlineString = format(startOfDay(deadline), 'yyyy-MM-dd')

        const payload: PostRecruitTypes['Body'] = {
          mainCategory: mainCategory as PostRecruitTypes['Body']['mainCategory'],
          subCategory: subCategory as PostRecruitTypes['Body']['subCategory'],
          title: title.trim(),
          content,
          deadline: deadlineString,
          projectDuration: projectDuration as PostRecruitTypes['Body']['projectDuration'],
          recruits: normalizedRecruitment,
        }

        const response = await postRecruit(payload)

        if (!response.success) {
          throw new Error(response.message ?? '모집글 등록에 실패했습니다.')
        }

        return response
      } catch (error) {
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  return {
    createRecruit,
    isSubmitting,
  }
}
