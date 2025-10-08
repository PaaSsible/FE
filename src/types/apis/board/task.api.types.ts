import type z from 'zod'

import {
  deleteExternalLinkSchema,
  deleteTaskDetailCommentSchema,
  getExternalLinksSchema,
  getTaskStatusChartSchema,
  getWeeklyGoalAchievementSchema,
  postExternalLinkSchema,
  type deleteTaskSchema,
  type getTaskDetailCommentsSchema,
  type getTaskDetailSchema,
  type getTaskListSchema,
  type patchTaskDescriptionSchema,
  type patchTaskDetailCommentSchema,
  type patchTaskSchema,
  type patchTaskStatusSchema,
  type postTaskDetailCommentSchema,
  type postTaskSchema,
} from './task.api.schemas'

/**
 * @name 업무목록조회
 * @method GET
 * @path `/boards/{boardId}/tasks`
 * @description 업무 목록을 조회하는 API의 타입
 */
export type GetTaskList = {
  Path: z.infer<typeof getTaskListSchema.path>
  Response: z.infer<typeof getTaskListSchema.response>
}

/**
 * @name 업무생성
 * @method POST
 * @path `/boards/{boardId}/tasks`
 * @description 업무 생성하는 API의 타입
 */
export type PostTask = {
  Path: z.infer<typeof postTaskSchema.path>
  Body: z.infer<typeof postTaskSchema.body>
  Response: z.infer<typeof postTaskSchema.response>
}

/**
 * @name 업무수정
 * @method PATCH
 * @path `/boards/{boardId}/tasks/{taskId}`
 * @description 업무 수정하는 API의 타입
 */
export type PatchTask = {
  Path: z.infer<typeof patchTaskSchema.path>
  Body: z.infer<typeof patchTaskSchema.body>
  Response: z.infer<typeof patchTaskSchema.response>
}

/**
 * @name 업무설명수정
 * @method PATCH
 * @path `/boards/{boardId}/tasks/{taskId}/description`
 * @description 업무 설명 수정하는 API의 타입
 */
export type PatchTaskDescription = {
  Path: z.infer<typeof patchTaskDescriptionSchema.path>
  Body: z.infer<typeof patchTaskDescriptionSchema.body>
  Response: z.infer<typeof patchTaskDescriptionSchema.response>
}

/**
 * @name 업무상태수정
 * @method PATCH
 * @path `/boards/{boardId}/tasks/{taskId}/status`
 * @description 업무 상태 수정하는 API의 타입
 */
export type PatchTaskStatus = {
  Path: z.infer<typeof patchTaskStatusSchema.path>
  Body: z.infer<typeof patchTaskStatusSchema.body>
  Response: z.infer<typeof patchTaskStatusSchema.response>
}

/**
 * @name 업무삭제
 * @method DELETE
 * @path `/boards/{boardId}/tasks/{taskId}`
 * @description 업무 삭제하는 API의 타입
 */
export type DeleteTask = {
  Path: z.infer<typeof deleteTaskSchema.path>
  Response: z.infer<typeof deleteTaskSchema.response>
}

/**
 * @name 업무상세조회
 * @method GET
 * @path `/boards/{boardId}/tasks/{taskId}`
 * @description 업무 상세 정보를 조회하는 API의 타입
 */
export type GetTaskDetail = {
  Path: z.infer<typeof getTaskDetailSchema.path>
  Response: z.infer<typeof getTaskDetailSchema.response>
}

/**
 * @name 업무상세댓글조회
 * @method GET
 * @path `/boards/{boardId}/tasks/{taskId}/comments`
 * @description 업무 상세 댓글을 조회하는 API의 타입
 */
export type GetTaskDetailComments = {
  Path: z.infer<typeof getTaskDetailCommentsSchema.path>
  Response: z.infer<typeof getTaskDetailCommentsSchema.response>
}

/**
 * @name 업무상세댓글생성
 * @method POST
 * @path `/boards/{boardId}/tasks/{taskId}/comments`
 * @description 업무 상세 댓글을 생성하는 API의 타입
 */
export type PostTaskDetailComment = {
  Path: z.infer<typeof postTaskDetailCommentSchema.path>
  Body: z.infer<typeof postTaskDetailCommentSchema.body>
  Response: z.infer<typeof postTaskDetailCommentSchema.response>
}

/**
 * @name 업무상세댓글수정
 * @method PATCH
 * @path `/boards/{boardId}/tasks/{taskId}/comments/{commentId}`
 * @description 업무 상세 댓글을 수정하는 API의 타입
 */
export type PatchTaskDetailComment = {
  Path: z.infer<typeof patchTaskDetailCommentSchema.path>
  Body: z.infer<typeof patchTaskDetailCommentSchema.body>
  Response: z.infer<typeof patchTaskDetailCommentSchema.response>
}

/**
 * @name 업무상세댓글삭제
 * @method DELETE
 * @path `/boards/{boardId}/tasks/{taskId}/comments/{commentId}`
 * @description 업무 상세 댓글을 삭제하는 API의 타입
 */
export type DeleteTaskDetailComment = {
  Path: z.infer<typeof deleteTaskDetailCommentSchema.path>
  Response: z.infer<typeof deleteTaskDetailCommentSchema.response>
}

/**
 * @name 업무상태차트조회
 * @method GET
 * @path `/boards/{boardId}/tasks/visualization`
 * @description 업무 상태 차트 데이터를 조회하는 API의 타입
 */
export type GetTaskStatusChart = {
  Path: z.infer<typeof getTaskStatusChartSchema.path>
  Response: z.infer<typeof getTaskStatusChartSchema.response>
}

/**
 * @name 주간목표달성률조회
 * @method GET
 * @path `/boards/{boardId}/reports/weekly`
 * @description 주간 목표 달성률을 조회하는 API의 타입
 */
export type GetWeeklyGoalAchievement = {
  Path: z.infer<typeof getWeeklyGoalAchievementSchema.path>
  Response: z.infer<typeof getWeeklyGoalAchievementSchema.response>
}

/**
 * @name 외부링크조회
 * @method GET
 * @path `/boards/{boardId}/shortcuts`
 * @description 외부 링크를 조회하는 API의 타입
 */
export type GetExternalLinks = {
  Path: z.infer<typeof getExternalLinksSchema.path>
  Response: z.infer<typeof getExternalLinksSchema.response>
}

/**
 * @name 외부링크생성
 * @method POST
 * @path `/boards/{boardId}/shortcuts`
 * @description 외부 링크를 생성하는 API의 타입
 */
export type PostExternalLink = {
  Path: z.infer<typeof postExternalLinkSchema.path>
  Body: z.infer<typeof postExternalLinkSchema.body>
  Response: z.infer<typeof postExternalLinkSchema.response>
}

/**
 * @name 외부링크삭제
 * @method DELETE
 * @path `/boards/{boardId}/shortcuts/{shortcutId}`
 * @description 외부 링크를 삭제하는 API의 타입
 */
export type DeleteExternalLink = {
  Path: z.infer<typeof deleteExternalLinkSchema.path>
  Response: z.infer<typeof deleteExternalLinkSchema.response>
}
