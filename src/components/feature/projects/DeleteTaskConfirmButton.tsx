import { Trash } from 'lucide-react'
import { useState, type JSX } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

import Button from '@/components/atoms/Button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useDeleteTask } from '@/queries/task.queries'
import type { Task } from '@/types/entities/board/board.entitites.types'

interface DeleteTaskConfirmButtonProps {
  taskId: Task['id']
}
const DeleteTaskConfirmButton = ({ taskId }: DeleteTaskConfirmButtonProps): JSX.Element => {
  const { projectId } = useParams<{ projectId: string }>()
  const [open, setOpen] = useState<boolean>(false)
  const { mutate: deleteTask } = useDeleteTask({ boardId: Number(projectId), taskId })
  const onConfirmButton = () => {
    deleteTask(
      { boardId: Number(projectId), taskId },
      {
        onSuccess: () => {
          toast.success('작업이 삭제되었습니다.')
        },
        onError: () => {
          toast.error('처리 중 오류가 발생하였습니다.')
        },
      },
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="z-1 cursor-pointer text-zinc-900 underline opacity-80"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Trash className="h-6 w-6 text-gray-500" />
      </AlertDialogTrigger>
      <AlertDialogContent
        className="rounded-2xl border-none p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="justify-start font-['Pretendard'] text-3xl leading-10 font-bold break-normal text-neutral-900">
            작업을 삭제하시겠어요?
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

export default DeleteTaskConfirmButton
