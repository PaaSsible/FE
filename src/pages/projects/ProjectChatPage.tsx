import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState, type JSX } from 'react'
import { useParams } from 'react-router-dom'
import { ZodError } from 'zod'

import 'dayjs/locale/ko' // 한국어 설정
import { getChatRooms } from '@/apis/chat.api'
import ProjectHeader from '@/components/feature/projects/ProjectHeader'
import type { ChatRoom } from '@/types/entities/chat-room/chatRoom.types'

import ChatRoomItem from './component/ChatRoomItem'
import CreateNewChatRoomButton from './component/CreateNewChatRoomButton'

dayjs.extend(relativeTime)
dayjs.locale('ko') // 한국어로 "몇분 전" 표시

export default function ProjectChatPage(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>()
  const [chatRooms, setChatRooms] = useState<ChatRoom[] | undefined>()

  useEffect(() => {
    const getChatRoomsData = async () => {
      try {
        const response = await getChatRooms({ boardId: Number(projectId) })
        setChatRooms(response.data)
      } catch (error) {
        if (error instanceof ZodError) console.error('타입에러', error)
        else if (error instanceof AxiosError) console.error('네트워크에러', error)
      }
    }
    void getChatRoomsData()
  }, [projectId])

  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-6 flex w-full items-center justify-between">
        <ProjectHeader title="채팅" className="!mb-0" />
        <CreateNewChatRoomButton />
      </div>

      {chatRooms ? (
        <section className="flex flex-col gap-3.5">
          {chatRooms.map((c) => (
            <ChatRoomItem key={c.roomId} item={c} projectId={projectId} />
          ))}
        </section>
      ) : (
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 text-3xl leading-10 font-semibold text-black">
          채팅이 없습니다.
          <p className="text-center text-xl font-medium text-black opacity-40">
            대화방을 생성해 팀원들과 채팅을 시작해 보세요!
          </p>
        </div>
      )}
    </div>
  )
}
