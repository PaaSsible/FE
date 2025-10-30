'use client'

import { useCallback, useMemo, useState, useEffect, type ReactElement } from 'react'

import type { MeetingChatMessage } from '@/stores/meetingStore'
import { useMeetingStore } from '@/stores/meetingStore'
import { getAuthUser } from '@/utils/authToken'

import ChatInput from './ChatInput'
import ChatMessageItem from './ChatMessageItem'

interface ChatSectionProps {
  sendPublicMessage?: (params: {
    content: string
    targetUserId?: string | null
    senderName?: string | null
  }) => boolean
}

export default function ChatSection({ sendPublicMessage }: ChatSectionProps): ReactElement {
  const publicMessages = useMeetingStore((state) => state.publicMessages)
  const appendPublicMessage = useMeetingStore((state) => state.appendPublicMessage)
  const authUser = useMemo(() => getAuthUser(), [])
  const currentUserId = authUser?.id ?? null
  const participants = useMeetingStore((s) => s.participants)
  const presentMembers = useMeetingStore((s) => s.presentMembers)
  const currentUserIdStr = String(currentUserId ?? '')

  const [isSending, setIsSending] = useState(false)
  const [lastSentContent, setLastSentContent] = useState<string | null>(null)

  const handleSendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      // parse first @mention like @username
      const mentionMatch = trimmed.match(/@([^\s@]+)/)
      let targetUserId: string | null = null
      const contentToSend = trimmed

      if (mentionMatch) {
        const mentionedName = mentionMatch[1]

        // try participants first, then presentMembers
        const byParticipant = participants.find((p) => p.userName === mentionedName)
        const byPresent = presentMembers.find((m) => m.userName === mentionedName)
        const found = byParticipant ?? byPresent

        if (found) {
          targetUserId = found.userId
        }
      }

      if (typeof sendPublicMessage === 'function') {
        const ok = sendPublicMessage({
          content: contentToSend,
          targetUserId: targetUserId,
          senderName: authUser?.username ?? null,
        })

        if (ok) {
          if (targetUserId) {
            if (currentUserId) {
              const localMessage: MeetingChatMessage = {
                id: generateLocalMessageId(),
                meetId: null,
                senderId: currentUserIdStr,
                senderName: authUser?.username ?? '나',
                targetUserId: String(targetUserId),
                content: contentToSend,
                timestamp: new Date().toISOString(),
              }
              appendPublicMessage(localMessage)
            }

            setIsSending(false)
            setLastSentContent(null)
          } else {
            setIsSending(true)
            setLastSentContent(contentToSend)
          }
        } else {
          setIsSending(false)
        }
      } else {
        console.warn('[Chat] sendPublicMessage is not provided; message not sent')
      }
    },
    [
      sendPublicMessage,
      participants,
      presentMembers,
      authUser,
      appendPublicMessage,
      currentUserId,
      currentUserIdStr,
    ],
  )

  // Clear isSending when server echo for the last sent content appears
  useEffect(() => {
    if (!isSending || !lastSentContent) return

    const found = publicMessages.some(
      (m) => m.senderId === String(currentUserId ?? '') && m.content === lastSentContent,
    )
    if (found) {
      setIsSending(false)
      setLastSentContent(null)
    }
  }, [publicMessages, isSending, lastSentContent, currentUserId])

  const hasMessages = publicMessages.length > 0

  return (
    <div className="flex h-full flex-col text-white">
      {/* 상단 영역 (채팅 목록 or 안내 문구) */}
      <div className="flex-1 space-y-3 overflow-y-auto px-6">
        {hasMessages ? (
          publicMessages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} currentUserId={currentUserIdStr} />
          ))
        ) : (
          <div className="text-b3-medium flex h-full items-center justify-center text-gray-200">
            채팅을 시작해 보세요!
          </div>
        )}
      </div>

      {/* 입력창 */}
      <ChatInput onSend={handleSendMessage} isSending={isSending} />
    </div>
  )
}

const generateLocalMessageId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `local-${crypto.randomUUID()}`
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
