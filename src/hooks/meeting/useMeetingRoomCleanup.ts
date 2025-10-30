import { useEffect } from 'react'

import { useMeetingStore } from '@/stores/meetingStore'

export function useMeetingRoomCleanup(): void {
  const clearAttendance = useMeetingStore((state) => state.clearAttendance)
  const clearPublicMessages = useMeetingStore((state) => state.clearPublicMessages)
  const clearInactiveUserIds = useMeetingStore((state) => state.clearInactiveUserIds)
  const setCurrentUserHost = useMeetingStore((state) => state.setCurrentUserHost)
  const setHighlightedSpeakerUserId = useMeetingStore((state) => state.setHighlightedSpeakerUserId)
  const resetTimerState = useMeetingStore((state) => state.resetTimerState)
  const setCurrentUserSpeaking = useMeetingStore((state) => state.setCurrentUserSpeaking)
  const setSilentMetadata = useMeetingStore((state) => state.setSilentMetadata)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow || 'unset'
    }
  }, [])

  useEffect(
    () => () => {
      clearAttendance()
      clearPublicMessages()
      clearInactiveUserIds()
      setCurrentUserHost(false)
      setHighlightedSpeakerUserId(null)
      resetTimerState()
      setCurrentUserSpeaking(false)
      setSilentMetadata({ thresholdSeconds: null, snapshotAt: null })
    },
    [
      clearAttendance,
      clearInactiveUserIds,
      clearPublicMessages,
      resetTimerState,
      setCurrentUserHost,
      setCurrentUserSpeaking,
      setHighlightedSpeakerUserId,
      setSilentMetadata,
    ],
  )
}
