import { AxiosError } from 'axios'
import { type JSX, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { postLogin } from '@/apis/user.api'
import Button from '@/components/atoms/Button'
import { setAuthSession } from '@/utils/authToken'

export default function AuthCallBackPage(): JSX.Element | null {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const code = searchParams.get('code')
  const googleError = searchParams.get('error')

  useEffect(() => {
    if (googleError) {
      setErrorMessage('구글 로그인 도중 오류가 발생했습니다. 다시 시도해주세요.')
      setIsLoading(false)
      return
    }

    if (!code) {
      setErrorMessage('로그인 인증 코드가 확인되지 않았습니다.')
      setIsLoading(false)
      return
    }

    let cancelled = false

    const handleLogin = async () => {
      try {
        const response = await postLogin({ code })
        if (!response.success) {
          throw new Error(response.message ?? '로그인 응답이 올바르지 않습니다.')
        }

        setAuthSession(response.data)
        void navigate('/boards', { replace: true })
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.status === 404) {
            void navigate('/boards', { replace: true })
          }
        }
        console.error('Failed to complete login', error)
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : '로그인에 실패했습니다. 다시 시도해주세요.',
          )
          setIsLoading(false)
        }
      }
    }

    void handleLogin()

    return () => {
      cancelled = true
    }
  }, [code, googleError, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-b3-bold text-gray-600">로그인을 처리하고 있습니다…</p>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-b4-regular text-gray-700">{errorMessage}</p>
        <Button variant="primary" shape="square" onClick={() => void navigate('/start')}>
          다시 로그인하기
        </Button>
      </div>
    )
  }

  return null
}
