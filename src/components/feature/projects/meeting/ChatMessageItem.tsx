import type { ReactElement, ReactNode } from 'react'

import type { MeetingChatMessage } from '@/stores/meetingStore'

interface ChatMessageItemProps {
  message: MeetingChatMessage
  currentUserId: string | null
}

export default function ChatMessageItem({
  message,
  currentUserId,
}: ChatMessageItemProps): ReactElement {
  const isMine = currentUserId != null && message.senderId === currentUserId
  const isPrivateToMe =
    currentUserId != null && String(message.targetUserId) === String(currentUserId)

  const formattedContent = renderMessageContent(message.content ?? '')

  return (
    <div className={`flex ${isMine ? 'justify-end text-end' : 'justify-start text-start'}`}>
      <div
        className={`w-[70%] gap-[10px] rounded-lg p-[10px] ${
          isMine
            ? 'rounded-br-none bg-gray-700'
            : isPrivateToMe
              ? 'bg-locallit-red-500 rounded-bl-none'
              : 'rounded-bl-none bg-gray-900'
        }`}
      >
        <p className={`text-l2-medium ${isPrivateToMe ? 'text-gray-800' : 'text-gray-500'}`}>
          {message.senderName}
        </p>
        <p className={`text-l2-bold ${isPrivateToMe ? 'text-gray-900' : 'text-gray-200'}`}>
          {formattedContent}
        </p>
      </div>
    </div>
  )
}

const renderMessageContent = (content: string): ReactNode => {
  if (!content) {
    return ''
  }

  const lines = content.split(/\r?\n/)

  return lines.map((line, lineIndex) => {
    const mentionPattern = /(@[^\s@]+)/g
    const segments: ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = mentionPattern.exec(line)) !== null) {
      const [fullMatch] = match
      const start = match.index

      if (start > lastIndex) {
        segments.push(line.slice(lastIndex, start))
      }

      segments.push(
        <span key={`mention-${lineIndex}-${start}`} className="text-l2-extrabold text-inherit">
          {fullMatch}
        </span>,
      )

      lastIndex = start + fullMatch.length
    }

    if (lastIndex < line.length) {
      segments.push(line.slice(lastIndex))
    }

    if (segments.length === 0) {
      segments.push(line)
    }

    if (lineIndex === lines.length - 1) {
      return <span key={`line-${lineIndex}`}>{segments}</span>
    }

    return (
      <span key={`line-${lineIndex}`}>
        {segments}
        <br />
      </span>
    )
  })
}
