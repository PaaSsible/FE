import dayjs from 'dayjs'
import type { JSX } from 'react'
import { useNavigate } from 'react-router-dom'

import type { ChatRoom } from '@/types/entities/chat-room/chatRoom.types'

interface ChatRoomProps {
  item: ChatRoom
}

const ChatRoomItem = ({ item }: ChatRoomProps): JSX.Element => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => void navigate(`/chat/${item.roomId}`, { state: { roomName: item.roomName } })}
      className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm"
    >
      <div className="mr-4 h-12 w-12 rounded-full bg-zinc-300" />
      <div className="flex flex-1 flex-col items-start text-base leading-6 font-bold text-black">
        {item.roomName}
        <p className="line-clamp-1 max-w-[778px] text-start text-sm leading-5 font-medium text-black opacity-80">
          {item.lastMessage}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-1.5 text-xs leading-4 font-medium text-black opacity-60">
        {dayjs(item.lastMessageTime).fromNow()}
        <div className="bg-locallit-red-500 flex h-6 w-6 items-center justify-center rounded-full text-sm leading-5 font-bold text-white">
          {item.unreadCount}
        </div>
      </div>
    </div>
  )
}
export default ChatRoomItem
