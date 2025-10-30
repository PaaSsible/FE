import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { postBoardPortfolio } from '@/apis/board.api'
import type { PostBoardPortfolio as PostBoardPortfolioTypes } from '@/types/apis/board/board.api.types'

interface UseCreateBoardPortfolioOptions {
  onSuccess?: (response: PostBoardPortfolioTypes['Response']) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

interface UseCreateBoardPortfolioResult {
  createBoardPortfolio: (
    input: PostBoardPortfolioTypes['Path'],
  ) => Promise<PostBoardPortfolioTypes['Response']>
  isSubmitting: boolean
}

export function useCreateBoardPortfolio(
  options?: UseCreateBoardPortfolioOptions,
): UseCreateBoardPortfolioResult {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const onSuccess = options?.onSuccess
  const onError = options?.onError

  const createBoardPortfolio = useCallback(
    async ({
      boardId,
    }: PostBoardPortfolioTypes['Path']): Promise<PostBoardPortfolioTypes['Response']> => {
      if (boardId === null || boardId === undefined || Number.isNaN(boardId)) {
        const error = new Error('유효하지 않은 프로젝트입니다.')
        toast.error(error.message)

        if (onError) {
          await onError(error)
        }

        throw error
      }

      if (isSubmitting) {
        const error = new Error('포트폴리오 생성이 이미 진행 중입니다.')
        toast.error(error.message)
        return Promise.reject(error)
      }

      setIsSubmitting(true)

      try {
        const response = await postBoardPortfolio({ boardId })

        if (!response.success) {
          throw new Error(response.message ?? '포트폴리오 생성에 실패했습니다.')
        }

        toast.success('포트폴리오 생성이 시작되었습니다.')

        if (onSuccess) {
          await onSuccess(response)
        }

        return response
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error : new Error('포트폴리오 생성에 실패했습니다.')

        toast.error(normalizedError.message)

        if (onError) {
          await onError(normalizedError)
        }

        throw normalizedError
      } finally {
        setIsSubmitting(false)
      }
    },
    [isSubmitting, onError, onSuccess],
  )

  return {
    createBoardPortfolio,
    isSubmitting,
  }
}

export default useCreateBoardPortfolio
