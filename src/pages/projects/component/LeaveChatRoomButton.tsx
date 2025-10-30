import { AxiosError } from 'axios'
import { useState, type JSX } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ZodError } from 'zod'

import { deleteChatRoom } from '@/apis/chat.api'
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

const LeaveChatRoomButton = (): JSX.Element => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(false)

  const onLeaveButton = () => {
    try {
      toast.promise(() => deleteChatRoom({ roomId: Number(roomId) }), {
        loading: '처리 중...',
        success: () => {
          void navigate(`/projects`)
          return '채팅방이 삭제되었습니다.'
        },
        error: '처리 중 오류가 발생하였습니다.',
      })
    } catch (error) {
      if (error instanceof ZodError) console.error('타입에러', error)
      else if (error instanceof AxiosError) console.error('네트워크 에러', error)
      else console.error('기타 에러', error)
    } finally {
      setOpen(false)
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="w-full cursor-pointer justify-start px-5 py-2.5 text-start font-['Inter'] text-base leading-normal font-normal text-white">
        나가기
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-none p-8">
        <AlertDialogHeader className="mb-8 flex flex-col gap-4">
          <AlertDialogTitle className="justify-start font-['Pretendard'] text-3xl leading-10 font-bold text-neutral-900">
            채팅방을 나가시겠어요?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-['Pretendard'] text-base leading-5 font-normal text-zinc-800">
            나가면 대화 목록에서 이 채팅방이 사라지고, 지금까지의 대화 기록들이 전부 사라집니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-4">
          <AlertDialogCancel asChild>
            <Button variant="secondary" className="flex-1" onClick={() => void onLeaveButton()}>
              나가기
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="primary" type="submit" className="flex-1">
              취소
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LeaveChatRoomButton
