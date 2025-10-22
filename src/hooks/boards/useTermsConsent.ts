import { useCallback, useEffect, useState } from 'react'

import { patchUserTerms, postReissue } from '@/apis/user.api'
import { getAuthUser, setAuthSession } from '@/utils/authToken'

type UseTermsConsentResult = {
  isOpen: boolean
  isSubmitting: boolean
  hasAgreed: boolean
  handleAgree: () => Promise<void>
  handleClose: () => void
}

export const useTermsConsent = (): UseTermsConsentResult => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)

  useEffect(() => {
    const user = getAuthUser()

    if (!user) {
      return
    }

    if (user.agreedToTerms) {
      setHasAgreed(true)
      return
    }

    setHasAgreed(false)
    setIsOpen(true)
  }, [])

  const handleAgree = useCallback(async (): Promise<void> => {
    if (isSubmitting || hasAgreed) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await patchUserTerms()

      if (!response.success) {
        throw new Error(response.message ?? '약관 동의 처리에 실패했습니다.')
      }

      const reissue = await postReissue()

      if (!reissue.success) {
        throw new Error(reissue.message ?? '토큰 재발급에 실패했습니다.')
      }

      setAuthSession(reissue.data)
      setHasAgreed(true)
    } catch (error) {
      console.error('Failed to update terms agreement', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [hasAgreed, isSubmitting])

  const handleClose = useCallback((): void => {
    if (!hasAgreed) {
      return
    }

    setIsOpen(false)
  }, [hasAgreed])

  return {
    isOpen,
    isSubmitting,
    hasAgreed,
    handleAgree,
    handleClose,
  }
}

export default useTermsConsent
