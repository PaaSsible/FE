import { AxiosError } from 'axios'
import { X } from 'lucide-react'
import { useState, type MouseEvent, type JSX } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ZodError } from 'zod'

import { deleteExternalLink } from '@/apis/task.api'
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

interface DeleteLinkButtonProps {
  id: number
}
const DeleteLinkButton = ({ id }: DeleteLinkButtonProps): JSX.Element => {
  const { projectId } = useParams<{ projectId: string }>()
  const [open, setOpen] = useState<boolean>(false)
  const onConfirmButton = (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault()
      toast.promise(() => deleteExternalLink({ boardId: Number(projectId), shortcutId: id }), {
        loading: '처리 중...',
        success: '링크를 삭제하였습니다.',
        error: '처리 중 오류가 발생하였습니다.',
      })
    } catch (error) {
      if (error instanceof ZodError) console.error('타입에러', error)
      if (error instanceof AxiosError) console.error('네트워크에러', error)
    } finally {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="cursor-pointer self-end">
        <X className="h-6 w-6 text-zinc-800" />
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-none p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="justify-start font-['Pretendard'] text-3xl leading-10 font-bold text-neutral-900">
            바로가기 삭제
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden"></AlertDialogDescription>
        </AlertDialogHeader>
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
              삭제
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteLinkButton
