import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { deleteRecruit } from '@/apis/recruit.api'

type UseDeleteRecruitPostOptions = {
  onSuccess?: () => void | Promise<void>
}

type UseDeleteRecruitPostResult = {
  deletePost: (postId?: number | null) => Promise<boolean>
  isDeleting: boolean
}

export default function useDeleteRecruitPost(
  options?: UseDeleteRecruitPostOptions,
): UseDeleteRecruitPostResult {
  const [isDeleting, setIsDeleting] = useState(false)
  const onSuccess = options?.onSuccess

  const deletePost = useCallback(
    async (postId?: number | null): Promise<boolean> => {
      if (postId === undefined || postId === null || Number.isNaN(postId)) {
        toast.error('유효하지 않은 모집글입니다.')
        return false
      }

      if (isDeleting) {
        return false
      }

      setIsDeleting(true)

      try {
        await deleteRecruit({ postId })
        toast.success('모집글이 삭제되었습니다.')

        if (onSuccess) {
          await onSuccess()
        }

        return true
      } catch (error) {
        console.error('Failed to delete recruit post', error)
        toast.error('모집글 삭제에 실패했습니다.')
        return false
      } finally {
        setIsDeleting(false)
      }
    },
    [isDeleting, onSuccess],
  )

  return {
    deletePost,
    isDeleting,
  }
}
