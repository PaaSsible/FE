import type { Client, IMessage } from '@stomp/stompjs'
import { useCallback, useEffect, useRef } from 'react'

import { useMeetingStore } from '@/stores/meetingStore'

const sanitizePayload = (raw: string | undefined): string | null => {
  if (!raw) return null
  const trimmed = raw.replace(/\u0000/g, '').trim()
  return trimmed.length > 0 ? trimmed : null
}

interface UseMeetingSilentHighlightOptions {
  meetId?: number
  stompClient: Client | null
  isConnected: boolean
}

export function useMeetingSilentHighlight({
  meetId,
  stompClient,
  isConnected,
}: UseMeetingSilentHighlightOptions): {
  handleSilentMessage: (message: IMessage) => void
} {
  const setInactiveUserIds = useMeetingStore((state) => state.setInactiveUserIds)
  const removeInactiveUserIds = useMeetingStore((state) => state.removeInactiveUserIds)
  const setSilentMetadata = useMeetingStore((state) => state.setSilentMetadata)
  const isCurrentUserSpeaking = useMeetingStore((state) => state.isCurrentUserSpeaking)
  const currentUserId = useMeetingStore((state) => state.currentUserId)

  const keepAliveTimerRef = useRef<number | null>(null)
  const lastSentSpeakingRef = useRef<boolean | null>(null)
  const hasSentInitialFalseRef = useRef(false)

  const publishSpeakingStatus = useCallback(
    (speaking: boolean) => {
      if (!meetId || !stompClient || !currentUserId || !stompClient.connected) {
        return
      }

      try {
        const numericUserId = Number(currentUserId)
        const payload = {
          userId: Number.isFinite(numericUserId) ? numericUserId : currentUserId,
          speaking,
        }

        stompClient.publish({
          destination: `/app/meet/${meetId}/speaking`,
          body: JSON.stringify(payload),
        })
        lastSentSpeakingRef.current = speaking
      } catch (error) {
        console.error('[MeetingWS] Failed to publish speaking status', error)
      }
    },
    [currentUserId, meetId, stompClient],
  )

  const handleSilentMessage = useCallback(
    (message: IMessage) => {
      const sanitized = sanitizePayload(message.body)
      if (!sanitized) return

      try {
        const payload = JSON.parse(sanitized) as {
          silentUserIds?: Array<string | number> | null
          thresholdSec?: number | null
          snapshotAt?: string | null
        }

        const silentIds = Array.isArray(payload.silentUserIds)
          ? payload.silentUserIds.map((id) => String(id))
          : []
        setInactiveUserIds(silentIds)

        setSilentMetadata({
          thresholdSeconds:
            typeof payload.thresholdSec === 'number'
              ? payload.thresholdSec
              : payload.thresholdSec === null
                ? null
                : undefined,
          snapshotAt:
            typeof payload.snapshotAt === 'string'
              ? payload.snapshotAt
              : payload.snapshotAt === null
                ? null
                : undefined,
        })
      } catch (error) {
        console.error('[MeetingWS] Failed to parse silent payload', error)
      }
    },
    [setInactiveUserIds, setSilentMetadata],
  )

  useEffect(() => {
    if (!meetId || !stompClient || !currentUserId || !isConnected || !stompClient.connected) {
      return
    }

    if (!hasSentInitialFalseRef.current) {
      publishSpeakingStatus(false)
      hasSentInitialFalseRef.current = true
    }

    if (isCurrentUserSpeaking) {
      publishSpeakingStatus(true)
      removeInactiveUserIds([String(currentUserId)])

      if (!keepAliveTimerRef.current) {
        keepAliveTimerRef.current = window.setInterval(() => {
          publishSpeakingStatus(true)
        }, 8000)
      }
    } else {
      if (keepAliveTimerRef.current) {
        window.clearInterval(keepAliveTimerRef.current)
        keepAliveTimerRef.current = null
      }

      if (lastSentSpeakingRef.current === true) {
        publishSpeakingStatus(false)
      }
    }

    return () => {
      if (keepAliveTimerRef.current) {
        window.clearInterval(keepAliveTimerRef.current)
        keepAliveTimerRef.current = null
      }
    }
  }, [
    currentUserId,
    isConnected,
    isCurrentUserSpeaking,
    meetId,
    publishSpeakingStatus,
    removeInactiveUserIds,
    stompClient,
  ])

  useEffect(
    () => () => {
      if (keepAliveTimerRef.current) {
        window.clearInterval(keepAliveTimerRef.current)
        keepAliveTimerRef.current = null
      }

      if (lastSentSpeakingRef.current && stompClient?.connected) {
        publishSpeakingStatus(false)
      }

      lastSentSpeakingRef.current = null
      hasSentInitialFalseRef.current = false
    },
    [publishSpeakingStatus, stompClient],
  )

  return {
    handleSilentMessage,
  }
}
