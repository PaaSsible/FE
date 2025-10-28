import { useEffect, useMemo } from 'react'

import ProfileHeader from '@/components/feature/mypage/ProfileHeader'
import ProfileTabs from '@/components/feature/mypage/ProfileTabs'
import useUserProfile from '@/hooks/mypage/useUserProfile'
import { useProfileStore } from '@/stores/profileStore'
import { getAuthUser } from '@/utils/authToken'

export default function MypageProfilePage() {
  const authUser = getAuthUser()
  const resolvedUserId = useMemo(() => {
    if (!authUser) {
      return NaN
    }
    const parsed = Number(authUser.id)
    return Number.isFinite(parsed) ? parsed : NaN
  }, [authUser])

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
    <div className="flex flex-col bg-gray-50">
      <ProfileHeader showEditButton />
      <ProfileTabs isMyProfile />
    </div>
  )
}
