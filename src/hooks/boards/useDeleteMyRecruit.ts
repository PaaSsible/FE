import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { deleteRecruit } from '@/apis/recruit.api'

export function useDeleteMyRecruit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) => deleteRecruit({ postId }),
    onSuccess: () => {
      toast.success('모집글이 삭제되었습니다.')
      void queryClient.invalidateQueries({ queryKey: ['myRecruits'] }) // ✅ 목록 새로고침
    },
    onError: () => {
      toast.error('삭제에 실패했습니다.')
    },
  })
}
