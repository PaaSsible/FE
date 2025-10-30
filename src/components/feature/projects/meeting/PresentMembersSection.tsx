'use client'

import { Mic, MicOff, Video, VideoOff } from 'lucide-react'
import { useMemo } from 'react'

import { useMeetingStore } from '@/stores/meetingStore'

export default function PresentMembersSection() {
  const presentMembers = useMeetingStore((state) => state.presentMembers)
  const participants = useMeetingStore((state) => state.participants)
  const currentUserId = useMeetingStore((state) => state.currentUserId)
  const currentUserMicOn = useMeetingStore((state) => state.currentUserMedia.isMicOn)
  const currentUserCameraOn = useMeetingStore((state) => state.currentUserMedia.isCameraOn)

  const members = useMemo(() => {
    if (presentMembers.length === 0) {
      return []
    }

    const participantMap = new Map(participants.map((p) => [p.userId, p]))

    return presentMembers.map((member) => {
      if (currentUserId && member.userId === currentUserId) {
        return {
          ...member,
          isMicOn: currentUserMicOn,
          isCameraOn: currentUserCameraOn,
        }
      }

      const participant = participantMap.get(member.userId)
      return {
        ...member,
        isMicOn: participant?.isMicOn ?? false,
        isCameraOn: participant?.isCameraOn ?? false,
      }
    })
  }, [currentUserCameraOn, currentUserId, currentUserMicOn, participants, presentMembers])

  return (
    <div className="flex flex-col gap-[25px]">
      <p className="text-start">참석</p>
      {members.length === 0 ? (
        <p className="text-gray-400">참석자가 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {members.map((m) => (
            <li key={m.userId} className={'flex items-center justify-between rounded-md'}>
              <div className="flex items-center gap-3">
                <img
                  src={m.profileImageUrl || '/assets/images/profile_default.png'}
                  alt={m.userName}
                  className="h-10 w-10 rounded-full bg-gray-700 object-cover"
                />

                <span className="text-b4-medium">{m.userName}</span>
              </div>

              <div className="flex gap-2 text-gray-500">
                {m.isMicOn ? (
                  <Mic size={20} />
                ) : (
                  <MicOff size={20} className="text-locallit-red-400" />
                )}
                {m.isCameraOn ? (
                  <Video size={20} />
                ) : (
                  <VideoOff size={20} className="text-locallit-red-400" />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
