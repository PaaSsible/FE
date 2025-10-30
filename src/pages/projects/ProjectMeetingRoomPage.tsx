import type { IMessage } from '@stomp/stompjs'
import { useCallback, useEffect, useMemo, useRef, type ReactElement } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import MeetingLeftSection from '@/components/feature/projects/meeting/MeetingLeftSection'
import MeetingRightPanel from '@/components/feature/projects/meeting/MeetingRightPanel'
import { useMeetingAttendance } from '@/hooks/meeting/useMeetingAttendance'
import { useMeetingChatPersistence } from '@/hooks/meeting/useMeetingChatPersistence'
import { useMeetingRoomCleanup } from '@/hooks/meeting/useMeetingRoomCleanup'
import { useMeetingSilentHighlight } from '@/hooks/meeting/useMeetingSilentHighlight'
import { useMeetingWebSocket } from '@/hooks/meeting/useMeetingWebSocket'
import { useMeetingStore } from '@/stores/meetingStore'
import type { MeetingChatMessage } from '@/stores/meetingStore'

const sanitizePayload = (raw: string | undefined): string | null => {
  if (!raw) return null
  const trimmed = raw.replace(/\u0000/g, '').trim()
  return trimmed.length > 0 ? trimmed : null
}

const fallbackId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const parseChatMessage = (message: IMessage): MeetingChatMessage | null => {
  const sanitized = sanitizePayload(message.body)
  if (!sanitized) return null

  try {
    const payload = JSON.parse(sanitized) as {
      meetId?: number | null
      senderId?: string | number | null
      senderName?: string | null
      targetUserId?: string | number | null
      content?: string | null
      timestamp?: string | null
    }

    const messageId = String(message.headers['message-id'] ?? fallbackId())

    return {
      id: messageId,
      meetId: typeof payload.meetId === 'number' ? payload.meetId : null,
      senderId:
        payload.senderId === null || typeof payload.senderId === 'undefined'
          ? ''
          : String(payload.senderId),
      senderName: payload.senderName ?? '알 수 없음',
      targetUserId:
        payload.targetUserId === null || typeof payload.targetUserId === 'undefined'
          ? null
          : String(payload.targetUserId),
      content: payload.content ?? '',
      timestamp: payload.timestamp ?? new Date().toISOString(),
    }
  } catch (error) {
    console.error('[MeetingWS] Failed to parse chat payload', error)
    return null
  }
}

export default function ProjectMeetingRoomPage(): ReactElement {
  const params = useParams<{ projectId: string; roomId: string }>()
  const meetId = params.roomId ? Number(params.roomId) : NaN
  const projectIdNumber = params.projectId ? Number(params.projectId) : NaN
  const safeMeetId = Number.isFinite(meetId) ? meetId : undefined
  const safeProjectId = Number.isFinite(projectIdNumber) ? projectIdNumber : undefined
  const appendPublicMessage = useMeetingStore.getState().appendPublicMessage
  const setAttendance = useMeetingStore.getState().setAttendance
  const setCurrentUserHost = useMeetingStore.getState().setCurrentUserHost
  const setInactiveUserIds = useMeetingStore.getState().setInactiveUserIds
  const setHighlightedSpeakerUserId = useMeetingStore.getState().setHighlightedSpeakerUserId
  const applyTimerEvent = useMeetingStore.getState().applyTimerEvent
  const isCurrentUserHost = useMeetingStore((state) => state.isCurrentUserHost)
  const currentUserId = useMeetingStore((state) => state.currentUserId)
  const highlightTimeoutRef = useRef<number | null>(null)
  const silentHandlerRef = useRef<(message: IMessage) => void>(() => undefined)

  useMeetingAttendance(safeMeetId)
  useMeetingChatPersistence(safeMeetId)
  useMeetingRoomCleanup()

  const handleSelectedSpeaker = useCallback(
    (userId: string | number | null | undefined) => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current)
        highlightTimeoutRef.current = null
      }

      if (userId === null || typeof userId === 'undefined') {
        setHighlightedSpeakerUserId(null)
        return
      }

      const userIdStr = String(userId)
      const { participants, presentMembers } = useMeetingStore.getState()
      const targetName =
        participants.find((p) => p.userId === userIdStr)?.userName ??
        presentMembers.find((member) => member.userId === userIdStr)?.userName ??
        '참가자'

      toast.success(`${targetName}님이 발언자로 선정됐습니다!`)
      setHighlightedSpeakerUserId(userIdStr)

      highlightTimeoutRef.current = window.setTimeout(() => {
        setHighlightedSpeakerUserId(null)
        highlightTimeoutRef.current = null
      }, 10000)
    },
    [setHighlightedSpeakerUserId],
  )

  const handleStatusMessage = useCallback(
    (message: IMessage) => {
      const sanitized = sanitizePayload(message.body)
      if (!sanitized) return

      try {
        const payload = JSON.parse(sanitized) as {
          type?: string | null
          inactiveUserIds?: Array<string | number> | null
          userId?: string | number | null
          presentMembers?: Array<{
            userId: string | number
            userName: string
            profileImageUrl: string | null
          }>
          absentMembers?: Array<{
            userId: string | number
            userName: string
            profileImageUrl: string | null
          }>
          isHostUser?: boolean | null
        }

        if (payload?.type === 'INACTIVE_MEMBERS') {
          const inactiveIds = Array.isArray(payload.inactiveUserIds)
            ? payload.inactiveUserIds.map((id) => String(id))
            : []
          setInactiveUserIds(inactiveIds)
          return
        }

        if (payload?.type === 'SELECTED_SPEAKER') {
          handleSelectedSpeaker(payload.userId)
          return
        }

        const normalizeMembers = (
          members:
            | Array<{
                userId: string | number
                userName: string
                profileImageUrl: string | null
              }>
            | undefined,
        ) =>
          (members ?? []).map((member) => ({
            userId: String(member.userId),
            userName: member.userName,
            profileImageUrl: member.profileImageUrl ?? null,
          }))

        if (typeof payload.isHostUser === 'boolean') {
          setCurrentUserHost(Boolean(payload.isHostUser))
        }

        setAttendance(
          normalizeMembers(payload.presentMembers),
          normalizeMembers(payload.absentMembers),
        )
      } catch (error) {
        console.error('[MeetingWS] Failed to parse status payload', error)
      }
    },
    [handleSelectedSpeaker, setAttendance, setCurrentUserHost, setInactiveUserIds],
  )

  const handlePublicChatMessage = useCallback(
    (message: IMessage) => {
      const parsed = parseChatMessage(message)
      if (!parsed) return
      appendPublicMessage(parsed)
    },
    [appendPublicMessage],
  )

  const handlePrivateChatMessage = useCallback(
    (message: IMessage) => {
      const parsed = parseChatMessage(message)
      if (!parsed) return
      appendPublicMessage(parsed)
    },
    [appendPublicMessage],
  )

  const handleRandomPickMessage = useCallback(
    (message: IMessage) => {
      const sanitized = sanitizePayload(message.body)
      if (!sanitized) return

      try {
        const payload = JSON.parse(sanitized) as {
          userId?: string | number | null
          pickedAt?: string | null
        }
        handleSelectedSpeaker(payload.userId ?? null)
      } catch (error) {
        console.error('[MeetingWS] Failed to parse random pick payload', error)
      }
    },
    [handleSelectedSpeaker],
  )

  const handleTimerMessage = useCallback(
    (message: IMessage) => {
      const sanitized = sanitizePayload(message.body)
      if (!sanitized) return

      try {
        const payload = JSON.parse(sanitized) as {
          type?: 'START' | 'PAUSE' | 'RESUME' | 'END'
          duration?: number | null
          serverStartTime?: string | null
        }

        if (!payload?.type) {
          return
        }

        applyTimerEvent({
          type: payload.type,
          duration: payload.duration ?? null,
          serverStartTime: payload.serverStartTime ?? null,
        })
      } catch (error) {
        console.error('[MeetingWS] Failed to parse timer payload', error)
      }
    },
    [applyTimerEvent],
  )

  const handleErrorMessage = useCallback((message: IMessage) => {
    const sanitized = sanitizePayload(message.body)
    if (!sanitized) return

    try {
      const payload = JSON.parse(sanitized) as { message?: string | null }
      const errorMessage = payload.message ?? '요청을 처리하는 중 오류가 발생했습니다.'
      toast.error(errorMessage)
    } catch (error) {
      console.error('[MeetingWS] Failed to parse error payload', error)
    }
  }, [])

  const handleHostMessage = useCallback(
    (message: IMessage) => {
      const sanitized = sanitizePayload(message.body)
      if (!sanitized) return

      try {
        const payload = JSON.parse(sanitized) as {
          meetId?: number | null
          newHostId?: string | number | null
          newHostNickname?: string | null
        }

        const newHostId =
          payload.newHostId === null || typeof payload.newHostId === 'undefined'
            ? null
            : String(payload.newHostId)

        const nickname = payload.newHostNickname ?? '새 호스트'
        toast.success(`${nickname}님이 호스트가 되었습니다.`)

        const myUserId = currentUserId ?? useMeetingStore.getState().currentUserId
        const isSelfHost = newHostId !== null && myUserId !== null && newHostId === String(myUserId)
        setCurrentUserHost(isSelfHost)
      } catch (error) {
        console.error('[MeetingWS] Failed to parse host payload', error)
      }
    },
    [currentUserId, setCurrentUserHost],
  )
  const forwardSilentMessage = useCallback((message: IMessage) => {
    silentHandlerRef.current(message)
  }, [])

  const { client: stompClient, isConnected: isStompConnected } = useMeetingWebSocket({
    meetId: safeMeetId,
    enabled: Boolean(safeMeetId),
    onStatusMessage: handleStatusMessage,
    onHostMessage: handleHostMessage,
    onRandomPickMessage: handleRandomPickMessage,
    onPrivateChatMessage: handlePrivateChatMessage,
    onPublicChatMessage: handlePublicChatMessage,
    onTimerMessage: handleTimerMessage,
    onErrorMessage: handleErrorMessage,
    onSilentMessage: forwardSilentMessage,
  })

  const { handleSilentMessage } = useMeetingSilentHighlight({
    meetId: safeMeetId,
    stompClient,
    isConnected: isStompConnected,
  })
  useEffect(() => {
    silentHandlerRef.current = handleSilentMessage
  }, [handleSilentMessage])

  const publishStompMessage = useCallback(
    (destination: string, body?: unknown) => {
      if (!stompClient) {
        toast.error('서버와의 연결 상태를 확인할 수 없습니다.')
        return false
      }

      try {
        stompClient.publish({
          destination,
          body: body ? JSON.stringify(body) : '',
        })
        return true
      } catch (error) {
        console.error('[MeetingWS] Failed to publish message', error)
        toast.error('요청을 전송하지 못했습니다.')
        return false
      }
    },
    [stompClient],
  )

  const ensureMeetContext = useCallback(() => {
    if (!safeMeetId) {
      toast.error('회의 정보를 확인할 수 없습니다.')
      return false
    }
    return true
  }, [safeMeetId])

  const ensureHost = useCallback(() => {
    if (!isCurrentUserHost) {
      toast.error('호스트만 사용할 수 있는 기능입니다.')
      return false
    }
    return true
  }, [isCurrentUserHost])

  const requestRandomSpeaker = useCallback(() => {
    if (!ensureMeetContext() || !ensureHost() || !safeMeetId) return
    publishStompMessage(`/app/meet/${safeMeetId}/random-pick`)
  }, [ensureHost, ensureMeetContext, publishStompMessage, safeMeetId])

  const startTimer = useCallback(
    (durationSeconds: number) => {
      if (!ensureMeetContext() || !ensureHost() || !safeMeetId) return
      const normalized = Math.round(Math.max(1, durationSeconds))
      // Server expects a raw number payload (duration in seconds), not an object.
      publishStompMessage(`/app/meet/${safeMeetId}/timer/start`, normalized)
    },
    [ensureHost, ensureMeetContext, publishStompMessage, safeMeetId],
  )

  const pauseTimer = useCallback(() => {
    if (!ensureMeetContext() || !ensureHost() || !safeMeetId) return
    publishStompMessage(`/app/meet/${safeMeetId}/timer/pause`)
  }, [ensureHost, ensureMeetContext, publishStompMessage, safeMeetId])

  const resumeTimer = useCallback(() => {
    if (!ensureMeetContext() || !ensureHost() || !safeMeetId) return
    publishStompMessage(`/app/meet/${safeMeetId}/timer/resume`)
  }, [ensureHost, ensureMeetContext, publishStompMessage, safeMeetId])

  const endTimer = useCallback(() => {
    if (!ensureMeetContext() || !ensureHost() || !safeMeetId) return
    publishStompMessage(`/app/meet/${safeMeetId}/timer/end`)
  }, [ensureHost, ensureMeetContext, publishStompMessage, safeMeetId])

  const timerController = useMemo(
    () => ({
      start: startTimer,
      pause: pauseTimer,
      resume: resumeTimer,
      end: endTimer,
    }),
    [endTimer, pauseTimer, resumeTimer, startTimer],
  )

  useEffect(
    () => () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current)
        highlightTimeoutRef.current = null
      }
    },
    [],
  )

  const sendPublicMessage = (params: {
    content: string
    targetUserId?: string | null
    senderName?: string | null
  }) => {
    if (!stompClient) return false
    if (!safeMeetId) return false

    try {
      const destination = `/app/meet/${safeMeetId}/chat`
      const target =
        params.targetUserId === null || typeof params.targetUserId === 'undefined'
          ? null
          : /^\d+$/.test(String(params.targetUserId))
            ? Number(params.targetUserId)
            : params.targetUserId

      const payload: Record<string, unknown> = {
        senderName: params.senderName ?? null,
        targetUserId: target,
        content: params.content,
      }

      stompClient.publish({ destination, body: JSON.stringify(payload) })
      return true
    } catch (error) {
      console.error('[MeetingWS] Failed to publish chat message', error)
      return false
    }
  }

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* 왼쪽: 회의 메인 영역 */}
      <MeetingLeftSection
        meetId={safeMeetId}
        projectId={safeProjectId}
        isHost={isCurrentUserHost}
        timerController={timerController}
      />

      {/* 오른쪽: 참가자 / 채팅 */}
      <MeetingRightPanel
        sendPublicMessage={sendPublicMessage}
        onRequestRandomSpeaker={requestRandomSpeaker}
      />
    </div>
  )
}
