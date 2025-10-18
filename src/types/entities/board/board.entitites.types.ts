import z from 'zod'

import type {
  activityTypeArray,
  boardMemberSchema,
  boardSchema,
  boardStatusArray,
  commentSchema,
  detailTypeArray,
  linkSchema,
  meetingSchema,
  taskSchema,
  taskStatusArray,
} from './board.entities.schemas'

export type BoardStatus = (typeof boardStatusArray)[number]
export type ActivityType = (typeof activityTypeArray)[number]
export type DetailType = (typeof detailTypeArray)[number]
export type Board = z.infer<typeof boardSchema>
export type BoardMember = z.infer<typeof boardMemberSchema>
export type Link = z.infer<typeof linkSchema>
export type TaskStatus = z.infer<typeof taskStatusArray>
export type Task = z.infer<typeof taskSchema>
export type Comment = z.infer<typeof commentSchema>
export type Meeting = z.infer<typeof meetingSchema>
