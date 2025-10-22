import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { postRecruitComment } from '@/apis/recruit.api'
import type { PostRecruitComment } from '@/types/apis/recruit/recruit.api.types'

type SubmitParams = {
  content: string
  parentId?: number
}

type UseCreateRecruitCommentOptions = {
  onSuccess?: () => void | Promise<void>
}

type UseCreateRecruitCommentResult = {
  submitComment: (params: SubmitParams) => Promise<boolean>
  isSubmitting: boolean
}

export default function useCreateRecruitComment(
  postId?: number | null,
  options?: UseCreateRecruitCommentOptions,
): UseCreateRecruitCommentResult {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitComment = useCallback(
    async ({ content, parentId }: SubmitParams): Promise<boolean> => {
      const resolvedPostId = postId

      if (resolvedPostId === undefined || resolvedPostId === null || Number.isNaN(resolvedPostId)) {
        toast.error('댓글 등록에 실패했습니다.')
        return false
      }

      const trimmed = content.trim()
      if (trimmed.length === 0) {
        return false
      }

      setIsSubmitting(true)

      try {
        const body: PostRecruitComment['Body'] =
          parentId !== undefined
            ? {
                parentId,
                content: trimmed,
              }
            : {
                content: trimmed,
              }

        await postRecruitComment({ postId: resolvedPostId }, body)

        toast.success(parentId !== undefined ? '답글이 등록되었습니다.' : '댓글이 등록되었습니다.')
        window.scrollTo({ top: 0, behavior: 'smooth' })

        const callback = options?.onSuccess
        if (callback) {
          await callback()
        }

        return true
      } catch (submitError) {
        console.error('Failed to submit comment', submitError)
        toast.error('댓글 등록에 실패했습니다.')
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [options?.onSuccess, postId],
  )

  return {
    submitComment,
    isSubmitting,
  }
}
