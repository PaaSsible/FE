import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { deleteUserPortfolio } from '@/apis/user.api'

interface UseDeleteUserPortfolioOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

interface UseDeleteUserPortfolioResult {
  deletePortfolio: (portfolioId?: number | null) => Promise<boolean>
  isDeleting: boolean
}

export function useDeleteUserPortfolio(
  options?: UseDeleteUserPortfolioOptions,
): UseDeleteUserPortfolioResult {
  const [isDeleting, setIsDeleting] = useState(false)
  const onSuccess = options?.onSuccess
  const onError = options?.onError

  const deletePortfolio = useCallback(
    async (portfolioId?: number | null): Promise<boolean> => {
      if (portfolioId === null || portfolioId === undefined || Number.isNaN(portfolioId)) {
        toast.error('유효하지 않은 포트폴리오입니다.')
        return false
      }

      if (isDeleting) {
        return false
      }

      setIsDeleting(true)

      try {
        const response = await deleteUserPortfolio({ portfolioId })

        if (!response.success) {
          throw new Error(response.message ?? '포트폴리오 삭제에 실패했습니다.')
        }

        toast.success('포트폴리오가 삭제되었습니다.')

        if (onSuccess) {
          await onSuccess()
        }

        return true
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error : new Error('포트폴리오 삭제에 실패했습니다.')
        toast.error(normalizedError.message)

        if (onError) {
          await onError(normalizedError)
        }

        return false
      } finally {
        setIsDeleting(false)
      }
    },
    [isDeleting, onError, onSuccess],
  )

  return {
    deletePortfolio,
    isDeleting,
  }
}

export default useDeleteUserPortfolio
