import { useCallback, useEffect, useMemo, useState } from 'react'

import { getMyRecruitApplications } from '@/apis/recruit.api'
import type { GetMyRecruitApplications } from '@/types/apis/recruit/recruit.api.types'

export type MyRecruitApplication = GetMyRecruitApplications['Response']['data'][number]

interface UseMyRecruitApplicationsResult {
  applications: MyRecruitApplication[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export default function useMyRecruitApplications(): UseMyRecruitApplicationsResult {
  const [applications, setApplications] = useState<MyRecruitApplication[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const response = await getMyRecruitApplications()
      if (!response.success) {
        throw new Error(response.message ?? '지원 내역을 불러오지 못했습니다.')
      }

      setApplications(response.data)
    } catch (fetchError) {
      console.error('Failed to load my recruit applications', fetchError)
      setIsError(true)
      setError(
        fetchError instanceof Error
          ? fetchError
          : new Error('지원 내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'),
      )
      setApplications([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchApplications()
  }, [fetchApplications])

  const refetch = useCallback(() => {
    void fetchApplications()
  }, [fetchApplications])

  return useMemo(
    () => ({
      applications,
      isLoading,
      isError,
      error,
      refetch,
    }),
    [applications, isLoading, isError, error, refetch],
  )
}
