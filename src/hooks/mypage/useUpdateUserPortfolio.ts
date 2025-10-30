import { useCallback, useState } from 'react'

import { putUserPortfolio } from '@/apis/user.api'
import type { PutUserPortfolio as PutUserPortfolioTypes } from '@/types/apis/user/user.api.types'

type UpdateUserPortfolioInput = {
  portfolioId?: number | null
} & PutUserPortfolioTypes['Body']

interface UseUpdateUserPortfolioOptions {
  onSuccess?: (response: PutUserPortfolioTypes['Response']) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

interface UseUpdateUserPortfolioResult {
  updatePortfolio: (input: UpdateUserPortfolioInput) => Promise<PutUserPortfolioTypes['Response']>
  isSubmitting: boolean
}

export function useUpdateUserPortfolio(
  options?: UseUpdateUserPortfolioOptions,
): UseUpdateUserPortfolioResult {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const onSuccess = options?.onSuccess
  const onError = options?.onError

  const updatePortfolio = useCallback(
    async ({
      portfolioId,
      positionId,
      title,
      summary,
      description,
      image,
    }: UpdateUserPortfolioInput): Promise<PutUserPortfolioTypes['Response']> => {
      if (portfolioId === null || portfolioId === undefined || Number.isNaN(portfolioId)) {
        throw new Error('유효하지 않은 포트폴리오입니다.')
      }

      setIsSubmitting(true)

      try {
        const payload: PutUserPortfolioTypes['Body'] = {
          positionId,
          title: title.trim(),
          summary: summary?.trim() || null,
          description,
          image: image ?? null,
        }

        const response = await putUserPortfolio({ portfolioId }, payload)

        if (!response.success) {
          throw new Error(response.message ?? '포트폴리오 수정에 실패했습니다.')
        }

        if (onSuccess) {
          await onSuccess(response)
        }

        return response
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error : new Error('포트폴리오 수정에 실패했습니다.')

        if (onError) {
          await onError(normalizedError)
        }

        throw normalizedError
      } finally {
        setIsSubmitting(false)
      }
    },
    [onError, onSuccess],
  )

  return {
    updatePortfolio,
    isSubmitting,
  }
}

export default useUpdateUserPortfolio
