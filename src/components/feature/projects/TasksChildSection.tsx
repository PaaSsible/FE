import clsx from 'clsx'
import dayjs from 'dayjs'
import { Plus } from 'lucide-react'
import { useEffect, useState, type JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { postTask } from '@/apis/task.api'
import Button from '@/components/atoms/Button'
import { Textarea } from '@/components/ui/textarea'
import { usePostTask } from '@/queries/task.queries'
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
  const [description, setDescription] = useState<string>('')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [selectedMembers, setSelectedMembers] = useState<BoardMember['userId'][]>([])
  const [selectedPositions, setSelectedPositions] = useState<Position['id'][]>([])
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true)
  const [isNewTaskFormVisible, setIsNewTaskFormVisible] = useState<boolean>(false)
  const { mutate: addTask } = usePostTask({ boardId: Number(projectId) })

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

  const navigate = useNavigate()

  const handleSelectedMembers = (selectedNames: string[]) => {
    if (!members) return
    const selected = members.filter((m) => selectedNames.includes(m.userName)).map((m) => m.userId)
    setSelectedMembers(selected)
  }

  const handleSelectedPositions = (selectedPositions: string[]) => {
    const positionWithId = positionsArray.map((p, index) => ({ id: index + 1, name: p }))
    const selected = positionWithId
      .filter((p) => selectedPositions.includes(p.name))
      .map((p) => p.id)
    setSelectedPositions(selected)
  }

  const handleNewTaskAdd = () => {
    try {
      const body: PostTask['Body'] = {
        title,
        description,
        dueDate: dayjs(dueDate).format('YYYY-MM-DD'),
        assigneeIds: selectedMembers,
        positionIds: selectedPositions,
      }
      addTask(body, {
        onSuccess: () => {
          setIsNewTaskFormVisible(false)
          setTitle('')
          setDescription('')
          setDueDate(undefined)
          setSelectedMembers([])
          setSelectedPositions([])
          toast.success('작업이 추가되었습니다.')
        },
        onError: () => {
          toast.error('작업 추가 중 오류가 발생했습니다.')
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleNewTaskAddCancel = () => {
    setIsNewTaskFormVisible(false)
    setTitle('')
    setDueDate(undefined)
    setSelectedMembers([])
    setSelectedPositions([])
  }

  useEffect(() => {
    if (title && dueDate && selectedMembers && selectedPositions) setIsSubmitButtonDisabled(false)
    else setIsSubmitButtonDisabled(true)
  }, [title, dueDate, selectedMembers, selectedPositions])

  return (
    <div className="item-start mt-6 flex flex-1/3 flex-col rounded-lg bg-zinc-100 px-3 py-4">
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
              onClick={() => void navigate(`${task.id}`)}
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
          <li className="flex flex-col gap-1 rounded bg-white px-3 py-3">
            <input
              placeholder="해야할 작업을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={clsx(
                'mb-[1.125rem] h-6 w-full text-base leading-normal font-semibold outline-none',
                { 'text-zinc-900 opacity-50': !title, 'text-black': title },
              )}
            />
            <Textarea
              placeholder="세부사항을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={clsx(
                'mb-[1.125rem] h-6 w-full text-base leading-normal font-semibold outline-none',
                { 'text-zinc-900 opacity-50': !description, 'text-black': description },
                'focus-visible:ring-0',
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
              onValueChange={(value: string[]) => handleSelectedPositions(value)}
              placeholder="파트 선택"
            />
            <div className="flex justify-end gap-1">
              <Button variant="secondary" onClick={() => handleNewTaskAddCancel()}>
                취소
              </Button>
              <Button disabled={isSubmitButtonDisabled} onClick={() => void handleNewTaskAdd()}>
                등록
              </Button>
            </div>
          </li>
        )}
      </ul>

      {status === 'PENDING' && !isNewTaskFormVisible && (
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
