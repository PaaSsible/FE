import { SuspenseQuery } from '@suspensive/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Suspense, type JSX } from 'react'
import { useParams } from 'react-router-dom'

import 'dayjs/locale/ko' // 한국어 설정

import ProjectHeader from '@/components/feature/projects/ProjectHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { getChatRoomsQueryOptions } from '@/queries/chat.queries'

import ChatRoomItem from './component/ChatRoomItem'
import CreateNewChatRoomButton from './component/CreateNewChatRoomButton'

dayjs.extend(relativeTime)
dayjs.locale('ko') // 한국어로 "몇분 전" 표시

export default function ProjectChatPage(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>()

  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-6 flex w-full items-center justify-between">
        <ProjectHeader title="채팅" className="!mb-0" />
        <CreateNewChatRoomButton />
      </div>

      <Suspense fallback={<Skeleton className="h-24 w-full bg-gray-200" />}>
        <SuspenseQuery {...getChatRoomsQueryOptions({ boardId: Number(projectId) })}>
          {({ data }) => {
            const chatRooms = data.data

            if (!chatRooms || chatRooms.length === 0) {
              return (
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 text-3xl leading-10 font-semibold text-black">
                  채팅이 없습니다.
                  <p className="text-center text-xl font-medium text-black opacity-40">
                    대화방을 생성해 팀원들과 채팅을 시작해 보세요!
                  </p>
                </div>
              )
            }

            return (
              <section className="flex flex-col gap-3.5">
                {chatRooms.map((room) => (
                  <ChatRoomItem key={room.roomId} item={room} projectId={projectId} />
                ))}
              </section>
            )
          }}
        </SuspenseQuery>
      </Suspense>
    </div>
  )
}
