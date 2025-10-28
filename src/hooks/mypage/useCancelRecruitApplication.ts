import { useCallback, useState } from 'react'

import { deleteRecruitApplication } from '@/apis/recruit.api'

type UseCancelRecruitApplicationOptions = {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

type UseCancelRecruitApplicationResult = {
  cancelApplication: (applicationId?: number | null) => Promise<boolean>
  isCancelling: boolean
}

export default function useCancelRecruitApplication(
  options?: UseCancelRecruitApplicationOptions,
): UseCancelRecruitApplicationResult {
  const [isCancelling, setIsCancelling] = useState(false)

  const cancelApplication = useCallback(
    async (applicationId?: number | null): Promise<boolean> => {
      if (applicationId === undefined || applicationId === null || Number.isNaN(applicationId)) {
        options?.onError?.(new Error('유효하지 않은 지원 내역입니다.'))
        return false
      }

      if (isCancelling) {
        return false
      }

      setIsCancelling(true)

      try {
        const response = await deleteRecruitApplication({ applicationId })
        if (!response.success) {
          throw new Error(response.message ?? '지원 취소에 실패했습니다.')
        }

        if (options?.onSuccess) {
          await options.onSuccess()
        }

        return true
      } catch (err) {
        console.error('Failed to cancel recruit application', err)
        options?.onError?.(
          err instanceof Error
            ? err
            : new Error('지원 취소에 실패했습니다. 잠시 후 다시 시도해주세요.'),
        )
        return false
      } finally {
        setIsCancelling(false)
      }
    },
    [isCancelling, options],
  )

  return {
    cancelApplication,
    isCancelling,
  }
}
