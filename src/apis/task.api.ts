import PaaSsibleBoard from '@/config/interceptors/board.interceptor'
import * as taskAPISchemas from '@/types/apis/board/task.api.schemas'
import * as TaskAPITypes from '@/types/apis/board/task.api.types'

/**
 * @name 업무목록조회
 * @param path
 */
export const getTaskList = async (
  path: TaskAPITypes.GetTaskList['Path'],
): Promise<TaskAPITypes.GetTaskList['Response']> => {
  const parsedPath = taskAPISchemas.getTaskListSchema.path.parse(path)
  const res = await PaaSsibleBoard.get(`/boards/${parsedPath.boardId}/tasks`)
  return taskAPISchemas.getTaskListSchema.response.parse(res.data)
}

/**
 * @name 업무생성
 * @param path
 * @param body
 */
export const postTask = async (
  path: TaskAPITypes.PostTask['Path'],
  body: TaskAPITypes.PostTask['Body'],
): Promise<TaskAPITypes.PostTask['Response']> => {
  const parsedPath = taskAPISchemas.postTaskSchema.path.parse(path)
  const parsedBody = taskAPISchemas.postTaskSchema.body.parse(body)
  const res = await PaaSsibleBoard.post(`/boards/${parsedPath.boardId}/tasks`, parsedBody)
  return taskAPISchemas.postTaskSchema.response.parse(res.data)
}

/**
 * @name 업무수정
 * @param path
 * @param body
 */
export const patchTask = async (
  path: TaskAPITypes.PatchTask['Path'],
  body: TaskAPITypes.PatchTask['Body'],
): Promise<TaskAPITypes.PatchTask['Response']> => {
  const parsedPath = taskAPISchemas.patchTaskSchema.path.parse(path)
  const parsedBody = taskAPISchemas.patchTaskSchema.body.parse(body)
  const res = await PaaSsibleBoard.patch(
    `/boards/${parsedPath.boardId}/tasks/${parsedPath.taskId}`,
    parsedBody,
  )
  return taskAPISchemas.patchTaskSchema.response.parse(res.data)
}

/**
 * @name 업무설명수정
 * @param path
 * @param body
 */
export const patchTaskDescription = async (
  path: TaskAPITypes.PatchTaskDescription['Path'],
  body: TaskAPITypes.PatchTaskDescription['Body'],
): Promise<TaskAPITypes.PatchTaskDescription['Response']> => {
  const parsedPath = taskAPISchemas.patchTaskDescriptionSchema.path.parse(path)
  const parsedBody = taskAPISchemas.patchTaskDescriptionSchema.body.parse(body)
  const res = await PaaSsibleBoard.patch(
    `/boards/${parsedPath.boardId}/tasks/${parsedPath.taskId}/description`,
    parsedBody,
  )
  return taskAPISchemas.patchTaskDescriptionSchema.response.parse(res.data)
}

/**
 * @name 업무상태수정
 * @param path
 * @param body
 */
export const patchTaskStatus = async (
  path: TaskAPITypes.PatchTaskStatus['Path'],
  body: TaskAPITypes.PatchTaskStatus['Body'],
): Promise<TaskAPITypes.PatchTaskDescription['Response']> => {
  const parsedPath = taskAPISchemas.patchTaskStatusSchema.path.parse(path)
  const parsedBody = taskAPISchemas.patchTaskStatusSchema.body.parse(body)
  const res = await PaaSsibleBoard.patch(
    `/boards/${parsedPath.boardId}/tasks/${parsedPath.taskId}/status`,
    parsedBody,
  )
  return taskAPISchemas.patchTaskStatusSchema.response.parse(res.data)
}

/**
 * @name 업무삭제
 * @param path
 */
export const deleteTask = async (
  path: TaskAPITypes.DeleteTask['Path'],
): Promise<TaskAPITypes.DeleteTask['Response']> => {
  const parsedPath = taskAPISchemas.deleteTaskSchema.path.parse(path)
  const res = await PaaSsibleBoard.delete(
    `/boards/${parsedPath.boardId}/tasks/${parsedPath.taskId}`,
  )
  return taskAPISchemas.deleteTaskSchema.response.parse(res.data)
}

/**
 * @name 업무상세조회
 * @param path
 */
export const getTaskDetail = async (
  path: TaskAPITypes.GetTaskDetail['Path'],
): Promise<TaskAPITypes.GetTaskDetail['Response']> => {
  const parsedPath = taskAPISchemas.getTaskDetailSchema.path.parse(path)
  const res = await PaaSsibleBoard.get(`/boards/${parsedPath.boardId}/tasks/${parsedPath.taskId}`)
  return taskAPISchemas.getTaskDetailSchema.response.parse(res.data)
}

/**
 * @name 업무상세댓글조회
 * @param path
 */
export const getTaskDetailComments = async (
  path: TaskAPITypes.GetTaskDetailComments['Path'],
): Promise<TaskAPITypes.GetTaskDetailComments['Response']> => {
  const parsedPath = taskAPISchemas.getTaskDetailCommentsSchema.path.parse(path)
  const res = await PaaSsibleBoard.get(
    `/boards/${parsedPath.boardId}/tasks/${parsedPath.taskId}/comments`,
  )
  return taskAPISchemas.getTaskDetailCommentsSchema.response.parse(res.data)
}

/**
 * @name 업무상세댓글생성
 * @param path
 * @param body
 */
export const postTaskDetailComment = async (
  path: TaskAPITypes.PostTaskDetailComment['Path'],
  body: TaskAPITypes.PostTaskDetailComment['Body'],
): Promise<TaskAPITypes.PostTaskDetailComment['Response']> => {
  const parsedPath = taskAPISchemas.postTaskDetailCommentSchema.path.parse(path)
  const parsedBody = taskAPISchemas.postTaskDetailCommentSchema.body.parse(body)
  const res = await PaaSsibleBoard.post(
    `/boards/${parsedPath.boardId}/tasks/${parsedPath.taskId}/comments`,
    parsedBody,
  )
  return taskAPISchemas.postTaskDetailCommentSchema.response.parse(res.data)
}

/**
 * @name 업무상세댓글수정
 * @param path
 * @param body
 */
export const patchTaskDetailComment = async (
  path: TaskAPITypes.PatchTaskDetailComment['Path'],
  body: TaskAPITypes.PatchTaskDetailComment['Body'],
): Promise<TaskAPITypes.PatchTaskDetailComment['Response']> => {
  const parsedPath = taskAPISchemas.patchTaskDetailCommentSchema.path.parse(path)
  const parsedBody = taskAPISchemas.patchTaskDetailCommentSchema.body.parse(body)
  const res = await PaaSsibleBoard.patch(
    `/boards/${parsedPath.boardId}/tasks/${parsedPath.taskId}/comments/${parsedPath.commentId}`,
    parsedBody,
  )
  return taskAPISchemas.patchTaskDetailCommentSchema.response.parse(res.data)
}

/**
 * @name 업무상세댓글삭제
 * @param path
 */
export const deleteTaskDetailComment = async (
  path: TaskAPITypes.DeleteTaskDetailComment['Path'],
): Promise<TaskAPITypes.DeleteTaskDetailComment['Response']> => {
  const parsedPath = taskAPISchemas.deleteTaskDetailCommentSchema.path.parse(path)
  const res = await PaaSsibleBoard.delete(
    `/boards/${parsedPath.boardId}/tasks/${parsedPath.taskId}/comments/${parsedPath.commentId}`,
  )
  return taskAPISchemas.deleteTaskDetailCommentSchema.response.parse(res.data)
}

/**
 * @name 업무상태차트조회
 * @param path
 */
export const getTaskStatusChart = async (
  path: TaskAPITypes.GetTaskStatusChart['Path'],
): Promise<TaskAPITypes.GetTaskStatusChart['Response']> => {
  const parsedPath = taskAPISchemas.getTaskStatusChartSchema.path.parse(path)
  const res = await PaaSsibleBoard.get(`/boards/${parsedPath.boardId}/tasks/visualization`)
  return taskAPISchemas.getTaskStatusChartSchema.response.parse(res.data)
}

/**
 * @name 주간목표달성률조회
 * @param path
 */
export const getWeeklyGoalAchievement = async (
  path: TaskAPITypes.GetWeeklyGoalAchievement['Path'],
): Promise<TaskAPITypes.GetWeeklyGoalAchievement['Response']> => {
  const parsedPath = taskAPISchemas.getWeeklyGoalAchievementSchema.path.parse(path)
  const res = await PaaSsibleBoard.get(`/boards/${parsedPath.boardId}/reports/weekly`)
  return taskAPISchemas.getWeeklyGoalAchievementSchema.response.parse(res.data)
}

/**
 * @name 외부링크조회
 * @param path
 */
export const getExternalLinks = async (
  path: TaskAPITypes.GetExternalLinks['Path'],
): Promise<TaskAPITypes.GetExternalLinks['Response']> => {
  const parsedPath = taskAPISchemas.getExternalLinksSchema.path.parse(path)
  const res = await PaaSsibleBoard.get(`/boards/${parsedPath.boardId}/shortcuts`)
  return taskAPISchemas.getExternalLinksSchema.response.parse(res.data)
}

/**
 * @name 외부링크생성
 * @param path
 * @param body
 */
export const postExternalLink = async (
  path: TaskAPITypes.PostExternalLink['Path'],
  body: TaskAPITypes.PostExternalLink['Body'],
): Promise<TaskAPITypes.PostExternalLink['Response']> => {
  const parsedPath = taskAPISchemas.postExternalLinkSchema.path.parse(path)
  const parsedBody = taskAPISchemas.postExternalLinkSchema.body.parse(body)
  const res = await PaaSsibleBoard.post(`/boards/${parsedPath.boardId}/shortcuts`, parsedBody)
  return taskAPISchemas.postExternalLinkSchema.response.parse(res.data)
}

/**
 * @name 외부링크삭제
 * @param path
 */
export const deleteExternalLink = async (
  path: TaskAPITypes.DeleteExternalLink['Path'],
): Promise<TaskAPITypes.DeleteExternalLink['Response']> => {
  const parsedPath = taskAPISchemas.deleteExternalLinkSchema.path.parse(path)
  const res = await PaaSsibleBoard.delete(
    `/boards/${parsedPath.boardId}/shortcuts/${parsedPath.shortcutId}`,
  )
  return taskAPISchemas.deleteExternalLinkSchema.response.parse(res.data)
}
