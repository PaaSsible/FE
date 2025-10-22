import { ChevronRight } from 'lucide-react'
import type { JSX } from 'react'
import { useNavigate } from 'react-router-dom'

import { activityTypeEngToKorMap } from '@/config/converters/activityTypeEngToKorMap'
import { detailTypeEngToKorMap } from '@/config/converters/detailTypeEngToKorMap'
import type { Board } from '@/types/entities/board/board.entitites.types'

import MoreDropdown from './MoreDropdown'
import ProjectStatusChip from './ProjectStatusChip'

interface ProjectListItemProps {
  project: Board
}

const ProjectListItem = ({ project }: ProjectListItemProps): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => void navigate(`${project.boardId}/board`)}
      className="flex h-60 cursor-pointer flex-col items-start justify-between rounded-[20px] bg-zinc-100 px-8 py-7"
    >
      <div className="gap-[0.4375rem]">
        <ProjectStatusChip status={project.status} />
        <div className="justify-center text-2xl leading-9 font-semibold text-zinc-900 opacity-90">
          {project.name}
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-0.5">
        <div className="justify-center text-base leading-normal font-bold text-zinc-900">
          관리자: {project.owner}
        </div>
        <div className="flex w-full justify-between">
          <div className="flex gap-0.5">
            <span className="justify-center text-base leading-normal font-semibold text-zinc-900 opacity-60">
              {activityTypeEngToKorMap[project.activityType]}
            </span>
            {(project.activityType == 'CONTEST' || project.activityType == 'STUDY') && (
              <>
                <ChevronRight className="h-6 w-6 opacity-60 outline-zinc-900" />
                <span className="justify-center text-base leading-normal font-semibold text-zinc-900 opacity-60">
                  {detailTypeEngToKorMap[project.detailType]}
                </span>
              </>
            )}
          </div>

          <MoreDropdown projectId={project.boardId} />
        </div>
      </div>
    </div>
  )
}
export default ProjectListItem
