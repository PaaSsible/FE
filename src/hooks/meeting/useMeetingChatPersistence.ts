import { useEffect } from 'react'

import { useMeetingStore, type MeetingChatMessage } from '@/stores/meetingStore'

const STORAGE_LIMIT = 200

const getStorageKey = (meetId: number) => `meet:${meetId}:publicMessages`

export function useMeetingChatPersistence(meetId?: number): void {
  const publicMessages = useMeetingStore((state) => state.publicMessages)
  const setPublicMessages = useMeetingStore((state) => state.setPublicMessages)

  useEffect(() => {
    if (!meetId) return

    try {
      const key = getStorageKey(meetId)
      const raw = sessionStorage.getItem(key)
      if (!raw) return
      const parsed = JSON.parse(raw) as MeetingChatMessage[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        setPublicMessages(parsed)
      }
    } catch (error) {
      console.warn('[Meeting] Failed to restore public messages from sessionStorage', error)
    }
    // Intentionally do not clear on unmount
  }, [meetId, setPublicMessages])

  useEffect(() => {
    if (!meetId) return
    try {
      const key = getStorageKey(meetId)
      const toStore = publicMessages.slice(-STORAGE_LIMIT)
      sessionStorage.setItem(key, JSON.stringify(toStore))
    } catch (error) {
      console.warn('[Meeting] Failed to persist public messages to sessionStorage', error)
    }
  }, [meetId, publicMessages])
}
