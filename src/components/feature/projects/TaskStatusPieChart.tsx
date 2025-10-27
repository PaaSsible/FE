import type { JSX } from 'react'
import { Label, Pie, PieChart } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { TaskStatusChartData } from '@/types/components/chart/chart.types'

const chartConfig = {
  PENDING: {
    label: '대기',
    color: '#D9D9D9',
  },
  ONGOING: {
    label: '진행중',
    color: '#1565C0',
  },
  COMPLETED: {
    label: '완료',
    color: '#FF6348',
  },
} satisfies ChartConfig

interface TaskStatusPieChartProps {
  data: TaskStatusChartData
}

export function TaskStatusPieChart({ data }: TaskStatusPieChartProps): JSX.Element {
  const chartData = data.tasks.map((task) => ({
    name: chartConfig[task.status].label,
    value: task.count,
    fill: chartConfig[task.status].color,
  }))

  return (
    <div className="flex flex-2/3 flex-col">
      <ChartContainer config={chartConfig} className="flex aspect-square max-h-56">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} dy="-0.6em" textAnchor="middle" dominantBaseline="middle">
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="text-base leading-7 font-medium text-neutral-900"
                      >
                        달성률
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="text-center text-2xl leading-7 font-bold text-neutral-900"
                      >
                        {`${data.completedRate}%`}
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
