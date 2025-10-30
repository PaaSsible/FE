import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type JSX } from 'react'

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'

//읽음 선택 시 읽은 팀원 보는 다이얼로그
const ViewChatRoomReadMemberButton = (): JSX.Element => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <ChevronRight className="h-4 w-4" />
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-none p-8">
        <AlertDialogHeader className="mb-8 flex flex-col gap-4">
          <AlertDialogTitle className="flex items-center justify-start gap-2.5 font-['Pretendard'] text-3xl leading-10 font-bold text-neutral-900">
            <AlertDialogCancel asChild>
              <button type="button" className="flex border-none">
                <ChevronLeft className="h-10 w-10 text-stone-500" />
              </button>
            </AlertDialogCancel>
            읽은 팀원 보기
          </AlertDialogTitle>
          <AlertDialogDescription className="font-['Pretendard'] text-base leading-5 font-normal text-zinc-800">
            현재 대화에 참여 중인 팀원 중 2명이 읽었습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-1">
          <div>박우진</div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ViewChatRoomReadMemberButton
