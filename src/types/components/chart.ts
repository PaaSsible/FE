import z from 'zod'

import { taskSchema } from '../entities/board/board.entities.schemas'

/**
 * @name 업무상태차트
 * @description 업무 상태 차트 데이터 스키마
 */
export const taskStatusChartItemSchema = z.object({
  status: taskSchema.shape.status,
  count: z.number(),
})

/**
 * @name 업무상태차트
 * @description 업무 상태 차트 스키마
 */
export const taskStatusChartDataSchema = z.object({
  completedRate: z.number(),
  total: z.number(),
  tasks: z.array(taskStatusChartItemSchema),
})

export const weeklyGoalAchievementSchema = z.object({
  weeklyGoalRate: z.number(),
})
