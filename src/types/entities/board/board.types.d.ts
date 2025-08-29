import type { boardSchema, linkSchema, taskSchema, taskStatusArray } from './board.schemas'

export type Board = z.infer<typeof boardSchema>
export type Link = z.infer<typeof linkSchema>
export type TaskStatus = (typeof taskStatusArray)[number]
export type Task = z.infer<typeof taskSchema>
