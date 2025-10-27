import { AxiosError } from 'axios'
import { useEffect, useState, type JSX } from 'react'
import { useParams } from 'react-router-dom'
import { ZodError } from 'zod'

import { getBoardDetail, getBoardMember, patchBoardMember } from '@/apis/board.api'
import { getTaskList } from '@/apis/task.api'
import SearchBar from '@/components/common/SearchBar'
import { type Task, type BoardMember } from '@/types/entities/board/board.entitites.types'
import type { Position } from '@/types/entities/recruit-post/recruitPost.types'

import PositionSelectModal from './components/PositionSelectModal'
import TasksChildSection from './components/TasksChildSection'

// interface ProjectBoardPageProps {
//   projectTitle: string
// }

export default function ProjectBoardPage(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>()
  // 포지션 보유 여부 체크
  const [isPositionSelectModalVisible, setIsPositionSelectModalVisible] = useState<boolean>(false)
  const [members, setMembers] = useState<BoardMember[]>()
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchValue, setSearchValue] = useState<string>('')

  const onPositionSelectConfirmButton = async (position: Position) => {
    try {
      await patchBoardMember({ boardId: Number(projectId) }, { positionId: position.id })
      // 새로고침 필요
      setIsPositionSelectModalVisible(false)
    } catch (error) {
      if (error instanceof ZodError) console.error('타입에러')
      else if (error instanceof AxiosError) console.error('네트워크에러')
    }
  }

  useEffect(() => {
    const getUserPositionData = async () => {
      try {
        const data = await getBoardDetail({ boardId: Number(projectId) }).then((res) => res.data)
        const positionId = data.positionId
        if (positionId === null) {
          setIsPositionSelectModalVisible(true)
        }
      } catch (error) {
        if (error instanceof ZodError) console.error('타입에러', error)
        else if (error instanceof AxiosError) console.error('네트워크 에러', error)
      }
    }
    void getUserPositionData()

    const getProjectMember = async () => {
      try {
        const response = await getBoardMember({ boardId: Number(projectId) })
        setMembers(response.data)
      } catch (error) {
        if (error instanceof ZodError) console.error('타입에러', error)
        else if (error instanceof AxiosError) console.error('네트워크 에러', error)
      }
    }
    void getProjectMember()

    const getProjectTasks = async () => {
      try {
        const response = await getTaskList({ boardId: Number(projectId) })
        setTasks(response.data)
        setFilteredTasks(response.data)
      } catch (error) {
        if (error instanceof ZodError) console.error('타입에러', error)
        else if (error instanceof AxiosError) console.error('네트워크 에러', error)
      }
    }
    void getProjectTasks()
  }, [projectId])

  useEffect(() => {
    if (!searchValue) {
      setFilteredTasks(tasks)
      return
    }

    const lowerSearch = searchValue.toLowerCase()

    const filtered = tasks.filter((task) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const flattenObjectValues = (obj: Record<string, any>): string[] => {
        return Object.values(obj).flatMap((value) => {
          if (value == null) return [] // null, undefined 무시
          if (typeof value === 'object' && !Array.isArray(value)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return flattenObjectValues(value)
          }
          if (Array.isArray(value)) {
            return value.flatMap((v) =>
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              typeof v === 'object' ? flattenObjectValues(v) : String(v),
            )
          }
          return [String(value)]
        })
      }
      return flattenObjectValues(task).some((v) => v.toLowerCase().includes(lowerSearch))
    })

    setFilteredTasks(filtered)
  }, [searchValue, tasks])

  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-9 flex items-center justify-between">
        <div className="font-['Pretendard'] text-3xl leading-10 font-semibold text-black">
          프로젝트 이름
        </div>

        <SearchBar value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      </div>

      <div className="flex -space-x-3">
        {members?.map(
          (member) =>
            member.profileImageUrl && (
              <img
                key={member.userId}
                src={member.profileImageUrl}
                alt={member.userName}
                className="h-11 w-11 rounded-full border-2 border-white bg-gray-400 object-cover"
              />
            ),
        )}
      </div>

      <section className="flex flex-1 gap-4 overflow-y-scroll rounded-lg">
        <TasksChildSection
          tasks={filteredTasks.filter((task) => task.status === 'PENDING')}
          status={'PENDING'}
          members={members}
          projectId={projectId}
        />
        <TasksChildSection
          tasks={filteredTasks.filter((task) => task.status === 'ONGOING')}
          status={'ONGOING'}
        />
        <TasksChildSection
          tasks={filteredTasks.filter((task) => task.status === 'COMPLETED')}
          status={'COMPLETED'}
        />
      </section>

      <PositionSelectModal
        isOpen={isPositionSelectModalVisible}
        title={'포지션을 선택해 주세요.'}
        description={
          '프로젝트 이름에서의 본인 포지션을 선택해 주세요. 포지션은 중간에 바꿀 수 없습니다.'
        }
        cancelLabel={'취소'}
        confirmLabel={'선택하기'}
        onCancel={() => setIsPositionSelectModalVisible(false)}
        onConfirm={(p: Position) => void onPositionSelectConfirmButton(p)}
      />
    </div>
  )
}
