import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { putRecruitComment } from '@/apis/recruit.api'
import type { PutRecruitComment } from '@/types/apis/recruit/recruit.api.types'

type UpdateParams = {
  commentId: number
  content: string
  parentId?: number | null
}

type UseUpdateRecruitCommentOptions = {
  onSuccess?: () => void | Promise<void>
}

type UseUpdateRecruitCommentResult = {
  updateComment: (params: UpdateParams) => Promise<boolean>
  isUpdating: boolean
}

export default function useUpdateRecruitComment(
  options?: UseUpdateRecruitCommentOptions,
): UseUpdateRecruitCommentResult {
  const [isUpdating, setIsUpdating] = useState(false)
  const onSuccess = options?.onSuccess

  const updateComment = useCallback(
    async ({ commentId, content, parentId }: UpdateParams): Promise<boolean> => {
      const trimmed = content.trim()
      if (trimmed.length === 0) {
        return false
      }

      setIsUpdating(true)

      try {
        const body: PutRecruitComment['Body'] = {
          content: trimmed,
        }

        await putRecruitComment({ commentId }, body)

        window.scrollTo({ top: 0, behavior: 'smooth' })

        const toastLabel =
          parentId !== undefined && parentId !== null
            ? '답글이 수정되었습니다.'
            : '댓글이 수정되었습니다.'
        toast.success(toastLabel)

        if (onSuccess) {
          await onSuccess()
        }

        return true
      } catch (error) {
        console.error('Failed to update recruit comment', error)
        toast.error('댓글 수정에 실패했습니다.')
        return false
      } finally {
        setIsUpdating(false)
      }
    },
    [onSuccess],
  )

  return {
    updateComment,
    isUpdating,
  }
}
