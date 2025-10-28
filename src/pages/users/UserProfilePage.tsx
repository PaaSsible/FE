import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import ProfileHeader from '@/components/feature/mypage/ProfileHeader'
import ProfileTabs from '@/components/feature/mypage/ProfileTabs'
import useUserProfile from '@/hooks/mypage/useUserProfile'
import { useProfileStore } from '@/stores/profileStore'

export default function UserProfilePage() {
  const { userId } = useParams<{ userId?: string }>()

  const resolvedUserId = useMemo(() => {
    if (!userId) {
      return NaN
    }

    const parsed = Number(userId)
    return Number.isFinite(parsed) ? parsed : NaN
  }, [userId])

  const isValidUserId = Number.isFinite(resolvedUserId) && resolvedUserId > 0

  const { setProfileInfo, clearProfile } = useProfileStore()
  const { normalizedData } = useUserProfile({
    userId: isValidUserId ? resolvedUserId : null,
    enabled: isValidUserId,
  })

  useEffect(() => {
    clearProfile()
    return () => {
      clearProfile()
    }
  }, [clearProfile, resolvedUserId])

  useEffect(() => {
    if (normalizedData) {
      setProfileInfo(normalizedData)
    }
  }, [normalizedData, setProfileInfo])

  return (
    <div className="flex flex-col bg-white">
      <ProfileHeader showBackButton />
      <ProfileTabs />
    </div>
  )
}
