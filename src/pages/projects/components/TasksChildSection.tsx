import clsx from 'clsx'
import dayjs from 'dayjs'
import { Plus } from 'lucide-react'
import { useEffect, useState, type JSX } from 'react'

import { postTask } from '@/apis/task.api'
import Button from '@/components/atoms/Button'
import type { PostTask } from '@/types/apis/board/task.api.types'
import type { BoardMember, Task, TaskStatus } from '@/types/entities/board/board.entitites.types'
import { positionsArray } from '@/types/entities/recruit-post/recruitPost.schemas'
import type { Position } from '@/types/entities/recruit-post/recruitPost.types'

import { DueDatePicker } from './DueDatePicker'
import { MultiSelect, type MultiSelectOption } from './MultiSelect'

interface TasksChildSectionProps {
  tasks: Task[]
  status: TaskStatus
  members?: BoardMember[]
  projectId?: string
}

const taskStatusToTitleMap: Record<TaskStatus, string> = {
  PENDING: '해야 할 작업',
  ONGOING: '진행 중인 작업',
  COMPLETED: '완료된 작업',
}

const taskStatusToColorMap: Record<TaskStatus, string> = {
  PENDING: 'bg-zinc-300',
  ONGOING: 'bg-indigo-600',
  COMPLETED: 'bg-green-500',
}

const TasksChildSection = ({
  tasks,
  status,
  members,
  projectId,
}: TasksChildSectionProps): JSX.Element => {
  const [title, setTitle] = useState<string>('')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [selectedMembers, setSelectedMembers] = useState<BoardMember['userId'][]>([])
  const [selectedPositions, setSelectedPositions] = useState<Position['id'][]>([])
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true)
  const [isNewTaskFormVisible, setIsNewTaskFormVisible] = useState<boolean>(false)

  const membersToMultiSelectOptions: MultiSelectOption[] = members
    ? members.map((m, _) => ({
        label: m.userName,
        value: m.userName,
      }))
    : []
  const positionsToMultiSelectOptions: MultiSelectOption[] = positionsArray.map((position) => ({
    label: position,
    value: position,
  }))

  const handleSelectedMembers = (selectedNames: string[]) => {
    if (!members) return
    const selected = members.filter((m) => selectedNames.includes(m.userName)).map((m) => m.userId)
    setSelectedMembers(selected)
  }

  const handleSelectedPostions = (selectedPositions: string[]) => {
    const positionWithId = positionsArray.map((p, index) => ({ id: index + 1, name: p }))
    const selected = positionWithId
      .filter((p) => selectedPositions.includes(p.name))
      .map((p) => p.id)
    setSelectedPositions(selected)
  }

  const handleNewTaskAdd = async () => {
    try {
      const body: PostTask['Body'] = {
        title,
        dueDate: String(dueDate),
        assigneeIds: selectedMembers,
        positionIds: selectedPositions,
      }
      const response = await postTask({ boardId: Number(projectId) }, body)
      setIsNewTaskFormVisible(false)
      setTitle('')
      setDueDate(undefined)
      setSelectedMembers([])
      setSelectedPositions([])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (title && dueDate && selectedMembers && selectedPositions) setIsSubmitButtonDisabled(false)
    else setIsSubmitButtonDisabled(true)
  }, [title, dueDate, selectedMembers, selectedPositions])

  return (
    <div className="item-start mt-6 flex flex-1/3 flex-col rounded-lg bg-zinc-100 px-3 pt-4">
      <span className="mb-[1.875rem] inline-flex items-center justify-start gap-2.5 font-['Pretendard'] text-lg leading-relaxed font-semibold text-zinc-900 opacity-80">
        <div className={clsx('h-3.5 w-3.5 rounded-full', taskStatusToColorMap[status])} />
        {taskStatusToTitleMap[status]}
      </span>

      <ul className="flex flex-col gap-2">
        {tasks.map((task, _) => {
          const dueDate = dayjs(task.dueDate).format('YYYY년 MM월 DD일')
          return (
            <li
              key={task.id}
              className="flex w-full flex-col items-start gap-[2.125rem] rounded bg-white px-3 pt-[0.6875rem] pb-3"
            >
              <div className="justify-center text-left text-base leading-normal font-semibold text-zinc-900 opacity-80">
                {task.title}
              </div>
              <div className="flex flex-col items-start gap-1">
                <div className="text-sm leading-tight font-medium text-zinc-900 opacity-80">
                  {dueDate}까지
                </div>

                <div className="flex flex-wrap">
                  {task.assignees.map((assignee, index) => (
                    <span
                      key={assignee.userId}
                      className="text-sm leading-tight font-normal text-zinc-900 opacity-50"
                    >
                      {assignee.name}
                      {!(index == task.assignees.length - 1) && ','}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  {task.positions.map((position, index) => (
                    <span
                      key={index}
                      className="outline-locallit-red-500 inline-flex items-center justify-center rounded-lg px-1.5 py-px font-['Pretendard'] text-sm leading-tight font-semibold text-zinc-900 opacity-80 outline-1 outline-offset-[-1px]"
                    >
                      {position}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          )
        })}
        {isNewTaskFormVisible && (
          <li className="flex flex-col rounded bg-white px-3 py-3">
            <input
              placeholder="해야할 작업을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={clsx(
                'mb-[1.125rem] h-6 w-64 text-base leading-normal font-semibold outline-none',
                { 'text-zinc-900 opacity-50': !title, 'text-black': title },
              )}
            />
            <DueDatePicker date={dueDate} setDate={setDueDate} />
            <MultiSelect
              options={membersToMultiSelectOptions}
              onValueChange={(value: string[]) => handleSelectedMembers(value)}
              placeholder="담당자 추가"
            />
            <MultiSelect
              options={positionsToMultiSelectOptions}
              onValueChange={(value: string[]) => handleSelectedPostions(value)}
              placeholder="파트 선택"
            />
            <div className="flex justify-end">
              <Button disabled={isSubmitButtonDisabled} onClick={() => void handleNewTaskAdd()}>
                등록
              </Button>
            </div>
          </li>
        )}
      </ul>

      {status === 'PENDING' && (
        <button
          onClick={() => setIsNewTaskFormVisible(true)}
          className="mt-4 flex cursor-pointer items-center justify-start gap-2.5"
        >
          <Plus className="h-5 w-5" />
          <span className="text-base leading-normal font-semibold text-zinc-900 opacity-80">
            작업 추가하기
          </span>
        </button>
      )}
    </div>
  )
}

export default TasksChildSection
