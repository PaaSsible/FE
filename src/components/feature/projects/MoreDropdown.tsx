import { MoreVertical } from 'lucide-react'
import { useState, type JSX, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'storybook/internal/preview-api'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import ProjectDeleteButton from './ProjectDeleteButton'

interface MoreDropdownProps {
  projectId: number
}

const MoreDropdown = ({ projectId }: MoreDropdownProps): JSX.Element => {
  const navigate = useNavigate()

  const onEditButton = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    void navigate(`${projectId}/edit`)
  }
  const onDeleteButton = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const onWithdrawalButton = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <MoreVertical className="h-6 w-6 opacity-60 outline-zinc-900" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-10 inline-flex w-40 flex-col items-start justify-start overflow-hidden rounded border-none bg-neutral-400">
        <DropdownMenuItem
          onClick={onEditButton}
          className="w-full justify-start px-5 py-2.5 font-['Inter'] text-base leading-normal font-normal text-white"
        >
          수정
        </DropdownMenuItem>
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <ProjectDeleteButton boardId={projectId} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onWithdrawalButton}
          className="w-full justify-start px-5 py-2.5 font-['Inter'] text-base leading-normal font-normal text-white"
        >
          나가기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MoreDropdown
