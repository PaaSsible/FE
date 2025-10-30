'use client'

import clsx from 'clsx'
import { Mic, MicOff } from 'lucide-react'
import { useEffect, useRef, type ReactElement } from 'react'

import { useAudioAnalyzer } from '@/hooks/meeting/useAudioAnalyzer'
import { useMeetingStore } from '@/stores/meetingStore'

interface MeetingMainVideoProps {
  stream: MediaStream | null
  isCameraOn: boolean
  isMicOn: boolean
  userId?: string | null
  userName?: string | null
  profileImageUrl?: string | null
  className?: string
}

export default function MeetingMainVideo({
  stream,
  isCameraOn,
  isMicOn,
  userId,
  userName,
  profileImageUrl,
  className,
}: MeetingMainVideoProps): ReactElement {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isSpeaking = useAudioAnalyzer(stream, isMicOn)
  const highlightedSpeakerUserId = useMeetingStore((state) => state.highlightedSpeakerUserId)
  const inactiveUserIds = useMeetingStore((state) => state.inactiveUserIds)
  const setCurrentUserSpeaking = useMeetingStore((state) => state.setCurrentUserSpeaking)
  const removeInactiveUserIds = useMeetingStore((state) => state.removeInactiveUserIds)

  const userIdStr = userId != null ? String(userId) : null
  const isHighlighted = userIdStr != null && highlightedSpeakerUserId === userIdStr
  const isInactive = userIdStr != null && inactiveUserIds.includes(userIdStr)
  const showSpeakingBadge = isSpeaking || isHighlighted

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    setCurrentUserSpeaking(isSpeaking)
    if (isSpeaking && userIdStr) {
      removeInactiveUserIds([userIdStr])
    }
  }, [isSpeaking, removeInactiveUserIds, setCurrentUserSpeaking, userIdStr])

  const innerContent = (
    <div
      className={clsx(
        'relative flex h-full flex-col items-center justify-center overflow-hidden rounded-xl transition-all duration-300',
        {
          'border-locallit-red-500 border-2': showSpeakingBadge && !isInactive,
          'border border-transparent': !showSpeakingBadge && !isInactive,
          'bg-locallit-red-950 animate-freezeGlow': isInactive,
        },
      )}
    >
      {isInactive && (
        <div className="animate-freezeOverlay pointer-events-none absolute inset-0 rounded-xl bg-white/5" />
      )}

      {isCameraOn && stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full rounded-lg bg-black object-cover"
        />
      ) : (
        <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center rounded-lg bg-gray-700">
          <img
            src={profileImageUrl ?? '/assets/images/profile_default.png'}
            alt={userName ?? '사용자'}
            className="h-20 w-20 rounded-full object-cover"
          />
          <span className="text-b4-medium text-locallit-red-50 mt-2">{userName ?? '사용자'}</span>
        </div>
      )}

      <div className="absolute right-4 bottom-4 flex">
        <div
          className={clsx(
            'flex h-[50px] w-[50px] items-center justify-center rounded-lg transition-colors',
            isMicOn ? 'bg-gray-550' : 'bg-locallit-red-600',
          )}
        >
          {isMicOn ? (
            <Mic size={24} className="text-white" />
          ) : (
            <MicOff size={24} className="text-white" />
          )}
        </div>
      </div>
    </div>
  )

  const tileWithBadge = (
    <div className="relative h-full">
      {(showSpeakingBadge || isInactive) && (
        <div className="bg-locallit-red-500 text-b5-bold absolute top-3 left-3 z-50 rounded-full px-3 py-1 text-gray-900">
          {isInactive ? '비발언자' : '발언자'}
        </div>
      )}
      {innerContent}
    </div>
  )

  if (isInactive) {
    return (
      <div className={clsx('h-full', className)}>
        <div
          className="h-full rounded-xl p-[2px]"
          style={{
            background: 'linear-gradient(107.04deg, #FF6348 -0.17%, #227BD6 99.93%)',
          }}
        >
          {tileWithBadge}
        </div>
      </div>
    )
  }

  return <div className={clsx('h-full', className)}>{tileWithBadge}</div>
}
