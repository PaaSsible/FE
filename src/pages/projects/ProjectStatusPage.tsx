import { AxiosError } from 'axios'
import clsx from 'clsx'
import { useEffect, useState, type JSX } from 'react'
import { useParams } from 'react-router-dom'
import { ZodError } from 'zod'

import { getContributionScores } from '@/apis/contribution.api'
import { getExternalLinks, getTaskStatusChart, getWeeklyGoalAchievement } from '@/apis/task.api'
import { SemiDoughnutChart } from '@/components/ui/semi-doughnut-chart'
import type {
  TaskStatusChartData,
  WeeklyGoalAchievement,
} from '@/types/components/chart/chart.types'
import type { ContributionScore } from '@/types/components/contributionScore/contributionScore.types'
import type { Link } from '@/types/entities/board/board.entitites.types'

import AddLinkButton from './components/AddLinkButton'
import ExternalLinkItem from './components/ExternalLinkItem'
import ProjectHeader from './components/ProjectHeader'
import QuestionTooltip from './components/QuestionTooltip'
import Separator from './components/Separator'
import { TaskStatusPieChart } from './components/TaskStatusPieChart'
import { WeeklyGoalAchievementProgressBar } from './components/WeeklyAchievementProgressBar'
import { DataTable } from './components/contributionTable/DataTable'
import { columns } from './components/contributionTable/columns'

interface StatusChartLabelWithValueProps {
  label: '완료된 작업' | '진행 중인 작업' | '해야 할 작업'
  labelColor: string
  value: number
}
const StatusChartLabelWithValue = ({
  label = '완료된 작업',
  value,
  labelColor = '#FF4BB7',
}: StatusChartLabelWithValueProps): JSX.Element => {
  return (
    <div className="flex items-center justify-start gap-2">
      <div className={clsx('mt-0.5 h-3.5 w-3.5 self-start rounded-full', labelColor)} />
      <div className="flex flex-col items-start justify-start">
        <span className="text-sm leading-6 font-semibold text-neutral-600">{label}</span>

        <span className="text-sm leading-6 font-normal text-neutral-600">{value}개</span>
      </div>
    </div>
  )
}

type TaskStatus = TaskStatusChartData['tasks'][number]['status']
const renderOrder: TaskStatus[] = ['COMPLETED', 'ONGOING', 'PENDING']
const taskStatusToStatusChartLabelMap: Record<
  TaskStatus,
  Omit<StatusChartLabelWithValueProps, 'value'>
> = {
  COMPLETED: {
    label: '완료된 작업',
    labelColor: 'bg-locallit-red-500',
  },
  ONGOING: {
    label: '진행 중인 작업',
    labelColor: 'bg-blue-700',
  },
  PENDING: {
    label: '해야 할 작업',
    labelColor: 'bg-zinc-300',
  },
}

export default function ProjectStatusPage(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>()
  const [taskStatusChartData, setTaskStatusChartData] = useState<TaskStatusChartData | undefined>()
  const [weeklyGoalAchievementData, setWeeklyGoalAchievementData] = useState<
    WeeklyGoalAchievement | undefined
  >()
  const [contributionData, setContributionData] = useState<ContributionScore[] | undefined>()
  const [externalLinks, setExternalLinks] = useState<Link[] | undefined>()
  useEffect(() => {
    //작업상태 시각화
    const getTaskStatusData = async () => {
      try {
        const response = await getTaskStatusChart({ boardId: Number(projectId) })
        const sortedData = response.data.tasks
          .slice() // 원본 배열 변형 방지
          .sort((a, b) => renderOrder.indexOf(a.status) - renderOrder.indexOf(b.status))

        setTaskStatusChartData({
          ...response.data,
          tasks: sortedData, // 정렬된 배열로 교체
        })
      } catch (error) {
        if (error instanceof ZodError) console.error('타입 오류', error)
        else if (error instanceof AxiosError) console.error('네트워크 오류', error)
      }
    }

    void getTaskStatusData()

    //주간 목표 달성률
    const getWeeklyGoalAchievementData = async () => {
      try {
        const response = await getWeeklyGoalAchievement({ boardId: Number(projectId) })
        setWeeklyGoalAchievementData(response.data)
      } catch (error) {
        if (error instanceof ZodError) console.error('타입 에러', error)
        if (error instanceof AxiosError) console.error('네트워크 에러', error)
      }
    }
    void getWeeklyGoalAchievementData()

    // 팀원 기여도
    const getContributionData = async () => {
      try {
        const response = await getContributionScores({ boardId: Number(projectId) })
        setContributionData(response.data)
      } catch (error) {
        if (error instanceof ZodError) console.error('타입 에러', error)
        if (error instanceof AxiosError) console.error('네트워크 에러', error)
      }
    }
    void getContributionData()

    // 링크
    const getLinks = async () => {
      try {
        const response = await getExternalLinks({ boardId: Number(projectId) })
        setExternalLinks(response.data)
      } catch (error) {
        if (error instanceof ZodError) console.error('타입 에러', error)
        if (error instanceof AxiosError) console.error('네트워크 에러', error)
      }
    }
    void getLinks()
  }, [projectId])

  return (
    <div className="flex min-h-full flex-col">
      <ProjectHeader title="작업 현황" />
      <section className="mb-20 flex h-80 gap-8">
        {/* 작업상태 시각화 */}
        <div className="flex flex-1/2 flex-col rounded-2xl bg-gray-100 px-8 py-5">
          <div className="mb-4 flex items-center justify-start gap-2.5">
            <span className="text-xl leading-8 font-semibold text-zinc-900 opacity-80">
              작업상태 시각화
            </span>
            <QuestionTooltip tipContent="상태별 작업 수를 시각화합니다." />
          </div>
          {taskStatusChartData && (
            <div className="flex w-full justify-between">
              <div className="flex flex-1/3 flex-col gap-3 self-end">
                {taskStatusChartData.tasks.map((t, index) => {
                  const property = taskStatusToStatusChartLabelMap[t.status]
                  return (
                    <StatusChartLabelWithValue
                      key={index}
                      label={property.label}
                      labelColor={property.labelColor}
                      value={t.count}
                    />
                  )
                })}
              </div>
              <TaskStatusPieChart data={taskStatusChartData} />
            </div>
          )}
        </div>

        <div className="flex flex-1/2 flex-col gap-[1.3125rem]">
          {/* 전체 작업 진행률 */}
          <div className="flex flex-col rounded-2xl bg-gray-100 px-8 py-5">
            <div className="mb-4 flex items-center justify-start gap-2.5">
              <span className="text-xl leading-8 font-semibold text-zinc-900 opacity-80">
                전체 작업 진행률
              </span>
              <QuestionTooltip tipContent="전체 작업 중 완료된 비율을 표시해 전체 진척도를 보여줍니다." />
            </div>

            {taskStatusChartData && (
              <div className="flex w-full justify-between">
                <div className="flex flex-1/4 flex-col gap-[4.87px] self-end">
                  <div className="text-base leading-6 font-semibold text-black">
                    {taskStatusChartData.tasks.filter((t) => t.status === 'COMPLETED').length}개
                    완료
                  </div>
                  <Separator />
                  <div className="text-xs leading-5 font-normal text-slate-500">
                    전체 작업 {taskStatusChartData.total}개
                  </div>
                </div>

                <SemiDoughnutChart data={taskStatusChartData} />
              </div>
            )}
          </div>
          {/* 주간 목표 달성률 */}
          <div className="flex flex-col rounded-2xl bg-gray-100 px-8 py-5">
            <div className="mb-4 flex justify-between">
              <div className="flex items-center justify-start gap-2.5">
                <span className="text-xl leading-8 font-semibold text-zinc-900 opacity-80">
                  주간 목표 달성률
                </span>
                <QuestionTooltip tipContent="이번 주에 추가된 작업 대비 완료 비율을 표시해 목표 달성 현황을 보여줍니다." />
              </div>

              <span className="text-lg leading-6 font-semibold text-black opacity-50">
                {weeklyGoalAchievementData?.weeklyGoalRate}%
              </span>
            </div>

            {weeklyGoalAchievementData && (
              <WeeklyGoalAchievementProgressBar value={weeklyGoalAchievementData.weeklyGoalRate} />
            )}
          </div>
        </div>
      </section>

      <ProjectHeader title="팀원 기여도">
        <QuestionTooltip tipContent="해당 프로젝트에 각 팀원이 기여한 정도를 표시합니다. 작업률은 할당된 작업 대비 완료된 작업의 비율이 표시되며 회의 참석률은 전체 회의 중 참석한 회의를 비율로 표시합니다. 커뮤니케이션 빈도는 전체 채팅 대비 각 팀원이 보낸 채팅으로 계산되며 이 모든 활동을 조합해 기여도가 산출됩니다." />
      </ProjectHeader>
      <section className="mb-20 flex w-full">
        {contributionData && <DataTable columns={columns} data={contributionData} />}
      </section>

      <ProjectHeader title="바로가기">
        <AddLinkButton />
      </ProjectHeader>
      <section className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl bg-gray-100 px-8 py-5">
        {externalLinks && externalLinks.map((e) => <ExternalLinkItem key={e.id} item={e} />)}
      </section>
    </div>
  )
}
