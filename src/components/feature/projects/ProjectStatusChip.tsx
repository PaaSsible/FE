import clsx from 'clsx'
import type { JSX } from 'react'

import { statusEngToKorMap } from '@/config/converters/statusEngToKorMap'
import type { BoardStatus } from '@/types/entities/board/board.entitites.types'

interface ProjectStatusChipProps {
  status: BoardStatus
}

const ProjectStatusChip = ({ status = 'ONGOING' }: ProjectStatusChipProps): JSX.Element => {
  return (
    <div
      className={clsx(
        'flex h-6 w-16 items-center justify-center rounded-[37px] text-base font-semibold text-white',
        status === 'ONGOING' ? 'bg-green-500' : 'bg-locallit-red-500',
      )}
    >
      {statusEngToKorMap[status]}
    </div>
  )
}
export default ProjectStatusChip
