import { AxiosError } from 'axios'
import { useState, type JSX } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ZodError } from 'zod'

import { deleteBoard } from '@/apis/board.api'
import Button from '@/components/atoms/Button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'

interface ProjectDeleteButtonProps {
  boardId: number
}
const ProjectDeleteButton = ({ boardId }: ProjectDeleteButtonProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const onConfirmButton = async () => {
    try {
      await deleteBoard({ boardId })
      window.location.reload()
    } catch (error) {
      if (error instanceof ZodError) console.log('타입에러', error)
      else if (error instanceof AxiosError) {
        if (error.status === 403) toast.error('권한이 없습니다.')
        else console.log('네트워크 에러', error)
      } else console.log('기타에러', error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <AlertDialogTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <button className="w-full cursor-pointer justify-start px-5 py-2.5 text-start font-['Inter'] text-base leading-normal font-normal text-white">
          삭제
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent
        className="rounded-2xl border-none p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader className="mb-8 flex flex-col gap-4">
          <AlertDialogTitle className="justify-start font-['Pretendard'] text-3xl leading-10 font-bold break-words text-neutral-900">
            프로젝트 보드를 삭제하시겠어요?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-['Pretendard'] text-base leading-5 font-normal break-keep text-zinc-800">
            삭제 요청이 승인되면 팀원에게 알림이 전송되며 7일 후 보드가 완전히 삭제됩니다. 삭제된
            내용은 복구가 불가능하며 이 작업은 되돌릴 수 없습니다. 삭제를 진행하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-4">
          <AlertDialogCancel asChild>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              취소
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="primary"
              type="submit"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                void onConfirmButton()
              }}
            >
              삭제하기
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ProjectDeleteButton
