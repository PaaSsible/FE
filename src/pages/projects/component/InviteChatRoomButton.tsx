import { AxiosError } from 'axios'
import clsx from 'clsx'
import { Check, MessageSquarePlus } from 'lucide-react'
import { useEffect, useState, type JSX } from 'react'
import { useParams } from 'react-router-dom'
import { ZodError } from 'zod'

import { getBoardMember } from '@/apis/board.api'
import { postChatRoomInvitation } from '@/apis/chat.api'
import Button from '@/components/atoms/Button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog'
import type { PostChatRoom } from '@/types/apis/chat/chat.api.types'
import type { BoardMember } from '@/types/entities/board/board.entitites.types'
import { getAuthUser } from '@/utils/authToken'

interface InviteChatRoomButtonProps {
  projectId: string | undefined
}
const InviteChatRoomButton = ({ projectId }: InviteChatRoomButtonProps): JSX.Element => {
  const { roomId } = useParams<{ roomId: string }>()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedUsers, setSelectedUsers] = useState<PostChatRoom['Body']['participantIds']>([])
  const [boardMember, setBoardMember] = useState<BoardMember[] | undefined>()

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
      console.error('기타에러', error)
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
    if (open) {
      const user = getAuthUser()
      const userId = user?.id
      const getBoardMemberData = async () => {
        try {
          const response = await getBoardMember({ boardId: Number(projectId) })
          setBoardMember(response.data.filter((member) => member.userId !== Number(userId)))
        } catch (error) {
          if (error instanceof ZodError) console.error('타입에러', error)
          else if (error instanceof AxiosError) console.error('네트워크에러', error)
        }
      }
      void getBoardMemberData()
    } else {
      return () => setSelectedUsers([])
    }
  }, [projectId, open])

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
          {boardMember?.map((b) => (
            <div
              key={b.userId}
              onClick={() => void onSelectMember(b.userId)}
              className={clsx(
                'flex flex-1 items-center justify-between rounded-lg p-3 text-sm leading-5 font-medium text-slate-500',
                selectedUsers.some((s) => s === b.userId)
                  ? 'bg-locallit-red-200 !text-black'
                  : 'bg-white',
              )}
            >
              {b.userName}
              <Check
                className={clsx(
                  'h-4 w-4',
                  selectedUsers.some((s) => s === b.userId) ? 'visible' : 'hidden',
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
