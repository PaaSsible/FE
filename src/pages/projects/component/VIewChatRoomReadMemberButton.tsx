import { AxiosError } from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, type JSX } from 'react'
import { useParams } from 'react-router-dom'
import { ZodError } from 'zod'

import { getChatRoomMessageReadUser } from '@/apis/chat.api'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import type { GetChatRoomReadUser } from '@/types/apis/chat/chat.api.types'

interface ViewChatRoomReadMemberButtonProps {
  messageId: number
  readCount: number
  isMine?: boolean
}
//읽음 선택 시 읽은 팀원 보는 다이얼로그
const ViewChatRoomReadMemberButton = ({
  messageId,
  isMine = false,
  readCount,
}: ViewChatRoomReadMemberButtonProps): JSX.Element => {
  const { roomId } = useParams<{ roomId: string }>()
  const [readInfo, setReadInfo] = useState<GetChatRoomReadUser['Response']['data']>()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    const getReadInfo = async () => {
      try {
        const response = await getChatRoomMessageReadUser({
          roomId: Number(roomId),
          messageId: messageId,
        })
        //console.log(response.data)
        setReadInfo(response.data)
      } catch (error) {
        if (error instanceof ZodError) console.log('타입에러', error)
        else if (error instanceof AxiosError) console.log('네트워크 에러', error)
        else console.log('기타에러', error)
      }
    }
    void getReadInfo()
  }, [readCount])

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <AlertDialogTrigger>
        {isMine ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-none p-8">
        <AlertDialogHeader className="mb-8 flex flex-col gap-4">
          <AlertDialogTitle className="flex items-center justify-start gap-2.5 font-['Pretendard'] text-3xl leading-10 font-bold text-neutral-900">
            <AlertDialogCancel className="flex items-center justify-center border-none shadow-none">
              <ChevronLeft className="h-6 w-6 text-stone-500" />
            </AlertDialogCancel>
            읽은 팀원 보기
          </AlertDialogTitle>
          <AlertDialogDescription className="text-start font-['Pretendard'] text-base leading-5 font-normal text-zinc-800">
            현재 대화에 참여 중인 팀원 중 {readInfo?.readCount}명이 읽었습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {readInfo &&
          readInfo.readUsers.map((user, index) => (
            <div className="flex flex-col gap-1" key={`${user.nickname}-${index}`}>
              <div>{user.nickname}</div>
            </div>
          ))}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ViewChatRoomReadMemberButton
