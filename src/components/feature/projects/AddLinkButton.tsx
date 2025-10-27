import { AxiosError } from 'axios'
import { useState, type FormEvent, type JSX } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ZodError } from 'zod'

import { postExternalLink } from '@/apis/task.api'
import Button from '@/components/atoms/Button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
// eslint-disable-next-line import/extensions
import { Input } from '@/components/ui/input'

const AddLinkButton = (): JSX.Element => {
  const { projectId } = useParams<{ projectId: string }>()
  const [open, setOpen] = useState<boolean>(false)
  const onSubmitButton = (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const url = formData.get('url') as string
      const label = formData.get('label') as string
      toast.promise(
        () =>
          postExternalLink(
            { boardId: Number(projectId) },
            {
              name: label,
              url,
            },
          ),
        {
          loading: '처리 중...',
          success: '링크가 추가되었습니다.',
          error: '처리 중 오류가 발생하였습니다.',
        },
      )
    } catch (error) {
      if (error instanceof ZodError) console.error('타입에러', error)
      if (error instanceof AxiosError) console.error('네트워크에러', error)
    } finally {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="absolute right-0 cursor-pointer self-end text-lg leading-7 font-semibold text-zinc-900 underline opacity-80">
        추가하기
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-none p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="justify-start font-['Pretendard'] text-3xl leading-10 font-bold text-neutral-900">
            바로가기 추가
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden"></AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={(e) => void onSubmitButton(e)}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel
                    htmlFor="url"
                    className="font-['Pretendard'] text-base leading-5 font-normal text-neutral-900"
                  >
                    웹 주소
                  </FieldLabel>
                  <Input
                    id="url"
                    name="url"
                    placeholder="예: www.PaaSsible.com"
                    required
                    className="h-11 text-base leading-5 font-normal placeholder:text-stone-500 focus:text-black"
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel
                    htmlFor="label"
                    className="font-['Pretendard'] text-base leading-5 font-normal text-neutral-900"
                  >
                    이름
                  </FieldLabel>
                  <Input
                    id="label"
                    name="label"
                    placeholder="예: 팀 피그마 파일"
                    required
                    className="h-11 text-base leading-5 font-normal placeholder:text-stone-500 focus:text-black"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field>
              <AlertDialogFooter className="flex gap-4">
                <AlertDialogCancel asChild>
                  <Button variant="secondary" className="flex-1">
                    취소
                  </Button>
                </AlertDialogCancel>
                <Button variant="primary" type="submit" className="flex-1">
                  추가
                </Button>
              </AlertDialogFooter>
            </Field>
          </FieldGroup>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddLinkButton
