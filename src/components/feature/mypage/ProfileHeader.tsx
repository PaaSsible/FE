import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/atoms/Button'
import { Tag } from '@/components/atoms/Tag'
import { useProfileStore } from '@/stores/profileStore'

interface ProfileHeaderProps {
  showEditButton?: boolean
  showBackButton?: boolean
  title?: string
}

export default function ProfileHeader({
  showEditButton = false,
  showBackButton = false,
  title = '프로필 조회',
}: ProfileHeaderProps) {
  const navigate = useNavigate()
  const profile = useProfileStore((state) => state.profile)

  if (!profile) return null

  return (
    <header className="flex w-full flex-col bg-white p-12">
      {showBackButton && (
        <div className="mb-6 flex items-center gap-[15px]">
          <button
            onClick={() => void navigate(-1)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center"
          >
            <ChevronLeft size={36} className="text-gray-900" />
          </button>

          <h1 className="text-s1-bold text-gray-900">{title}</h1>
        </div>
      )}

      {/* 프로필 본문 */}
      <div className="flex items-start justify-between pb-6">
        <div className="flex items-center gap-6">
          <div className="h-[161px] w-[161px] rounded-full bg-gray-300" />
          <div className="flex flex-col items-start">
            <div className="text-[20px] font-semibold text-gray-900">{profile.nickname}</div>
            <div className="text-gray-500">{profile.positionName}</div>
            <div className="text-sm text-gray-400">{profile.university}</div>

            <div className="mt-3 flex gap-2">
              {profile.stackNames.map((stack, i) => (
                <Tag key={`${stack}-${i}`} label={stack} />
              ))}
            </div>
          </div>
        </div>

        {showEditButton && <Button variant="secondary">프로필 수정</Button>}
      </div>
    </header>
  )
}
