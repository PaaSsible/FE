import { useCallback, useEffect, useMemo, useState } from 'react'

import { getRecruits } from '@/apis/recruit.api'
import type { GetRecruits, RecruitSort } from '@/types/apis/recruit/recruit.api.types'
import type { ActivityType, DetailType } from '@/types/entities/board/board.entitites.types'

const DEFAULT_PAGE_SIZE = 10

type UseRecruitListParams = {
  page: number
  size?: number
  sort: RecruitSort
  mainCategory?: ActivityType
  subCategory?: DetailType
  positionId?: number | null
  keyword?: string
}

type UseRecruitListResult = {
  posts: GetRecruits['Response']['data']['posts']
  pageInfo: GetRecruits['Response']['data']['pageInfo'] | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const emptyPageInfo: GetRecruits['Response']['data']['pageInfo'] = {
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 0,
  hasNext: false,
}

export default function useRecruitList(params: UseRecruitListParams): UseRecruitListResult {
  const {
    page,
    size = DEFAULT_PAGE_SIZE,
    sort,
    mainCategory,
    subCategory,
    positionId,
    keyword,
  } = params

  const normalizedPage = useMemo(() => Math.max(page, 1), [page])
  const normalizedSize = useMemo(() => Math.max(size, 1), [size])
  const normalizedKeyword = keyword?.trim() ?? ''

  const [posts, setPosts] = useState<GetRecruits['Response']['data']['posts']>([])
  const [pageInfo, setPageInfo] = useState<GetRecruits['Response']['data']['pageInfo'] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  const buildQuery = useCallback((): GetRecruits['Query'] => {
    const query: GetRecruits['Query'] = {
      page: normalizedPage - 1,
      size: normalizedSize,
      sort,
    }

    if (mainCategory) {
      query.mainCategory = mainCategory as GetRecruits['Query']['mainCategory']
    }

    if (subCategory) {
      query.subCategory = subCategory as GetRecruits['Query']['subCategory']
    }

    if (positionId !== undefined && positionId !== null) {
      query.position = positionId
    }

    if (normalizedKeyword.length > 0) {
      query.keyword = normalizedKeyword
    }

    return query
  }, [
    normalizedPage,
    normalizedSize,
    sort,
    mainCategory,
    subCategory,
    positionId,
    normalizedKeyword,
  ])

  useEffect(() => {
    let cancelled = false

    const fetchRecruits = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getRecruits(buildQuery())

        if (!response.success) {
          throw new Error(response.message ?? '모집공고 목록 응답이 올바르지 않습니다.')
        }

        if (cancelled) {
          return
        }

        setPosts(response.data.posts)
        setPageInfo(response.data.pageInfo)
      } catch (fetchError) {
        console.error('Failed to load recruit posts', fetchError)

        if (cancelled) {
          return
        }

        setPosts([])
        setPageInfo(emptyPageInfo)
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : '모집공고 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchRecruits()

    return () => {
      cancelled = true
    }
  }, [buildQuery, refreshToken])

  const refetch = useCallback(() => {
    setRefreshToken((prev) => prev + 1)
  }, [])

  return {
    posts,
    pageInfo,
    isLoading,
    error,
    refetch,
  }
}
