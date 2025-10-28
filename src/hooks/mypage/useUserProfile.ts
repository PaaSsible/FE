import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getUserProfile } from '@/apis/user.api'
import type * as UserAPITypes from '@/types/apis/user/user.api.types'

/**
 * Derive the API `data` payload type for getUserProfile from project types.
 * Fallback to `unknown` if the type shape can't be inferred.
 */
type UserProfileApiData = UserAPITypes.GetUserProfile['Response'] extends { data: infer D }
  ? D
  : unknown

export interface NormalizedUserProfile {
  id: number | null
  nickname: string
  email: string | null
  profileImageUrl: string | null
  positionName: string
  university: string
  stackNames: string[]
  degreeType: string | null
  major: string | null
  graduationStatus: string | null
  introductionTitle: string
  introductionContent: string
  role: string | null
}

interface UseUserProfileParams {
  userId?: number | null
  enabled?: boolean
}

interface UseUserProfileResult {
  data: UserProfileApiData | null
  normalizedData: NormalizedUserProfile | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

const toNormalizedProfile = (profile: UserProfileApiData): NormalizedUserProfile => {
  const stackNames = Array.isArray(profile.stackNames)
    ? profile.stackNames
        .map((name) => (typeof name === 'string' ? name.trim() : ''))
        .filter((name): name is string => Boolean(name))
    : []

  const introductionTitle =
    typeof profile.introductionTitle === 'string' ? profile.introductionTitle.trim() : ''
  const introductionContent =
    typeof profile.introductionContent === 'string' ? profile.introductionContent.trim() : ''

  const universityName = typeof profile.university === 'string' ? profile.university.trim() : ''
  const majorName = typeof profile.major === 'string' ? profile.major.trim() : ''
  const universityDisplay = universityName
    ? majorName
      ? `${universityName} · ${majorName}`
      : universityName
    : majorName
      ? majorName
      : ''

  return {
    id: typeof profile.id === 'number' ? profile.id : null,
    nickname: typeof profile.nickname === 'string' ? profile.nickname : '',
    email: typeof profile.email === 'string' ? profile.email : null,
    profileImageUrl: typeof profile.profileImageUrl === 'string' ? profile.profileImageUrl : null,
    positionName:
      typeof profile.positionName === 'string' && profile.positionName.trim().length > 0
        ? profile.positionName.trim()
        : '포지션 미정',
    university: universityDisplay,
    stackNames,
    degreeType: typeof profile.degreeType === 'string' ? profile.degreeType : null,
    major: majorName || null,
    graduationStatus:
      typeof profile.graduationStatus === 'string' ? profile.graduationStatus : null,
    introductionTitle: introductionTitle || '소개가 아직 없습니다.',
    introductionContent: introductionContent || '아직 등록된 소개가 없습니다.',
    role: typeof profile.role === 'string' ? profile.role : null,
  }
}

export function useUserProfile({
  userId,
  enabled = true,
}: UseUserProfileParams): UseUserProfileResult {
  const [data, setData] = useState<UserProfileApiData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const numericId = typeof userId === 'number' && Number.isFinite(userId) ? userId : null
  const shouldFetch = enabled && numericId !== null

  const fetchData = useCallback(async () => {
    if (!shouldFetch || numericId === null) {
      setData(null)
      setIsLoading(false)
      setIsError(false)
      setError(null)
      return
    }

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const response = await getUserProfile({
        userId: numericId,
      })

      if (!response.success) {
        throw new Error(response.message ?? '프로필을 불러오지 못했습니다.')
      }

      if (!controller.signal.aborted) {
        setData(response.data)
      }
    } catch (err) {
      if ((err as Error).name === 'CanceledError' || (err as Error).name === 'AbortError') {
        return
      }

      setIsError(true)
      setError(err instanceof Error ? err : new Error('프로필을 불러오지 못했습니다.'))
      setData(null)
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [numericId, shouldFetch])

  useEffect(() => {
    if (!shouldFetch) {
      setData(null)
      setIsLoading(false)
      setIsError(false)
      setError(null)
      return
    }

    void fetchData()

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [fetchData, shouldFetch])

  const refetch = useCallback(() => {
    if (shouldFetch) {
      void fetchData()
    }
  }, [fetchData, shouldFetch])

  const normalizedData = useMemo(() => {
    if (!data) {
      return null
    }
    return toNormalizedProfile(data)
  }, [data])

  return useMemo(
    () => ({
      data,
      normalizedData,
      isLoading,
      isError,
      error,
      refetch,
    }),
    [data, normalizedData, isLoading, isError, error, refetch],
  )
}

export default useUserProfile
