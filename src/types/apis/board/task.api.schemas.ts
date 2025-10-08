import z from 'zod'

import {
  taskStatusChartDataSchema,
  weeklyGoalAchievementSchema,
} from '@/types/components/chart/chart.schemas'
import {
  boardSchema,
  commentSchema,
  linkSchema,
  taskSchema,
} from '@/types/entities/board/board.entities.schemas'
import { userSchema } from '@/types/entities/user/user.schemas'

/**
 * @name 업무목록조회
 * @method GET
 * @path `/boards/{boardId}/tasks`
 * @description 업무 목록을 조회하는 API의 스키마
 */
export const getTaskListSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(taskSchema),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무생성
 * @method POST
 * @path `/boards/{boardId}/tasks`
 * @description 업무 생성하는 API의 스키마
 */
export const postTaskSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId }),
  body: taskSchema
    .pick({ title: true, dueDate: true })
    .extend({ assigneeIds: z.array(userSchema.shape.id), positionIds: z.array(z.number()) }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무수정
 * @method PATCH
 * @path `/boards/{boardId}/tasks/{taskId}`
 * @description 업무 수정하는 API의 스키마
 */
export const patchTaskSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId, taskId: taskSchema.shape.id }),
  body: taskSchema
    .pick({ title: true, dueDate: true })
    .extend({ assigneeIds: z.array(userSchema.shape.id), positionIds: z.array(z.number()) }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무설명수정
 * @method PATCH
 * @path `/boards/{boardId}/tasks/{taskId}/description`
 * @description 업무 설명 수정하는 API의 스키마
 */
export const patchTaskDescriptionSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId, taskId: taskSchema.shape.id }),
  body: z.object({ description: taskSchema.shape.description }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무상태수정
 * @method PATCH
 * @path `/boards/{boardId}/tasks/{taskId}/status`
 * @description 업무 상태 수정하는 API의 스키마
 */
export const patchTaskStatusSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId, taskId: taskSchema.shape.id }),
  body: z.object({ status: taskSchema.shape.status }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무삭제
 * @method DELETE
 * @path `/boards/{boardId}/tasks/{taskId}`
 * @description 업무 삭제하는 API의 스키마
 */
export const deleteTaskSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId, taskId: taskSchema.shape.id }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무상세조회
 * @method GET
 * @path `/boards/{boardId}/tasks/{taskId}`
 * @description 업무 상세 정보를 조회하는 API의 스키마
 */
export const getTaskDetailSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId, taskId: taskSchema.shape.id }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: taskSchema,
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무상세댓글조회
 * @method GET
 * @path `/boards/{boardId}/tasks/{taskId}/comments`
 * @description 업무 상세 댓글을 조회하는 API의 스키마
 */
export const getTaskDetailCommentsSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId, taskId: taskSchema.shape.id }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(commentSchema),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무상세댓글생성
 * @method POST
 * @path `/boards/{boardId}/tasks/{taskId}/comments`
 * @description 업무 상세 댓글을 생성하는 API의 스키마
 */
export const postTaskDetailCommentSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId, taskId: taskSchema.shape.id }),
  body: z.object({ comment: commentSchema.shape.comment }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무상세댓글수정
 * @method PATCH
 * @path `/boards/{boardId}/tasks/{taskId}/comments/{commentId}`
 * @description 업무 상세 댓글을 수정하는 API의 스키마
 */
export const patchTaskDetailCommentSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
    taskId: taskSchema.shape.id,
    commentId: commentSchema.shape.id,
  }),
  body: z.object({ comment: commentSchema.shape.comment }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무상세댓글삭제
 * @method DELETE
 * @path `/boards/{boardId}/tasks/{taskId}/comments/{commentId}`
 * @description 업무 상세 댓글을 삭제하는 API의 스키마
 */
export const deleteTaskDetailCommentSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
    taskId: taskSchema.shape.id,
    commentId: commentSchema.shape.id,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 업무상태차트조회
 * @method GET
 * @path `/boards/{boardId}/tasks/visualization`
 * @description 업무 상태 차트 데이터를 조회하는 API의 스키마
 */
export const getTaskStatusChartSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: taskStatusChartDataSchema,
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 주간목표달성률조회
 * @method GET
 * @path `/boards/{boardId}/reports/weekly`
 * @description 주간 목표 달성률을 조회하는 API의 스키마
 */
export const getWeeklyGoalAchievementSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: weeklyGoalAchievementSchema,
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 외부링크조회
 * @method GET
 * @path `/boards/{boardId}/shortcuts`
 * @description 외부 링크를 조회하는 API의 스키마
 */
export const getExternalLinksSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(linkSchema),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 외부링크생성
 * @method POST
 * @path `/boards/{boardId}/shortcuts`
 * @description 외부 링크를 생성하는 API의 스키마
 */
export const postExternalLinkSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId }),
  body: linkSchema.pick({ title: true, url: true }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 외부링크삭제
 * @method DELETE
 * @path `/boards/{boardId}/shortcuts/{shortcutId}`
 * @description 외부 링크를 삭제하는 API의 스키마
 */
export const deleteExternalLinkSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId, shortcutId: linkSchema.shape.id }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}
