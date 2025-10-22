import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { deleteRecruitComment } from '@/apis/recruit.api'

type DeleteParams = {
  commentId: number
  parentId?: number | null
}

type UseDeleteRecruitCommentOptions = {
  onSuccess?: () => void | Promise<void>
}

type UseDeleteRecruitCommentResult = {
  deleteComment: (params: DeleteParams) => Promise<boolean>
  isDeleting: boolean
}

export default function useDeleteRecruitComment(
  options?: UseDeleteRecruitCommentOptions,
): UseDeleteRecruitCommentResult {
  const [isDeleting, setIsDeleting] = useState(false)
  const onSuccess = options?.onSuccess

  const deleteComment = useCallback(
    async ({ commentId, parentId }: DeleteParams): Promise<boolean> => {
      if (isDeleting) {
        return false
      }

      setIsDeleting(true)

      try {
        await deleteRecruitComment({ commentId })

        const toastLabel =
          parentId !== undefined && parentId !== null
            ? '답글이 삭제되었습니다.'
            : '댓글이 삭제되었습니다.'
        toast.success(toastLabel)

        if (onSuccess) {
          await onSuccess()
        }

        return true
      } catch (error) {
        console.error('Failed to delete recruit comment', error)
        toast.error('댓글 삭제에 실패했습니다.')
        return false
      } finally {
        setIsDeleting(false)
      }
    },
    [isDeleting, onSuccess],
  )

  return {
    deleteComment,
    isDeleting,
  }
}
