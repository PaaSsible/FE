import { EllipsisVertical } from 'lucide-react'
import { useState, type JSX } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import InviteChatRoomButton from '@/pages/projects/component/InviteChatRoomButton'
import LeaveChatRoomButton from '@/pages/projects/component/LeaveChatRoomButton'

interface ChatRoomMoreButtonProps {
  projectId: string | undefined //라우트에서 가져오는 거임
}
const ChatRoomMoreButton = ({ projectId }: ChatRoomMoreButtonProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DropdownMenuTrigger>
        <EllipsisVertical className="h-8 w-8 text-stone-600" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="z-10 inline-flex w-40 flex-col items-start justify-start overflow-hidden rounded border-none bg-neutral-400"
      >
        <DropdownMenuItem asChild>
          <InviteChatRoomButton projectId={projectId} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <LeaveChatRoomButton />
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onClick={onReportAndLeaveButton}
          className="w-full justify-start px-5 py-2.5 font-['Inter'] text-base leading-normal font-normal text-white"
        >
          신고하고 나가기
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ChatRoomMoreButton
