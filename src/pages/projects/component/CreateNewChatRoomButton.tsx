import { AxiosError } from 'axios'
import clsx from 'clsx'
import { Check, MessageSquarePlus } from 'lucide-react'
import { useEffect, useState, type JSX } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ZodError } from 'zod'

import { getBoardMember } from '@/apis/board.api'
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
import { Spinner } from '@/components/ui/spinner'
import { usePostChatRoom } from '@/queries/chat.queries'
import type { PostChatRoom } from '@/types/apis/chat/chat.api.types'
import type { BoardMember } from '@/types/entities/board/board.entitites.types'
import { getAuthUser } from '@/utils/authToken'

const CreateNewChatRoomButton = (): JSX.Element => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedUsers, setSelectedUsers] = useState<PostChatRoom['Body']['participantIds']>([])
  const [boardMember, setBoardMember] = useState<BoardMember[] | undefined>()
  const { mutate: createNewChatRoom, isPending } = usePostChatRoom({ boardId: Number(projectId) })

  const onSelectMember = (id: BoardMember['userId']) => {
    if (selectedUsers.some((s) => s === id)) {
      const newSelectedUsers = selectedUsers.filter((s) => s !== id)

      setSelectedUsers(newSelectedUsers)
    } else {
      setSelectedUsers((prev) => [...prev, id])
    }
  }

  const onConfirmButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedUsers.length === 0) return
    e.preventDefault()
    createNewChatRoom(
      { participantIds: selectedUsers },
      {
        onSuccess: (response) => {
          const { roomId } = response.data
          void navigate(`/chat/${roomId}`)
          setOpen(false)
        },
      },
    )
  }

  useEffect(() => {
    if (open) {
      const user = getAuthUser()

      const getBoardMemberData = async () => {
        try {
          const response = await getBoardMember({ boardId: Number(projectId) })
          setBoardMember(response.data.filter((m) => m.userId !== Number(user?.id)))
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
      <AlertDialogTrigger className="cursor-pointer self-end">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg">
          <MessageSquarePlus className="h-6 w-6 text-zinc-800" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-none p-8">
        {isPending ? (
          <div className="flex items-center justify-center">
            <Spinner className="size-6" />
          </div>
        ) : (
          <>
            <AlertDialogHeader className="mb-8 flex flex-col gap-4">
              <AlertDialogTitle className="justify-start font-['Pretendard'] text-3xl leading-10 font-bold text-neutral-900">
                대화상대 선택
              </AlertDialogTitle>
              <AlertDialogDescription className="font-['Pretendard'] text-base leading-5 font-normal text-zinc-800">
                대화할 상대를 1명 이상 선택해 주세요.
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
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateNewChatRoomButton
