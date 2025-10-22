import { useQuery } from '@tanstack/react-query'

import { getMyRecruit } from '@/apis/recruit.api'

export function useFetchMyRecruits(page: number, size: number) {
  return useQuery({
    queryKey: ['myRecruits', page, size],
    queryFn: async () => {
      const res = await getMyRecruit({ page, size })
      if (!res.success) throw new Error(res.message ?? '모집글을 불러오지 못했습니다.')
      return res.data
    },
  })
}
