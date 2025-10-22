import { useCallback, useEffect, useState } from 'react'

import { getRecruitComment } from '@/apis/recruit.api'
import type { GetRecruitComments } from '@/types/apis/recruit/recruit.api.types'

export type RecruitComment = GetRecruitComments['Response']['data']['comments'][number]

type UseFetchRecruitCommentsResult = {
  comments: RecruitComment[]
  totalCount: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const normalizeComment = (comment: RecruitComment): RecruitComment => {
  const normalizedChildren = Array.isArray(comment.children)
    ? comment.children.map((child) => normalizeComment(child))
    : []

  return {
    ...comment,
    children: normalizedChildren,
  }
}

export default function useFetchRecruitComments(
  postId?: number | null,
): UseFetchRecruitCommentsResult {
  const [comments, setComments] = useState<RecruitComment[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    if (postId === undefined || postId === null || Number.isNaN(postId)) {
      setComments([])
      setTotalCount(0)
      setIsLoading(false)
      setError(postId === undefined || postId === null ? null : '유효하지 않은 모집글 ID입니다.')
      return
    }

    let cancelled = false

    const fetchComments = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getRecruitComment({ postId })

        if (!response.success) {
          throw new Error(response.message ?? '댓글 정보를 불러오지 못했습니다.')
        }

        if (cancelled) {
          return
        }

        const rawComments = response.data.comments ?? []
        setComments(rawComments.map((comment) => normalizeComment(comment)))
        setTotalCount(response.data.commentCount ?? rawComments.length)
      } catch (fetchError) {
        console.error('Failed to load recruit comments', fetchError)

        if (cancelled) {
          return
        }

        setComments([])
        setTotalCount(0)
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : '댓글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchComments()

    return () => {
      cancelled = true
    }
  }, [postId, refreshToken])

  const refetch = useCallback(() => {
    setRefreshToken((prev) => prev + 1)
  }, [])

  return {
    comments,
    totalCount,
    isLoading,
    error,
    refetch,
  }
}
