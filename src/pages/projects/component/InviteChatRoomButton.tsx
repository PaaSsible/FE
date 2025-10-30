/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AxiosError } from 'axios'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import { useEffect, useState, type JSX } from 'react'
import { useParams } from 'react-router-dom'
import { ZodError } from 'zod'

import { getChatRoomInvitationAvailableMember, postChatRoomInvitation } from '@/apis/chat.api'
import Button from '@/components/atoms/Button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import type { PostChatRoom } from '@/types/apis/chat/chat.api.types'
import type { BoardMember } from '@/types/entities/board/board.entitites.types'
import type { ChatRoomMember } from '@/types/entities/chat-room/chatRoom.types'

interface InviteChatRoomButtonProps {
  projectId: string | undefined
}
const InviteChatRoomButton = ({ projectId }: InviteChatRoomButtonProps): JSX.Element => {
  const { roomId } = useParams<{ roomId: string }>()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedUsers, setSelectedUsers] = useState<PostChatRoom['Body']['participantIds']>([])
  const [inviteableMember, setInviteableMember] = useState<ChatRoomMember[]>()

  const onConfirmButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (selectedUsers.length === 0) throw new Error('채팅 상대가 없음')
      e.preventDefault()
      await postChatRoomInvitation(
        { boardId: Number(projectId), roomId: Number(roomId) },
        { participantIds: selectedUsers },
      )
    } catch (error) {
      if (error instanceof ZodError) console.error('타입에러', error)
      else if (error instanceof AxiosError) console.error('네트워크에러', error)
      else console.error('기타에러', error)
    } finally {
      setOpen(false)
    }
  }

  const onSelectMember = (id: BoardMember['userId']) => {
    if (selectedUsers.some((s) => s === id)) {
      const newSelectedUsers = selectedUsers.filter((s) => s !== id) // 수정 필요: 채팅룸 유저 조회 API 없음
      setSelectedUsers(newSelectedUsers)
    } else {
      setSelectedUsers((prev) => [...prev, id])
    }
  }

  useEffect(() => {
    const getInviteableMember = async () => {
      const response = await getChatRoomInvitationAvailableMember({ roomId: Number(roomId) })
      setInviteableMember(response.data)
    }
    if (open) {
      void getInviteableMember()
    } else {
      // 언마운트 시 선택 멤버 초기화
      return () => setSelectedUsers([])
    }
  }, [roomId, open])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="w-full justify-start px-5 py-2.5 text-start font-['Inter'] text-base leading-normal font-normal text-white">
        초대하기
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-none p-8">
        <AlertDialogHeader className="mb-8 flex flex-col gap-4">
          <AlertDialogTitle className="justify-start font-['Pretendard'] text-3xl leading-10 font-bold text-neutral-900">
            초대할 팀원 선택
          </AlertDialogTitle>
          <AlertDialogDescription className="font-['Pretendard'] text-base leading-5 font-normal text-zinc-800">
            해당 대화방에서 초대할 팀원을 1명 이상 선택해 주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-1">
          {inviteableMember &&
            inviteableMember.map((m) => (
              <div
                key={m.userId}
                onClick={() => void onSelectMember(m.userId)}
                className={clsx(
                  'flex flex-1 items-center justify-between rounded-lg p-3 text-sm leading-5 font-medium text-slate-500',
                  selectedUsers.some((s) => s === m.userId)
                    ? 'bg-locallit-red-200 !text-black'
                    : 'bg-white',
                )}
              >
                {m.nickname}
                <Check
                  className={clsx(
                    'h-4 w-4',
                    selectedUsers.some((s) => s === m.userId) ? 'visible' : 'hidden',
                  )}
                />
              </div>
            ))}
        </div>

        <AlertDialogFooter className="flex gap-4">
          <AlertDialogCancel asChild>
            <Button variant="secondary" className="flex-1">
              취소
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="primary"
              type="submit"
              className="flex-1"
              onClick={(e) => void onConfirmButton(e)}
            >
              선택하기
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default InviteChatRoomButton
