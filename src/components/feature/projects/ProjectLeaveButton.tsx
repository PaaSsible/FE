import { AxiosError } from 'axios'
import { useState, type JSX } from 'react'
import { toast } from 'sonner'
import { ZodError } from 'zod'

import { deleteBoardMember } from '@/apis/board.api'
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

interface ProjectLeaveButtonProps {
  boardId: number
}
const ProjectLeaveButton = ({ boardId }: ProjectLeaveButtonProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const onConfirmButton = async () => {
    try {
      await deleteBoardMember({ boardId })
      window.location.reload()
    } catch (error) {
      if (error instanceof ZodError) console.log('타입에러', error)
      else if (error instanceof AxiosError) {
        console.log('네트워크 에러', error)
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
          나가기
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent
        className="rounded-2xl border-none p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader className="mb-8 flex flex-col gap-4">
          <AlertDialogTitle className="justify-start font-['Pretendard'] text-3xl leading-10 font-bold break-words text-neutral-900">
            프로젝트 보드를 탈퇴하시겠어요?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-['Pretendard'] text-base leading-5 font-normal break-keep text-zinc-800">
            프로젝트 보드를 탈퇴한 후 지원공고를 통해서 다시 입장할 수 있습니다.
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

export default ProjectLeaveButton
