import type { JSX } from 'react'
import { Label, Pie, PieChart } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type {
  TaskStatusChartData,
  WeeklyGoalAchievement,
} from '@/types/components/chart/chart.types'

const chartConfig = {
  PENDING: {
    label: '대기',
    color: '#D9D9D9',
  },
  COMPLETED: {
    label: '완료',
    color: '#FF6348',
  },
} satisfies ChartConfig

interface SemiDoughnutChartProps {
  data: TaskStatusChartData
}

export function SemiDoughnutChart({ data }: SemiDoughnutChartProps): JSX.Element {
  const completedTaskNum = data.tasks.find((t) => t.status === 'COMPLETED')?.count ?? 0
  const totalTaskNum = data.total
  const completedRate = (completedTaskNum / totalTaskNum) * 100
  const chartData = [
    { name: 'COMPLETED', value: completedRate, fill: chartConfig['COMPLETED'].color },
    { name: 'PENDING', value: 100 - completedRate, fill: chartConfig['PENDING'].color },
  ]

  return (
    <div className="flex h-29 flex-3/4 flex-col overflow-hidden">
      <ChartContainer config={chartConfig} className="flex aspect-square max-h-56">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            nameKey="name"
            innerRadius={80}
            outerRadius={110}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} dy="-2.0em" textAnchor="middle" dominantBaseline="top">
                      <tspan
                        x={viewBox.cx || 0}
                        y={(viewBox.cy || 0) + 24}
                        className="text-2xl font-bold text-zinc-800"
                      >
                        {`${completedRate}%`}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}
