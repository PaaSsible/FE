import z from 'zod'

import type {
  activityTypeArray,
  boardMemberSchema,
  boardSchema,
  boardStatusArray,
  detailTypeArray,
  linkSchema,
  meetingSchema,
  taskSchema,
  taskStatusArray,
} from './board.entities.schemas'

export type BoardStatus = z.infer<typeof boardStatusArray>
export type ActivityType = z.infer<typeof activityTypeArray>
export type detailType = z.infer<typeof detailTypeArray>
export type Board = z.infer<typeof boardSchema>
export type BoardMember = z.infer<typeof boardMemberSchema>
export type Link = z.infer<typeof linkSchema>
export type TaskStatus = z.infer<typeof taskStatusArray>
export type Task = z.infer<typeof taskSchema>
export type Meeting = z.infer<typeof meetingSchema>
