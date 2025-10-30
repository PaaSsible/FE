'use client'

import { useMeetingStore } from '@/stores/meetingStore'

interface AbsentListSectionProps {
  onSendAlert: (userName: string) => void
}

export default function AbsentMembersSection({ onSendAlert }: AbsentListSectionProps) {
  const absentMembers = useMeetingStore((state) => state.absentMembers)

  return (
    <div className="flex flex-col gap-[25px]">
      <p className="text-start">결석</p>
      {absentMembers.length === 0 ? (
        <p className="text-gray-400">결석자가 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {absentMembers.map((m) => (
            <li key={m.userId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={m.profileImageUrl || '/assets/images/profile_default.png'}
                  alt={m.userName}
                  className="h-10 w-10 rounded-full bg-gray-700 object-cover"
                />
                <span className="font-medium">{m.userName}</span>
              </div>
              <button
                onClick={() => onSendAlert(m.userName)}
                className="hover:text-gray-0 text-gray-400 transition"
              >
                알림 보내기
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
