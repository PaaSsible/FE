import z from 'zod'

import type {
  taskStatusChartItemSchema,
  taskStatusChartDataSchema,
  weeklyGoalAchievementSchema,
} from './chart.schemas'

export type TaskStatusChartItem = z.infer<typeof taskStatusChartItemSchema>
export type TaskStatusChartData = z.infer<typeof taskStatusChartDataSchema>
export type WeeklyGoalAchievement = z.infer<typeof weeklyGoalAchievementSchema>
