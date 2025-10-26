import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import ProfileHeader from '@/components/feature/mypage/ProfileHeader'
import ProfileTabs from '@/components/feature/mypage/ProfileTabs'
import { mockProfile } from '@/constants/mockProfile'
import { useProfileStore } from '@/stores/profileStore'

export default function UserProfilePage() {
  const { userId } = useParams()
  const { setProfileInfo } = useProfileStore()

  useEffect(() => {
    setProfileInfo({
      ...mockProfile,
    })
  }, [userId, setProfileInfo])

  return (
    <div className="flex flex-col bg-white">
      <ProfileHeader showBackButton />
      <ProfileTabs />
    </div>
  )
}
